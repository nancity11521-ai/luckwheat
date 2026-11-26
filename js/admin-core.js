/**
 * LUCK WHEAT 幸运无限 - 管理后台核心模块 (服务端鉴权、数据同步中心、仪表盘、动态全模块引擎)
 */
let currentActivePanel = 'dashboard';
let localSiteData = null;
let serverSyncEnabled = false;

document.addEventListener('DOMContentLoaded', async () => {
  await detectServerHealth();
  initLoginListeners();
  await verifyAndEnterAdmin();
});

// =========================================================================
// 0. 服务端连通性与公共工具 (图片压缩+直传服务器)
// =========================================================================
async function detectServerHealth() {
  const badge = document.getElementById('server-sync-badge');
  if (window.location.protocol === 'file:') {
    serverSyncEnabled = false;
    updateSyncBadge(false, '🟡 本地文件演示模式 (仅本地保存)');
    return;
  }
  try {
    const resp = await fetch('/api/health?t=' + Date.now(), { cache: 'no-store', signal: AbortSignal.timeout(3000) });
    if (resp.ok) {
      const json = await resp.json();
      if (json && json.ok) {
        serverSyncEnabled = true;
        updateSyncBadge(true, '🟢 服务器实时同步已连接');
        return;
      }
    }
  } catch (e) {}
  serverSyncEnabled = false;
  updateSyncBadge(false, '🟡 纯静态主机模式 (保存后可导出覆盖包)');
  if (badge) badge.title = '当前未检测到 server.py 服务端，修改将暂存本机并可点击系统设置导出 site_live_data.js 上传服务器';
}

function updateSyncBadge(isOnline, text) {
  const badge = document.getElementById('server-sync-badge');
  if (!badge) return;
  badge.textContent = text;
  badge.style.background = isOnline ? '#e3f9e5' : '#fff4e5';
  badge.style.color = isOnline ? '#1d7c38' : '#b76e00';
  badge.style.borderColor = isOnline ? 'rgba(52, 199, 89, 0.35)' : 'rgba(255, 149, 0, 0.35)';
}

function getAuthToken() {
  return sessionStorage.getItem('LUCK_ADMIN_TOKEN') || '';
}

function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { 'Authorization': 'Bearer ' + token } : {};
}

window.compressImageFile = function(file, maxWidth, quality) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
        resolve(e.target.result);
        return;
      }
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > maxWidth) {
          h = Math.round((h * maxWidth) / w);
          w = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const outMime = (file.type === 'image/png' || file.type === 'image/webp') ? file.type : 'image/jpeg';
        resolve(canvas.toDataURL(outMime, quality));
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

window.compressAndUploadImage = async function(file, maxWidth = 1400, quality = 0.85, prefix = 'cms') {
  const dataUrl = await compressImageFile(file, maxWidth, quality);
  if (!serverSyncEnabled || !dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }
  try {
    const resp = await fetch('/api/upload-image', {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, getAuthHeaders()),
      body: JSON.stringify({ dataUrl, prefix })
    });
    if (resp.status === 401) {
      handleSessionExpired();
      return dataUrl;
    }
    const json = await resp.json();
    if (resp.ok && json && json.success && json.url) {
      return json.url;
    }
  } catch (err) {
    console.warn('[Upload] 直传服务器失败，回退为压缩内联数据', err);
  }
  return dataUrl;
};

function handleSessionExpired() {
  sessionStorage.removeItem('LUCK_ADMIN_TOKEN');
  sessionStorage.removeItem('LUCK_ADMIN_AUTH');
  const overlay = document.getElementById('login-overlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    overlay.style.display = 'flex';
  }
  showToast('登录凭证已失效，请重新登录以保存至服务器');
}

// =========================================================================
// 1. 登录校验与密码管理 (全面移除公网免密后门，支持服务端安全验证)
// =========================================================================
function getLocalFallbackPassword() {
  return localStorage.getItem('LUCK_ADMIN_PWD') || 'luck2026';
}

function showLoginOverlay(show) {
  const overlay = document.getElementById('login-overlay');
  if (!overlay) return;
  if (show) {
    overlay.classList.remove('hidden');
    overlay.style.display = 'flex';
  } else {
    overlay.classList.add('hidden');
    overlay.style.display = 'none';
  }
}

async function verifyAndEnterAdmin() {
  if (serverSyncEnabled) {
    const token = getAuthToken();
    if (token) {
      try {
        const resp = await fetch('/api/admin/verify', { headers: getAuthHeaders(), cache: 'no-store' });
        const json = await resp.json();
        if (json && json.authenticated) {
          sessionStorage.setItem('LUCK_ADMIN_AUTH', 'true');
          showLoginOverlay(false);
          await bootstrapAdminWorkspace();
          return;
        }
      } catch (e) {}
    }
    showLoginOverlay(true);
    return;
  }

  // 非服务端模式（本地静态演示）
  const isAuth = sessionStorage.getItem('LUCK_ADMIN_AUTH') === 'true';
  if (isAuth) {
    showLoginOverlay(false);
    await bootstrapAdminWorkspace();
  } else {
    showLoginOverlay(true);
  }
}

let hasBootstrapped = false;
async function bootstrapAdminWorkspace() {
  await loadDataCenter();
  if (typeof syncLeadsFromServer === 'function') await syncLeadsFromServer();
  if (typeof syncPartnersFromServer === 'function') await syncPartnersFromServer();

  if (!hasBootstrapped) {
    hasBootstrapped = true;
    initNavInteractions();
    renderDashboard();
    initCmsForm();
    initSeoForm();
    renderLeadsTable();
    renderPartnersTable();

    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) switchNav(tabParam);
  } else {
    renderDashboard();
    initCmsForm();
    initSeoForm();
    renderLeadsTable();
    renderPartnersTable();
  }
}

