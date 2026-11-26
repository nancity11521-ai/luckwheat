/**
 * LUCK WHEAT 幸运无限 - 管理后台线索、合作、备份与工具函数模块 (支持服务端实同步)
 */

let serverLeadsCache = null;
let serverPartnersCache = null;

async function syncLeadsFromServer() {
  if (!serverSyncEnabled) return;
  try {
    const resp = await fetch('/api/leads?t=' + Date.now(), { headers: getAuthHeaders(), cache: 'no-store' });
    if (resp.ok) {
      const json = await resp.json();
      if (json && json.success && Array.isArray(json.items)) {
        serverLeadsCache = json.items;
        return;
      }
      // 如果服务器首次尚未有线索文件，初始化写入默认示例线索
      if (json && json.success && json.items === null) {
        const initArr = (localSiteData && localSiteData.leads) || (window.LUCK_SITE_DEFAULT_DATA?.leads) || [];
        serverLeadsCache = initArr;
        await fetch('/api/leads/save', {
          method: 'POST',
          headers: Object.assign({ 'Content-Type': 'application/json' }, getAuthHeaders()),
          body: JSON.stringify({ items: initArr })
        });
      }
    }
  } catch (e) {}
}

async function syncPartnersFromServer() {
  if (!serverSyncEnabled) return;
  try {
    const resp = await fetch('/api/partners?t=' + Date.now(), { headers: getAuthHeaders(), cache: 'no-store' });
    if (resp.ok) {
      const json = await resp.json();
      if (json && json.success && Array.isArray(json.items)) {
        serverPartnersCache = json.items;
        return;
      }
      if (json && json.success && json.items === null) {
        const initArr = (localSiteData && localSiteData.partnerships) || (window.LUCK_SITE_DEFAULT_DATA?.partnerships) || [];
        serverPartnersCache = initArr;
        await fetch('/api/partners/save', {
          method: 'POST',
          headers: Object.assign({ 'Content-Type': 'application/json' }, getAuthHeaders()),
          body: JSON.stringify({ items: initArr })
        });
      }
    }
  } catch (e) {}
}

// =========================================================================
// 1. 线索与商业合作 CRUD、状态切换及导出 CSV
// =========================================================================
function getLeadsData() {
  if (serverSyncEnabled && Array.isArray(serverLeadsCache)) {
    return serverLeadsCache;
  }
  const saved = localStorage.getItem('LUCK_SITE_LEADS_DATA');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return (localSiteData && localSiteData.leads) || [];
}

async function saveLeadsData(arr) {
  if (serverSyncEnabled) {
    serverLeadsCache = arr;
    try {
      await fetch('/api/leads/save', {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, getAuthHeaders()),
        body: JSON.stringify({ items: arr })
      });
    } catch (e) {}
  }
  try {
    localStorage.setItem('LUCK_SITE_LEADS_DATA', JSON.stringify(arr));
  } catch (e) {}
  if (localSiteData) localSiteData.leads = arr;
  renderLeadsTable();
  renderDashboard();
}

function renderLeadsTable() {
  const leads = getLeadsData();
  const tbody = document.querySelector('#all-leads-table tbody');
  if (!tbody) return;
  if (leads.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:var(--admin-text-muted); padding:24px;">暂无线索数据</td></tr>`;
    return;
  }
  tbody.innerHTML = leads.map((l, idx) => `
    <tr>
      <td><code style="font-size:12px;">${escapeHtml(l.id)}</code></td>
      <td><strong>${escapeHtml(l.name)}</strong></td>
      <td>${escapeHtml(l.phone)}</td>
      <td>${escapeHtml(l.email)}</td>
      <td>${escapeHtml(l.product)}</td>
      <td>${escapeHtml(l.date)}</td>
      <td><span class="status-badge ${l.status === '已确认' || l.status === '已联系' ? 'status-confirmed' : 'status-pending'}">${escapeHtml(l.status)}</span></td>
      <td style="font-size:12px; color:var(--admin-text-muted); max-width:200px;">${escapeHtml(l.notes)}</td>
      <td style="white-space:nowrap;">
        <button type="button" class="btn-pill" style="padding:3px 9px; font-size:11.5px;" onclick="toggleLeadStatus(${idx})">${l.status === '已确认' ? '标为待联系' : '标为已确认'}</button>
        <button type="button" class="btn-pill" style="padding:3px 9px; font-size:11.5px; color:#ff3b30;" onclick="deleteLead(${idx})">删除</button>
      </td>
    </tr>
  `).join('');
}

