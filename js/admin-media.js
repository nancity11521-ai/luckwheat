/**
 * LUCK WHEAT 幸运无限 - 管理后台图片素材总库与文字快速替换模块
 */
const MEDIA_ITEMS = [
  { key: "images/hero_banner_lucky_mini.jpg", title: "首页首屏 Hero 轮播大图 1", desc: "Lucky Mini 3.7 英寸旗舰小手机暗黑微光海报" },
  { key: "images/hero_banner_lucky_tab.jpg", title: "首页首屏 Hero 轮播大图 2", desc: "LUCKY Tab 8.68 英寸全铝一体平板海报" },
  { key: "images/hero_banner_accessories.jpg", title: "首页首屏 Hero 轮播大图 3", desc: "先锋街头机能挂绳与配件生态海报" },
  { key: "images/banner_subpage_products.jpg", title: "产品中心 (products.html) 顶部全景 Banner", desc: "产品中心页面顶部硬件矩阵生态横幅图" },
  { key: "images/banner_subpage_lucky_mini.jpg", title: "Lucky Mini (lucky-mini.html) 顶部全景 Banner", desc: "Lucky Mini 旗舰小手机详情页顶部专属横幅图" },
  { key: "images/banner_subpage_support.jpg", title: "服务支持 (support.html) 顶部全景 Banner", desc: "服务与售后中心顶部精密硬件工坊横幅图" },
  { key: "images/banner_subpage_channels.jpg", title: "购买渠道 (channels.html) 顶部全景 Banner", desc: "购买渠道中心顶部旗舰零售展厅横幅图" },
  { key: "images/banner_subpage_partners.jpg", title: "合作代理 (partners.html) 顶部全景 Banner", desc: "代理招商与生态合作中心顶部商务大厅横幅图" },
  { key: "images/banner_subpage_about.jpg", title: "关于我们 (about.html) 顶部全景 Banner", desc: "品牌故事与研发工业设计工作室横幅图" },
  { key: "images/banner_subpage_contact.jpg", title: "联系我们 (contact.html) 顶部全景 Banner", desc: "联系团队与总部接待大厅横幅图" },
  { key: "images/showcase_lucky_mini.jpg", title: "Lucky Mini 旗舰展台实拍大图", desc: "产品中心双列大展台、详情弹窗与详情页主图" },
  { key: "images/showcase_lucky_tab.jpg", title: "LUCKY Tab 便携平板展台实拍大图", desc: "产品中心平板系列展示主图" },
  { key: "images/showcase_accessories.jpg", title: "Lucky 机能工装挂绳展台实拍大图", desc: "产品中心配件系列展示主图" },
  { key: "images/business-license.png", title: "企业主体资质 · 营业执照扫描件", desc: "营业执照正本官方扫描件" },
  { key: "images/trademark-cn.jpg", title: "中国国家知识产权局商标注册证", desc: "中华人民共和国商标证书" },
  { key: "images/trademark-uspto.jpg", title: "美国 USPTO 联邦商标注册证书", desc: "美国专利商标局证书" },
  { key: "images/trademark-transfer.png", title: "国家知识产权局商标转让核准证明", desc: "商标转让核准公告证明文件" }
];

function renderMediaLibrary() {
  const grid = document.getElementById('media-library-grid');
  if (!grid) return;
  if (!localSiteData.images) localSiteData.images = {};

  grid.innerHTML = MEDIA_ITEMS.map((item, idx) => {
    const currentSrc = localSiteData.images[item.key] || item.key;
    return `
      <div class="media-card">
        <div class="media-preview-box">
          <img id="media-thumb-${idx}" src="${currentSrc}" alt="${item.title}">
        </div>
        <div>
          <div class="media-card-title">${item.title}</div>
          <div class="media-card-desc">${item.desc}</div>
          <code style="font-size:11px; color:#86868b; display:block; margin-top:4px;">${item.key}</code>
        </div>
        <div class="media-card-actions">
          <label for="media-file-${idx}" class="btn-media-upload">📷 上传替换</label>
          <input type="file" id="media-file-${idx}" accept="image/*" style="display:none;" onchange="handleMediaUpload(this, '${item.key}', 'media-thumb-${idx}')">
          <button type="button" class="btn-media-reset" onclick="restoreMediaDefault('${item.key}', 'media-thumb-${idx}')" title="恢复默认">↺ 恢复</button>
        </div>
      </div>
    `;
  }).join('');
}

window.handleMediaUpload = async function(inputEl, imageKey, thumbId) {
  const file = inputEl.files[0];
  if (!file) return;
  showToast('正在压缩并上传素材...');
  const imgUrl = await compressAndUploadImage(file, 1600, 0.86, 'media');
  const thumbEl = document.getElementById(thumbId);
  if (thumbEl) thumbEl.src = imgUrl;
  if (!localSiteData.images) localSiteData.images = {};
  localSiteData.images[imageKey] = imgUrl;
  inputEl.value = '';
  showToast('图片替换成功！请点击右上角「一键保存全站变更」生效');
};

window.restoreMediaDefault = function(imageKey, thumbId) {
  if (!localSiteData.images) localSiteData.images = {};
  localSiteData.images[imageKey] = imageKey;
  const thumbEl = document.getElementById(thumbId);
  if (thumbEl) thumbEl.src = imageKey;
  showToast('已恢复为官方默认图片！请点击保存生效');
};

function renderQuickReplacements() {
  const listEl = document.getElementById('active-replace-rules-list');
  if (!listEl) return;
  const reps = localSiteData.textReplacements || {};
  const keys = Object.keys(reps);

  if (keys.length === 0) {
    listEl.innerHTML = '<div style="font-size:13px; color:var(--admin-text-muted); padding:16px; text-align:center; background:#fff; border-radius:8px;">暂无自定义文本替换规则。在上方输入查找词与替换词即可添加。</div>';
    return;
  }

  listEl.innerHTML = keys.map(k => `
    <div class="replace-rule-row">
      <div>
        <span style="color:#d93025; text-decoration:line-through; font-weight:500;">${escapeHtml(k)}</span>
        <span style="margin: 0 8px; color:var(--admin-text-muted);">➔</span>
        <span style="color:#188038; font-weight:600;">${escapeHtml(reps[k])}</span>
      </div>
      <button type="button" class="btn-pill" style="padding:4px 10px; font-size:12px; color:#d93025;" onclick="removeQuickReplacement('${escapeJs(k)}')">删除</button>
    </div>
  `).join('');
}

window.addQuickReplacement = function() {
  const searchVal = document.getElementById('replace-search-input').value.trim();
  const targetVal = document.getElementById('replace-target-input').value.trim();
  if (!searchVal) {
    alert('请输入要查找的原词');
    return;
  }
  if (!localSiteData.textReplacements) localSiteData.textReplacements = {};
  localSiteData.textReplacements[searchVal] = targetVal;
  document.getElementById('replace-search-input').value = '';
  document.getElementById('replace-target-input').value = '';
  renderQuickReplacements();
  showToast('替换规则已添加！请点击右上角保存生效');
};

window.removeQuickReplacement = function(key) {
  if (localSiteData.textReplacements && localSiteData.textReplacements[key] !== undefined) {
    delete localSiteData.textReplacements[key];
    renderQuickReplacements();
    showToast('替换规则已移除！请点击保存生效');
  }
};

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function escapeJs(str) {
  return String(str || '').replace(/'/g, "\\'");
}