function initLoginListeners() {
  const submitLogin = async () => {
    const u = document.getElementById('login-user').value.trim();
    const p = document.getElementById('login-pwd').value.trim();
    const btn = document.getElementById('btn-login-submit');

    if (!u || !p) {
      alert('请输入管理员账号与密码');
      return;
    }

    if (serverSyncEnabled) {
      if (btn) { btn.disabled = true; btn.textContent = '正在验证登录...'; }
      try {
        const resp = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: u, password: p })
        });
        const json = await resp.json();
        if (resp.ok && json && json.success && json.token) {
          sessionStorage.setItem('LUCK_ADMIN_TOKEN', json.token);
          sessionStorage.setItem('LUCK_ADMIN_AUTH', 'true');
          showLoginOverlay(false);
          await bootstrapAdminWorkspace();
          showToast('欢迎登录 LUCK WHEAT 管理后台！(服务端同步已就绪)');
        } else {
          alert(json.error || '账号或密码错误！');
        }
      } catch (err) {
        alert('连接认证服务器失败，请检查 server.py 是否正常运行');
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = '登 录 系 统'; }
      }
      return;
    }

    // 静态/本地降级登录
    if (u === 'admin' && p === getLocalFallbackPassword()) {
      sessionStorage.setItem('LUCK_ADMIN_AUTH', 'true');
      showLoginOverlay(false);
      await bootstrapAdminWorkspace();
      showToast('欢迎登录 LUCK WHEAT 管理后台！');
    } else {
      alert('账号或密码错误！');
    }
  };

  document.getElementById('btn-login-submit')?.addEventListener('click', submitLogin);
  document.getElementById('login-pwd')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitLogin();
  });

  document.getElementById('btn-logout')?.addEventListener('click', () => {
    sessionStorage.removeItem('LUCK_ADMIN_AUTH');
    sessionStorage.removeItem('LUCK_ADMIN_TOKEN');
    location.reload();
  });
}

window.updateAdminPassword = async function() {
  const oldPwd = getVal('setting-old-pwd');
  const newPwd = getVal('setting-new-pwd');
  const confirmPwd = getVal('setting-confirm-pwd');

  if (!oldPwd || !newPwd || !confirmPwd) {
    alert('请完整填写当前密码、新密码与确认密码！');
    return;
  }
  if (newPwd.length < 6) {
    alert('新密码长度至少为 6 位字符！');
    return;
  }
  if (newPwd !== confirmPwd) {
    alert('两次输入的新密码不一致！');
    return;
  }

  if (serverSyncEnabled) {
    try {
      const resp = await fetch('/api/admin/password', {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, getAuthHeaders()),
        body: JSON.stringify({ oldPassword: oldPwd, newPassword: newPwd })
      });
      const json = await resp.json();
      if (!resp.ok || !json.success) {
        alert(json.error || '密码修改失败！');
        return;
      }
    } catch (e) {
      alert('请求修改密码失败，请检查网络连接');
      return;
    }
  } else {
    if (oldPwd !== getLocalFallbackPassword()) {
      alert('当前密码不正确！');
      return;
    }
    localStorage.setItem('LUCK_ADMIN_PWD', newPwd);
  }

  safeSetVal('setting-old-pwd', '');
  safeSetVal('setting-new-pwd', '');
  safeSetVal('setting-confirm-pwd', '');
  showToast('管理员密码已安全更新！下次登录请使用新密码');
};

// =========================================================================
// 2. 数据中心载入与服务端真持久化
// =========================================================================
function deepMerge(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = deepMerge(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

async function loadDataCenter() {
  const defaultData = window.LUCK_SITE_DEFAULT_DATA || {};
  const staticLive = (window.LUCK_SITE_LIVE_DATA && isObject(window.LUCK_SITE_LIVE_DATA))
    ? window.LUCK_SITE_LIVE_DATA
    : null;

  let baseData = staticLive ? deepMerge(defaultData, staticLive) : JSON.parse(JSON.stringify(defaultData));

  if (serverSyncEnabled) {
    try {
      const resp = await fetch('/api/site-data?t=' + Date.now(), { cache: 'no-store' });
      const json = await resp.json();
      if (json && json.success && json.exists && json.data) {
        localSiteData = deepMerge(defaultData, json.data);
        return;
      }
      // 服务端尚未首次写入过数据：如本地留有之前测试编辑草稿，询问是否迁移推上服务器
      const savedDraft = localStorage.getItem('LUCK_SITE_CONTENT_DATA');
      if (savedDraft) {
        try {
          const parsedDraft = JSON.parse(savedDraft);
          localSiteData = deepMerge(baseData, parsedDraft);
          if (confirm('检测到当前浏览器有尚未发布到服务器的本地编辑内容，是否加载并在保存后同步至服务器全网？\n\n点击“确定”保留该草稿并准备发布；点击“取消”直接载入纯净官网默认数据。')) {
            return;
          }
        } catch (e) {}
      }
    } catch (e) {
      console.warn('[CMS] 读取服务端数据失败，回退默认数据', e);
    }
    localSiteData = baseData;
    return;
  }

  // 非服务端模式：合并本地缓存
  const saved = localStorage.getItem('LUCK_SITE_CONTENT_DATA');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      localSiteData = deepMerge(baseData, parsed);
      return;
    } catch (e) {}
  }
  localSiteData = baseData;
}