window.toggleLeadStatus = async function(idx) {
  const leads = getLeadsData().slice();
  if (!leads[idx]) return;
  leads[idx].status = leads[idx].status === '已确认' ? '待联系' : '已确认';
  await saveLeadsData(leads);
  showToast('线索跟进状态已更新并同步！');
};

window.deleteLead = async function(idx) {
  const leads = getLeadsData().slice();
  if (!leads[idx]) return;
  if (confirm(`确定删除线索「${leads[idx].name}」吗？`)) {
    leads.splice(idx, 1);
    await saveLeadsData(leads);
    showToast('线索已删除');
  }
};

window.addManualLead = async function() {
  const name = prompt('请输入客户姓名：', '');
  if (!name || !name.trim()) return;
  const phone = prompt('请输入联系电话：', '') || '-';
  const product = prompt('请输入意向产品：', 'Lucky Mini 旗舰') || 'Lucky Mini 旗舰';
  const notes = prompt('请输入备注说明：', '后台手动录入') || '后台手动录入';
  const leads = getLeadsData().slice();
  leads.unshift({
    id: 'LEAD-' + Date.now().toString().slice(-6),
    name: name.trim(),
    phone: phone.trim(),
    email: '-',
    product: product.trim(),
    date: new Date().toLocaleString('zh-CN', { hour12: false }),
    status: '待联系',
    notes: notes.trim()
  });
  await saveLeadsData(leads);
  showToast('已新增客户线索并同步！');
};

window.exportLeadsToCSV = function() {
  const leads = getLeadsData();
  let csv = '\uFEFF线索单号,客户姓名,联系电话,电子邮箱,意向硬件,提交时间,跟进状态,备注诉求\n';
  leads.forEach(l => {
    csv += `"${l.id}","${l.name}","${l.phone}","${l.email}","${l.product}","${l.date}","${l.status}","${(l.notes || '').replace(/"/g, '""')}"\n`;
  });
  downloadFile('Lucky_Mini_预约线索表_' + new Date().toISOString().slice(0, 10) + '.csv', csv, 'text/csv;charset=utf-8');
};

function getPartnersData() {
  if (serverSyncEnabled && Array.isArray(serverPartnersCache)) {
    return serverPartnersCache;
  }
  const saved = localStorage.getItem('LUCK_SITE_PARTNERSHIPS_DATA');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return (localSiteData && localSiteData.partnerships) || [];
}

async function savePartnersData(arr) {
  if (serverSyncEnabled) {
    serverPartnersCache = arr;
    try {
      await fetch('/api/partners/save', {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, getAuthHeaders()),
        body: JSON.stringify({ items: arr })
      });
    } catch (e) {}
  }
  try {
    localStorage.setItem('LUCK_SITE_PARTNERSHIPS_DATA', JSON.stringify(arr));
  } catch (e) {}
  if (localSiteData) localSiteData.partnerships = arr;
  renderPartnersTable();
  renderDashboard();
}