window.saveAllChanges = async function() {
  syncCmsInputsToData();
  syncDynamicModulesToData();
  if (typeof syncSeoInputsToData === 'function') syncSeoInputsToData();

  if (serverSyncEnabled) {
    const saveBtn = document.getElementById('btn-save-all');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.dataset.origHtml = saveBtn.innerHTML;
      saveBtn.textContent = '⏳ 正在同步服务器...';
    }
    try {
      const resp = await fetch('/api/site-data', {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, getAuthHeaders()),
        body: JSON.stringify({ data: localSiteData })
      });
      if (resp.status === 401) {
        handleSessionExpired();
        return;
      }
      const json = await resp.json();
      if (!resp.ok || !json.success) {
        throw new Error(json.error || '服务器写入返回失败');
      }
      if (json.data) {
        // 服务器已经把巨大 Base64 图片转存为真实文件路径，更新内存对象
        localSiteData = deepMerge(window.LUCK_SITE_DEFAULT_DATA || {}, json.data);
        try {
          localStorage.setItem('LUCK_SITE_CONTENT_DATA', JSON.stringify(localSiteData));
        } catch (storageErr) {}
      }
      renderDashboard();
      showToast(`✅ 全站修改已成功保存并同步至服务器！(${json.updatedAt || '刚刚'})`);
    } catch (err) {
      alert('保存到服务器失败：' + err.message);
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        if (saveBtn.dataset.origHtml) saveBtn.innerHTML = saveBtn.dataset.origHtml;
      }
    }
    return;
  }

  // 纯静态模式兜底保存到本地并提醒导出
  try {
    localStorage.setItem('LUCK_SITE_CONTENT_DATA', JSON.stringify(localSiteData));
    renderDashboard();
    showToast('已在本机保存成功！(若上传纯静态空间请去系统设置导出覆盖文件)');
  } catch (err) {
    alert('本地保存失败：浏览器的 localStorage 存储已满（约5MB），请启动 server.py 服务端存储大图或在系统设置直接导出部署脚本。');
  }
};
document.getElementById('btn-save-all')?.addEventListener('click', saveAllChanges);

// 导出可直接覆盖到服务器 data/site_live_data.js 的静态脚本（供纯静态托管主机使用）
window.exportStaticPublishScript = function() {
  syncCmsInputsToData();
  syncDynamicModulesToData();
  if (typeof syncSeoInputsToData === 'function') syncSeoInputsToData();

  const publicData = Object.assign({}, localSiteData);
  delete publicData.leads;
  delete publicData.partnerships;

  const content =
    "/**\n" +
    " * LUCK WHEAT 幸运无限 - 服务器发布数据快照 (" + new Date().toLocaleString('zh-CN', { hour12: false }) + ")\n" +
    " */\n" +
    "window.LUCK_SITE_LIVE_DATA = " + JSON.stringify(publicData) + ";\n";

  downloadFile('site_live_data.js', content, 'application/javascript;charset=utf-8');
  showToast('已生成同步脚本 site_live_data.js！上传覆盖服务器 data/ 目录即可全局生效');
};

// =========================================================================
// 3. 导航切换
// =========================================================================
let navListenersBound = false;
function initNavInteractions() {
  if (!navListenersBound) {
    navListenersBound = true;
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const target = item.getAttribute('data-target');
        switchNav(target);
      });
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const cmsParam = urlParams.get('cms_page');
  if (cmsParam) {
    const sel = document.getElementById('cms-page-selector');
    if (sel) {
      sel.value = cmsParam;
      sel.dispatchEvent(new Event('change'));
    }
  }
}

window.switchNav = function(targetId) {
  if (targetId === 'products') {
    switchNav('cms');
    const sel = document.getElementById('cms-page-selector');
    if (sel) {
      sel.value = 'products';
      sel.dispatchEvent(new Event('change'));
    }
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(i => i.classList.remove('active'));
    const activeNav = document.querySelector(`.sidebar-nav .nav-item[data-target="products"]`);
    if (activeNav) activeNav.classList.add('active');
    document.getElementById('page-current-title').textContent = '产品中心 · 商品与详情页管理 (Master-Detail)';
    currentActivePanel = 'products';
    return;
  }

  document.querySelectorAll('.sidebar-nav .nav-item').forEach(i => i.classList.remove('active'));
  const activeNav = document.querySelector(`.sidebar-nav .nav-item[data-target="${targetId}"]`);
  if (activeNav) activeNav.classList.add('active');

  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`panel-${targetId}`);
  if (panel) panel.classList.add('active');

  const titles = {
    dashboard: '运营仪表盘',
    cms: '全站图文内容可视化编辑 (CMS)',
    seo: 'SEO 优化中心与搜索结果模拟',
    leads: '预约与客户线索管理',
    partnerships: '商业代理合作意向',
    settings: '全站系统设置与数据备份'
  };
  document.getElementById('page-current-title').textContent = titles[targetId] || '管理后台';
  currentActivePanel = targetId;
  if (targetId === 'dashboard') renderDashboard();
};

// =========================================================================
// 4. 运营仪表盘实时指标渲染
// =========================================================================
window.renderDashboard = function() {
  const leads = getLeadsData();
  const partners = getPartnersData();
  const products = getProductItemsArray();

  const pendingLeads = leads.filter(l => l.status !== '已确认' && l.status !== '已联系').length;
  const pendingPartners = partners.filter(p => p.status !== '已签约' && p.status !== '已对接').length;

  const setTxt = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  };
  setTxt('dash-metric-leads', leads.length);
  setTxt('dash-metric-leads-sub', `${pendingLeads} 待跟进`);
  setTxt('dash-metric-partners', partners.length);
  setTxt('dash-metric-partners-sub', `${pendingPartners} 待对接`);
  setTxt('dash-metric-products', products.length);
  setTxt('dash-metric-products-sub', `款单品`);

  const seoPages = (localSiteData && localSiteData.seo && localSiteData.seo.pages) || {};
  const pageKeys = ['index', 'products', 'lucky_mini', 'support', 'channels', 'partners', 'about', 'contact'];
  let seoScore = 0;
  pageKeys.forEach(k => {
    const p = seoPages[k] || {};
    let pts = 0;
    if (p.title && p.title.length >= 10) pts += 4;
    if (p.description && p.description.length >= 20) pts += 4;
    if (p.keywords && p.keywords.length >= 3) pts += 4.5;
    seoScore += pts;
  });
  setTxt('dash-metric-seo', Math.min(100, Math.round(seoScore)));

  const tbody = document.querySelector('#dashboard-leads-table tbody');
  if (!tbody) return;
  tbody.innerHTML = leads.slice(0, 5).map(l => `
    <tr>
      <td><strong>${escapeHtml(l.name)}</strong></td>
      <td>${escapeHtml(l.phone)}</td>
      <td>${escapeHtml(l.product)}</td>
      <td>${escapeHtml(l.date)}</td>
      <td><span class="status-badge ${l.status === '已确认' || l.status === '已联系' ? 'status-confirmed' : 'status-pending'}">${escapeHtml(l.status)}</span></td>
    </tr>
  `).join('');
};

// =========================================================================
// 5. 动态全模块编辑器渲染与同步
// =========================================================================
function renderAllDynamicModules() {
  const schema = window.LUCK_PAGE_MODULES_SCHEMA || {};
  Object.keys(schema).forEach(pageKey => {
    renderDynamicModulesForPage(pageKey);
  });
}

function renderDynamicModulesForPage(pageKey) {
  const container = document.getElementById(`dyn-modules-${pageKey}`);
  const sections = (window.LUCK_PAGE_MODULES_SCHEMA || {})[pageKey];
  if (!container || !sections) return;

  if (!localSiteData.content) localSiteData.content = {};
  if (!localSiteData.content[pageKey]) localSiteData.content[pageKey] = {};
  const pageData = localSiteData.content[pageKey];

  container.innerHTML = sections.map((sec, sIdx) => {
    const fieldsHtml = sec.fields.map(f => {
      if (f.type === 'text' || f.type === 'textarea') {
        const val = pageData[f.key] !== undefined ? pageData[f.key] : '';
        if (f.type === 'textarea') {
          return `
            <div class="form-group">
              <label class="form-label">${escapeHtml(f.label)} <code style="font-size:11px; color:#86868b; font-weight:normal;">${escapeHtml(f.key)}</code></label>
              <textarea class="form-textarea dyn-field-input" data-page="${pageKey}" data-key="${f.key}" style="min-height:66px;">${escapeHtml(val)}</textarea>
            </div>
          `;
        }
        return `
          <div class="form-group">
            <label class="form-label">${escapeHtml(f.label)} <code style="font-size:11px; color:#86868b; font-weight:normal;">${escapeHtml(f.key)}</code></label>
            <input type="text" class="form-input dyn-field-input" data-page="${pageKey}" data-key="${f.key}" value="${escapeHtml(val)}">
          </div>
        `;
      }

      if (f.type === 'list') {
        const arr = Array.isArray(pageData[f.key]) ? pageData[f.key] : [];
        return `
          <div style="margin-bottom: 18px;">
            <div class="dyn-section-title" style="margin-bottom:10px;">
              <span style="font-size:13.5px;">${escapeHtml(f.label)} (${arr.length} 项)</span>
              <button type="button" class="btn-pill btn-pill-blue" style="padding:3px 10px; font-size:12px;" onclick="addDynListItem('${pageKey}', '${f.key}')">➕ 新增${escapeHtml(f.itemLabel || '条目')}</button>
            </div>
            <div class="dyn-list-container" data-page="${pageKey}" data-key="${f.key}">
              ${arr.map((item, idx) => `
                <div class="dyn-list-item" data-idx="${idx}">
                  <div class="dyn-list-header">
                    <span>${escapeHtml(f.itemLabel || '项目')} #${idx + 1}</span>
                    <div style="display:flex; gap:4px;">
                      <button type="button" class="btn-pill" style="padding:2px 7px; font-size:11px;" onclick="moveDynListItem('${pageKey}', '${f.key}', ${idx}, -1)" ${idx === 0 ? 'disabled' : ''}>⬆️</button>
                      <button type="button" class="btn-pill" style="padding:2px 7px; font-size:11px;" onclick="moveDynListItem('${pageKey}', '${f.key}', ${idx}, 1)" ${idx === arr.length - 1 ? 'disabled' : ''}>⬇️</button>
                      <button type="button" class="btn-pill" style="padding:2px 7px; font-size:11px; color:#ff3b30;" onclick="deleteDynListItem('${pageKey}', '${f.key}', ${idx})">✕</button>
                    </div>
                  </div>
                  <div class="dyn-grid-2">
                    ${f.fields.map(subF => {
                      const subVal = item[subF.key] !== undefined ? item[subF.key] : '';
                      if (subF.type === 'textarea') {
                        return `
                          <div style="grid-column: 1 / -1;">
                            <label class="form-label" style="font-size:12px; margin-bottom:4px;">${escapeHtml(subF.label)}</label>
                            <textarea class="form-textarea dyn-item-input" data-subkey="${subF.key}" style="min-height:58px; font-size:13px;">${escapeHtml(subVal)}</textarea>
                          </div>
                        `;
                      }
                      return `
                        <div>
                          <label class="form-label" style="font-size:12px; margin-bottom:4px;">${escapeHtml(subF.label)}</label>
                          <input type="text" class="form-input dyn-item-input" data-subkey="${subF.key}" value="${escapeHtml(subVal)}" style="height:36px; font-size:13px;">
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      if (f.type === 'nested_list') {
        const subKeyName = f.subKey || 'links';
        const arr = Array.isArray(pageData[f.key]) ? pageData[f.key] : [];
        return `
          <div style="margin-bottom: 18px;">
            <div class="dyn-section-title" style="margin-bottom:10px;">
              <span style="font-size:13.5px;">${escapeHtml(f.label)} (${arr.length} 栏)</span>
              <button type="button" class="btn-pill btn-pill-blue" style="padding:3px 10px; font-size:12px;" onclick="addDynListItem('${pageKey}', '${f.key}')">➕ 新增${escapeHtml(f.itemLabel || '栏目')}</button>
            </div>
            <div class="dyn-nested-container" data-page="${pageKey}" data-key="${f.key}" data-subarr="${subKeyName}">
              ${arr.map((col, idx) => {
                const subArr = Array.isArray(col[subKeyName]) ? col[subKeyName] : [];
                return `
                  <div class="dyn-list-item" data-idx="${idx}">
                    <div class="dyn-list-header">
                      <span>${escapeHtml(f.itemLabel || '栏目')} #${idx + 1}</span>
                      <div style="display:flex; gap:4px;">
                        <button type="button" class="btn-pill" style="padding:2px 7px; font-size:11px;" onclick="moveDynListItem('${pageKey}', '${f.key}', ${idx}, -1)" ${idx === 0 ? 'disabled' : ''}>⬆️</button>
                        <button type="button" class="btn-pill" style="padding:2px 7px; font-size:11px;" onclick="moveDynListItem('${pageKey}', '${f.key}', ${idx}, 1)" ${idx === arr.length - 1 ? 'disabled' : ''}>⬇️</button>
                        <button type="button" class="btn-pill" style="padding:2px 7px; font-size:11px; color:#ff3b30;" onclick="deleteDynListItem('${pageKey}', '${f.key}', ${idx})">✕</button>
                      </div>
                    </div>
                    <div class="form-group" style="margin-bottom:12px;">
                      <label class="form-label" style="font-size:12px;">栏目标题</label>
                      <input type="text" class="form-input dyn-nested-title" data-subkey="title" value="${escapeHtml(col.title || '')}" style="height:36px; font-size:13px;">
                    </div>
                    <div style="background:#fafafc; padding:10px; border-radius:8px; border:1px solid rgba(0,0,0,0.05);">
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-size:12px; font-weight:600; color:#555;">${escapeHtml(f.subLabel || '子链接')} (${subArr.length})</span>
                        <button type="button" class="btn-pill" style="padding:2px 8px; font-size:11px;" onclick="addDynSubLink('${pageKey}', '${f.key}', ${idx})">➕ 添加链接</button>
                      </div>
                      <div class="dyn-sublinks-list" style="display:flex; flex-direction:column; gap:6px;">
                        ${subArr.map((lk, lIdx) => `
                          <div class="dyn-sublink-row" style="display:grid; grid-template-columns:1fr 1.2fr auto; gap:8px; align-items:center;">
                            <input type="text" class="form-input dyn-sublink-input" data-lkey="label" value="${escapeHtml(lk.label || '')}" placeholder="链接名称" style="height:32px; font-size:12.5px;">
                            <input type="text" class="form-input dyn-sublink-input" data-lkey="href" value="${escapeHtml(lk.href || '')}" placeholder="链接地址" style="height:32px; font-size:12.5px;">
                            <button type="button" class="btn-pill" style="padding:2px 7px; font-size:11px; color:#ff3b30;" onclick="deleteDynSubLink('${pageKey}', '${f.key}', ${idx}, ${lIdx})">✕</button>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }
      return '';
    }).join('');

    return `
      <div class="dyn-section-card" data-section-idx="${sIdx}">
        <div class="dyn-section-title">
          <span>🧩 ${escapeHtml(sec.title)}</span>
        </div>
        ${fieldsHtml}
      </div>
    `;
  }).join('');
}

function getNestedSubKey(pageKey, fieldKey) {
  const sections = (window.LUCK_PAGE_MODULES_SCHEMA || {})[pageKey] || [];
  for (const s of sections) {
    for (const f of s.fields) {
      if (f.key === fieldKey && f.subKey) return f.subKey;
    }
  }
  return 'links';
}

function syncDynamicModulesToData() {
  if (!localSiteData.content) localSiteData.content = {};

  document.querySelectorAll('.dyn-field-input').forEach(el => {
    const page = el.getAttribute('data-page');
    const key = el.getAttribute('data-key');
    if (!page || !key) return;
    if (!localSiteData.content[page]) localSiteData.content[page] = {};
    localSiteData.content[page][key] = el.value.trim();
  });

  document.querySelectorAll('.dyn-list-container').forEach(container => {
    const page = container.getAttribute('data-page');
    const key = container.getAttribute('data-key');
    if (!page || !key) return;
    if (!localSiteData.content[page]) localSiteData.content[page] = {};
    const items = [];
    container.querySelectorAll('.dyn-list-item').forEach(row => {
      const obj = {};
      row.querySelectorAll('.dyn-item-input').forEach(inp => {
        const subkey = inp.getAttribute('data-subkey');
        if (subkey) obj[subkey] = inp.value.trim();
      });
      items.push(obj);
    });
    localSiteData.content[page][key] = items;
  });

  document.querySelectorAll('.dyn-nested-container').forEach(container => {
    const page = container.getAttribute('data-page');
    const key = container.getAttribute('data-key');
    const subarrKey = container.getAttribute('data-subarr') || 'links';
    if (!page || !key) return;
    if (!localSiteData.content[page]) localSiteData.content[page] = {};
    const cols = [];
    container.querySelectorAll('.dyn-list-item').forEach(colEl => {
      const title = colEl.querySelector('.dyn-nested-title')?.value.trim() || '';
      const links = [];
      colEl.querySelectorAll('.dyn-sublink-row').forEach(lRow => {
        const lObj = {};
        lRow.querySelectorAll('.dyn-sublink-input').forEach(inp => {
          const lkey = inp.getAttribute('data-lkey');
          if (lkey) lObj[lkey] = inp.value.trim();
        });
        links.push(lObj);
      });
      cols.push({ title, [subarrKey]: links });
    });
    localSiteData.content[page][key] = cols;
  });
}

window.addDynListItem = function(pageKey, fieldKey) {
  syncDynamicModulesToData();
  const sections = (window.LUCK_PAGE_MODULES_SCHEMA || {})[pageKey] || [];
  let fieldSchema = null;
  sections.forEach(s => s.fields.forEach(f => { if (f.key === fieldKey) fieldSchema = f; }));
  if (!localSiteData.content[pageKey]) localSiteData.content[pageKey] = {};
  if (!Array.isArray(localSiteData.content[pageKey][fieldKey])) localSiteData.content[pageKey][fieldKey] = [];

  if (fieldSchema && fieldSchema.type === 'nested_list') {
    const subKey = fieldSchema.subKey || 'links';
    localSiteData.content[pageKey][fieldKey].push({ title: '新栏目', [subKey]: [{ label: '新链接', href: 'index.html' }] });
  } else if (fieldSchema && Array.isArray(fieldSchema.fields)) {
    const newObj = {};
    fieldSchema.fields.forEach(sf => { newObj[sf.key] = ''; });
    localSiteData.content[pageKey][fieldKey].push(newObj);
  }
  renderDynamicModulesForPage(pageKey);
};

window.moveDynListItem = function(pageKey, fieldKey, idx, dir) {
  syncDynamicModulesToData();
  const arr = localSiteData.content[pageKey] && localSiteData.content[pageKey][fieldKey];
  if (!Array.isArray(arr)) return;
  const target = idx + dir;
  if (target < 0 || target >= arr.length) return;
  [arr[idx], arr[target]] = [arr[target], arr[idx]];
  renderDynamicModulesForPage(pageKey);
};

window.deleteDynListItem = function(pageKey, fieldKey, idx) {
  syncDynamicModulesToData();
  const arr = localSiteData.content[pageKey] && localSiteData.content[pageKey][fieldKey];
  if (!Array.isArray(arr)) return;
  arr.splice(idx, 1);
  renderDynamicModulesForPage(pageKey);
};

window.addDynSubLink = function(pageKey, fieldKey, colIdx) {
  syncDynamicModulesToData();
  const subKey = getNestedSubKey(pageKey, fieldKey);
  const col = localSiteData.content[pageKey]?.[fieldKey]?.[colIdx];
  if (!col) return;
  if (!Array.isArray(col[subKey])) col[subKey] = [];
  col[subKey].push({ label: '新链接', href: 'index.html' });
  renderDynamicModulesForPage(pageKey);
};

window.deleteDynSubLink = function(pageKey, fieldKey, colIdx, linkIdx) {
  syncDynamicModulesToData();
  const subKey = getNestedSubKey(pageKey, fieldKey);
  const col = localSiteData.content[pageKey]?.[fieldKey]?.[colIdx];
  if (!col || !Array.isArray(col[subKey])) return;
  col[subKey].splice(linkIdx, 1);
  renderDynamicModulesForPage(pageKey);
};

// =========================================================================
// 6. CMS 基础表单初始化与同步
// =========================================================================
let cmsSelectorBound = false;
function initCmsForm() {
  const selector = document.getElementById('cms-page-selector');
  function updateCmsPageView() {
    const val = selector.value;
    document.querySelectorAll('.cms-page-view').forEach(v => v.style.display = 'none');
    const view = document.getElementById(`cms-view-${val}`);
    if (view) view.style.display = 'block';
    if (val === 'media_library') renderMediaLibrary();
    if (val === 'quick_replace') renderQuickReplacements();
    if (val === 'products') {
      const currentIdx = parseInt(document.getElementById('edit-prod-index')?.value || '0', 10);
      loadProductIntoEditor(isNaN(currentIdx) ? 0 : currentIdx, false, true);
    }
  }
  if (!cmsSelectorBound && selector) {
    cmsSelectorBound = true;
    selector.addEventListener('change', updateCmsPageView);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const cmsPageParam = urlParams.get('cms_page');
  if (cmsPageParam && selector.querySelector(`option[value="${cmsPageParam}"]`)) {
    selector.value = cmsPageParam;
  }

  const c = localSiteData.content || {};
  const idx = c.index || {};
  const pro = c.products || {};
  const mini = c.lucky_mini || {};
  const supp = c.support || {};
  const chan = c.channels || {};
  const part = c.partners || {};
  const abt = c.about || {};
  const cont = c.contact || {};
  const glob = c.global || {};
  const imgsMap = localSiteData.images || {};

  safeSetVal('cms-index-hero-badge', idx.hero_badge);
  safeSetVal('cms-index-hero-title', idx.hero_title);
  safeSetVal('cms-index-hero-sub', idx.hero_subtitle);
  safeSetVal('cms-index-hero-btn1', idx.hero_btn_primary);
  safeSetVal('cms-index-hero-btn2', idx.hero_btn_secondary);
  safeSetVal('cms-index-hero-b-left', idx.hero_badge_left);
  safeSetVal('cms-index-hero-b-right', idx.hero_badge_right);
  safeSetVal('cms-index-hero2-badge', idx.hero_slide2_badge);
  safeSetVal('cms-index-hero2-title', idx.hero_slide2_title);
  safeSetVal('cms-index-hero2-sub', idx.hero_slide2_sub);
  safeSetVal('cms-index-hero3-title', idx.hero_slide3_title);
  safeSetVal('cms-index-hero3-sub', idx.hero_slide3_sub);
  safeSetVal('cms-index-stat1-val', idx.stat_1_val);
  safeSetVal('cms-index-stat1-lbl', idx.stat_1_lbl);
  safeSetVal('cms-index-stat2-val', idx.stat_2_val);
  safeSetVal('cms-index-stat2-lbl', idx.stat_2_lbl);
  safeSetVal('cms-index-stat3-val', idx.stat_3_val);
  safeSetVal('cms-index-stat3-lbl', idx.stat_3_lbl);
  safeSetVal('cms-index-stat4-val', idx.stat_4_val);
  safeSetVal('cms-index-stat4-lbl', idx.stat_4_lbl);
  safeSetVal('cms-index-concept-title', idx.concept_title);
  safeSetVal('cms-index-concept-desc', idx.concept_desc);
  safeSetVal('cms-index-card1-title', idx.concept_card1_title);
  safeSetVal('cms-index-card1-desc', idx.concept_card1_desc);
  safeSetVal('cms-index-card2-title', idx.concept_card2_title);
  safeSetVal('cms-index-card2-desc', idx.concept_card2_desc);
  safeSetVal('cms-index-card3-title', idx.concept_card3_title);
  safeSetVal('cms-index-card3-desc', idx.concept_card3_desc);
  safeSetVal('cms-index-cta-title', idx.cta_title);
  safeSetVal('cms-index-cta-desc', idx.cta_desc);
  safeSetVal('cms-index-cta-btn1', idx.cta_btn1_text);
  safeSetVal('cms-index-cta-btn2', idx.cta_btn2_text);

  safeSetVal('cms-products-title', pro.page_title);
  safeSetVal('cms-products-desc', pro.page_desc);

  safeSetVal('cms-mini-badge', mini.badge);
  safeSetVal('cms-mini-title', mini.title);
  safeSetVal('cms-mini-sub', mini.sub);
  safeSetVal('cms-mini-desc', mini.desc);
  safeSetVal('cms-mini-price', mini.price);
  safeSetVal('cms-mini-price-sub', mini.price_sub);
  safeSetVal('cms-mini-promo', mini.promo_tip);
  safeSetVal('cms-mini-feat-title', mini.features_title);
  safeSetVal('cms-mini-feat-desc', mini.features_desc);

  safeSetVal('cms-support-title', supp.page_title);
  safeSetVal('cms-support-desc', supp.page_desc);
  safeSetVal('cms-support-os', supp.os_heading);
  safeSetVal('cms-support-warranty', supp.warranty_heading);
  safeSetVal('cms-support-faq', supp.faq_heading);
  safeSetVal('cms-support-hotline', supp.service_hotline);
  safeSetVal('cms-support-email', supp.service_email);

  safeSetVal('cms-channels-title', chan.page_title);
  safeSetVal('cms-channels-desc', chan.page_desc);
  safeSetVal('cms-channels-policy', chan.policy_heading);
  safeSetVal('cms-channels-form', chan.form_heading);

  safeSetVal('cms-partners-title', part.page_title);
  safeSetVal('cms-partners-desc', part.page_desc);
  safeSetVal('cms-partners-support', part.support_offerings);
  safeSetVal('cms-partners-steps', part.steps_title);
  safeSetVal('cms-partners-apply', part.apply_heading);

  safeSetVal('cms-about-title', abt.page_title);
  safeSetVal('cms-about-desc', abt.page_desc);
  safeSetVal('cms-about-timeline', abt.timeline_title);
  safeSetVal('cms-about-strengths', abt.strengths_title);
  safeSetVal('cms-about-culture', abt.culture_title);

  safeSetVal('cms-contact-title', cont.page_title);
  safeSetVal('cms-contact-desc', cont.page_desc);
  safeSetVal('cms-contact-hq-title', cont.hq_title);
  safeSetVal('cms-contact-address', cont.hq_address);
  safeSetVal('cms-contact-dept-title', cont.dept_table_heading);

  safeSetVal('cms-global-cn', glob.brandCn);
  safeSetVal('cms-global-en', glob.brandEn);
  safeSetVal('cms-global-slogan', glob.slogan);
  safeSetVal('cms-global-cta-btn', glob.headerCtaText);
  safeSetVal('cms-global-cta-link', glob.headerCtaLink || 'lucky-mini.html');
  renderGlobalLogoPreview();
  renderAdminNavItemsList();
  safeSetVal('cms-global-footer-desc', glob.footerDesc);
  safeSetVal('cms-global-hours', glob.serviceHours);
  safeSetVal('cms-global-email-supp', glob.contactEmail);
  safeSetVal('cms-global-email-b2b', glob.b2bEmail);
  safeSetVal('cms-global-copyright', glob.copyright);
  safeSetVal('cms-global-icp', glob.icpNumber);
  safeSetVal('cms-global-icp-link', glob.icpLink);

  document.getElementById('thumb-index-hero').src = imgsMap['images/hero_banner_lucky_mini.jpg'] || idx.hero_image_mini || 'images/hero_banner_lucky_mini.jpg';
  document.getElementById('thumb-index-hero2').src = imgsMap['images/hero_banner_lucky_tab.jpg'] || idx.hero_image_tab || 'images/hero_banner_lucky_tab.jpg';
  document.getElementById('thumb-index-hero3').src = imgsMap['images/hero_banner_accessories.jpg'] || idx.hero_image_acc || 'images/hero_banner_accessories.jpg';
  document.getElementById('thumb-about-license').src = imgsMap['images/business-license.png'] || abt.cert_license_img || 'images/business-license.png';
  document.getElementById('thumb-about-cn').src = imgsMap['images/trademark-cn.jpg'] || abt.cert_cn_img || 'images/trademark-cn.jpg';
  document.getElementById('thumb-about-us').src = imgsMap['images/trademark-uspto.jpg'] || abt.cert_us_img || 'images/trademark-uspto.jpg';
  document.getElementById('thumb-about-trans').src = imgsMap['images/trademark-transfer.png'] || abt.cert_trans_img || 'images/trademark-transfer.png';

  renderAdminBrandNewsList();
  renderAllDynamicModules();
  loadProductIntoEditor(0, false, true);
  updateCmsPageView();
}

function syncCmsInputsToData() {
  if (!localSiteData.content) localSiteData.content = {};
  const c = localSiteData.content;
  ['index', 'products', 'lucky_mini', 'support', 'channels', 'partners', 'about', 'contact', 'global'].forEach(k => {
    if (!c[k]) c[k] = {};
  });

  c.index.hero_badge = getVal('cms-index-hero-badge');
  c.index.hero_title = getVal('cms-index-hero-title');
  c.index.hero_subtitle = getVal('cms-index-hero-sub');
  c.index.hero_btn_primary = getVal('cms-index-hero-btn1');
  c.index.hero_btn_secondary = getVal('cms-index-hero-btn2');
  c.index.hero_badge_left = getVal('cms-index-hero-b-left');
  c.index.hero_badge_right = getVal('cms-index-hero-b-right');
  c.index.hero_slide2_badge = getVal('cms-index-hero2-badge');
  c.index.hero_slide2_title = getVal('cms-index-hero2-title');
  c.index.hero_slide2_sub = getVal('cms-index-hero2-sub');
  c.index.hero_slide3_title = getVal('cms-index-hero3-title');
  c.index.hero_slide3_sub = getVal('cms-index-hero3-sub');
  c.index.stat_1_val = getVal('cms-index-stat1-val');
  c.index.stat_1_lbl = getVal('cms-index-stat1-lbl');
  c.index.stat_2_val = getVal('cms-index-stat2-val');
  c.index.stat_2_lbl = getVal('cms-index-stat2-lbl');
  c.index.stat_3_val = getVal('cms-index-stat3-val');
  c.index.stat_3_lbl = getVal('cms-index-stat3-lbl');
  c.index.stat_4_val = getVal('cms-index-stat4-val');
  c.index.stat_4_lbl = getVal('cms-index-stat4-lbl');
  c.index.concept_title = getVal('cms-index-concept-title');
  c.index.concept_desc = getVal('cms-index-concept-desc');
  c.index.concept_card1_title = getVal('cms-index-card1-title');
  c.index.concept_card1_desc = getVal('cms-index-card1-desc');
  c.index.concept_card2_title = getVal('cms-index-card2-title');
  c.index.concept_card2_desc = getVal('cms-index-card2-desc');
  c.index.concept_card3_title = getVal('cms-index-card3-title');
  c.index.concept_card3_desc = getVal('cms-index-card3-desc');
  c.index.cta_title = getVal('cms-index-cta-title');
  c.index.cta_desc = getVal('cms-index-cta-desc');
  c.index.cta_btn1_text = getVal('cms-index-cta-btn1');
  c.index.cta_btn2_text = getVal('cms-index-cta-btn2');

  c.products.page_title = getVal('cms-products-title');
  c.products.page_desc = getVal('cms-products-desc');
  syncCurrentEditedProductToMemory(false);

  c.lucky_mini.badge = getVal('cms-mini-badge');
  c.lucky_mini.title = getVal('cms-mini-title');
  c.lucky_mini.sub = getVal('cms-mini-sub');
  c.lucky_mini.desc = getVal('cms-mini-desc');
  c.lucky_mini.price = getVal('cms-mini-price');
  c.lucky_mini.price_sub = getVal('cms-mini-price-sub');
  c.lucky_mini.promo_tip = getVal('cms-mini-promo');
  c.lucky_mini.features_title = getVal('cms-mini-feat-title');
  c.lucky_mini.features_desc = getVal('cms-mini-feat-desc');

  c.support.page_title = getVal('cms-support-title');
  c.support.page_desc = getVal('cms-support-desc');
  c.support.os_heading = getVal('cms-support-os');
  c.support.warranty_heading = getVal('cms-support-warranty');
  c.support.faq_heading = getVal('cms-support-faq');
  c.support.service_hotline = getVal('cms-support-hotline');
  c.support.service_email = getVal('cms-support-email');

  c.channels.page_title = getVal('cms-channels-title');
  c.channels.page_desc = getVal('cms-channels-desc');
  c.channels.policy_heading = getVal('cms-channels-policy');
  c.channels.form_heading = getVal('cms-channels-form');

  c.partners.page_title = getVal('cms-partners-title');
  c.partners.page_desc = getVal('cms-partners-desc');
  c.partners.support_offerings = getVal('cms-partners-support');
  c.partners.steps_title = getVal('cms-partners-steps');
  c.partners.apply_heading = getVal('cms-partners-apply');

  c.about.page_title = getVal('cms-about-title');
  c.about.page_desc = getVal('cms-about-desc');
  c.about.timeline_title = getVal('cms-about-timeline');
  c.about.strengths_title = getVal('cms-about-strengths');
  c.about.culture_title = getVal('cms-about-culture');

  c.contact.page_title = getVal('cms-contact-title');
  c.contact.page_desc = getVal('cms-contact-desc');
  c.contact.hq_title = getVal('cms-contact-hq-title');
  c.contact.hq_address = getVal('cms-contact-address');
  c.contact.dept_table_heading = getVal('cms-contact-dept-title');

  c.global.brandCn = getVal('cms-global-cn');
  c.global.brandEn = getVal('cms-global-en');
  c.global.slogan = getVal('cms-global-slogan');
  c.global.headerCtaText = getVal('cms-global-cta-btn');
  c.global.headerCtaLink = getVal('cms-global-cta-link') || 'lucky-mini.html';
  syncNavItemsFromInputs();
  c.global.footerDesc = getVal('cms-global-footer-desc');
  c.global.serviceHours = getVal('cms-global-hours');
  c.global.contactEmail = getVal('cms-global-email-supp');
  c.global.b2bEmail = getVal('cms-global-email-b2b');
  c.global.copyright = getVal('cms-global-copyright');
  c.global.icpNumber = getVal('cms-global-icp');
  c.global.icpLink = getVal('cms-global-icp-link');
}