function renderPartnersTable() {
  const list = getPartnersData();
  const tbody = document.querySelector('#partnerships-table tbody');
  if (!tbody) return;
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:var(--admin-text-muted); padding:24px;">暂无合作意向数据</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map((p, idx) => `
    <tr>
      <td><code style="font-size:12px;">${escapeHtml(p.id)}</code></td>
      <td><strong>${escapeHtml(p.company)}</strong></td>
      <td>${escapeHtml(p.contact)}</td>
      <td>${escapeHtml(p.phone || p.email || '-')}</td>
      <td>${escapeHtml(p.channelType)}</td>
      <td>${escapeHtml(p.region)}</td>
      <td>${escapeHtml(p.expectedVolume)}</td>
      <td><span class="status-badge ${p.status === '已对接' || p.status === '已签约' ? 'status-confirmed' : 'status-pending'}">${escapeHtml(p.status)}</span></td>
      <td style="white-space:nowrap;">
        <button type="button" class="btn-pill" style="padding:3px 9px; font-size:11.5px;" onclick="togglePartnerStatus(${idx})">${p.status === '已对接' ? '标为待跟进' : '标为已对接'}</button>
        <button type="button" class="btn-pill" style="padding:3px 9px; font-size:11.5px; color:#ff3b30;" onclick="deletePartner(${idx})">删除</button>
      </td>
    </tr>
  `).join('');
}

window.togglePartnerStatus = async function(idx) {
  const list = getPartnersData().slice();
  if (!list[idx]) return;
  list[idx].status = list[idx].status === '已对接' ? '待跟进' : '已对接';
  await savePartnersData(list);
  showToast('合作申请状态已更新并同步！');
};

window.deletePartner = async function(idx) {
  const list = getPartnersData().slice();
  if (!list[idx]) return;
  if (confirm(`确定删除企业「${list[idx].company}」的合作申请吗？`)) {
    list.splice(idx, 1);
    await savePartnersData(list);
    showToast('合作申请已删除');
  }
};

window.addManualPartner = async function() {
  const company = prompt('请输入企业/机构名称：', '');
  if (!company || !company.trim()) return;
  const contact = prompt('请输入联系人姓名：', '') || '负责人';
  const phone = prompt('请输入联系方式：', '') || '-';
  const channelType = prompt('请输入合作类型 (如 区域总代 / 跨境电商)：', '区域代理') || '区域代理';
  const region = prompt('请输入目标市场区域：', '华东区') || '全国';
  const list = getPartnersData().slice();
  list.unshift({
    id: 'BIZ-' + Date.now().toString().slice(-6),
    company: company.trim(),
    contact: contact.trim(),
    phone: phone.trim(),
    email: '-',
    channelType: channelType.trim(),
    region: region.trim(),
    expectedVolume: '待商务沟通',
    status: '待跟进'
  });
  await savePartnersData(list);
  showToast('已新增商业合作意向并同步！');
};

window.exportPartnershipsToCSV = function() {
  const list = getPartnersData();
  let csv = '\uFEFF单号,企业全称,联系人,电话,渠道类型,市场区域,预期规模,状态\n';
  list.forEach(p => {
    csv += `"${p.id}","${p.company}","${p.contact}","${p.phone || p.email || '-'}","${p.channelType}","${p.region}","${p.expectedVolume}","${p.status}"\n`;
  });
  downloadFile('Lucky_Infinite_商业代理申请表.csv', csv, 'text/csv;charset=utf-8');
};

// =========================================================================
// 2. 全站数据备份、导入恢复与出厂重置
// =========================================================================
window.exportFullSiteBackup = async function() {
  await saveAllChanges();
  const payload = Object.assign({}, localSiteData, {
    leads: getLeadsData(),
    partnerships: getPartnersData()
  });
  const json = JSON.stringify(payload, null, 2);
  downloadFile('luck_site_full_backup_' + new Date().toISOString().slice(0, 10) + '.json', json, 'application/json');
  showToast('全站数据备份包导出成功！');
};

window.importFullSiteBackup = function(inputEl) {
  const file = inputEl.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      localSiteData = parsed;
      if (Array.isArray(parsed.leads)) await saveLeadsData(parsed.leads);
      if (Array.isArray(parsed.partnerships)) await savePartnersData(parsed.partnerships);

      if (serverSyncEnabled) {
        const resp = await fetch('/api/site-data', {
          method: 'POST',
          headers: Object.assign({ 'Content-Type': 'application/json' }, getAuthHeaders()),
          body: JSON.stringify({ data: localSiteData })
        });
        if (!resp.ok) throw new Error('上传服务器备份包失败');
      } else {
        localStorage.setItem('LUCK_SITE_CONTENT_DATA', JSON.stringify(parsed));
      }
      showToast('数据恢复成功，页面将自动刷新！');
      setTimeout(() => location.reload(), 1200);
    } catch (err) {
      alert('恢复备份失败：' + err.message);
    }
  };
  reader.readAsText(file);
};

window.resetToFactoryDefault = async function() {
  if (confirm('确定要恢复出厂初始设置吗？所有自定义修改将还原为出厂状态！')) {
    localStorage.removeItem('LUCK_SITE_CONTENT_DATA');
    localStorage.removeItem('LUCK_SITE_LEADS_DATA');
    localStorage.removeItem('LUCK_SITE_PARTNERSHIPS_DATA');
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('luck_custom_detail_images_')) localStorage.removeItem(k);
    });
    const defData = JSON.parse(JSON.stringify(window.LUCK_SITE_DEFAULT_DATA || {}));
    localSiteData = defData;
    if (serverSyncEnabled) {
      try {
        await fetch('/api/site-data', {
          method: 'POST',
          headers: Object.assign({ 'Content-Type': 'application/json' }, getAuthHeaders()),
          body: JSON.stringify({ data: defData })
        });
      } catch (e) {}
    }
    showToast('已重置为出厂初始数据！');
    setTimeout(() => location.reload(), 1000);
  }
};

// =========================================================================
// 3. 辅助通用函数
// =========================================================================
function safeSetVal(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined) el.value = val;
}
function getVal(id) {
  const el = document.getElementById(id);
  return (el && el.value !== undefined && el.value !== null) ? String(el.value).trim() : '';
}
function showToast(msg) {
  const t = document.getElementById('toast-msg');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}
function downloadFile(filename, text, type) {
  const blob = new Blob([text], { type: type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
