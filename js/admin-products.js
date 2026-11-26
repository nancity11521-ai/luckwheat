/**
 * LUCK WHEAT 幸运无限 - 管理后台产品、导航与动态模块
 */

// =========================================================================
// 1. 全局顶部导航栏与 Logo 管理
// =========================================================================
function getGlobalNavItemsArray() {
  if (!localSiteData.content) localSiteData.content = {};
  if (!localSiteData.content.global) localSiteData.content.global = {};
  if (!Array.isArray(localSiteData.content.global.navItems) || localSiteData.content.global.navItems.length === 0) {
    const defNav = (window.LUCK_SITE_DEFAULT_DATA?.content?.global?.navItems) || [];
    localSiteData.content.global.navItems = JSON.parse(JSON.stringify(defNav));
  }
  return localSiteData.content.global.navItems;
}

function renderGlobalLogoPreview() {
  const img = document.getElementById('thumb-global-logo');
  const fallback = document.getElementById('thumb-global-logo-fallback');
  const src = localSiteData.content?.global?.logoImage;
  if (!img || !fallback) return;
  if (src) {
    img.src = src;
    img.style.display = 'block';
    fallback.style.display = 'none';
  } else {
    img.style.display = 'none';
    fallback.style.display = 'inline';
  }
}

window.handleGlobalLogoUpload = async function(inputEl) {
  const file = inputEl.files[0];
  if (!file) return;
  showToast('正在压缩并上传 Logo...');
  const imgUrl = await compressAndUploadImage(file, 320, 0.9, 'logo');
  if (!localSiteData.content) localSiteData.content = {};
  if (!localSiteData.content.global) localSiteData.content.global = {};
  localSiteData.content.global.logoImage = imgUrl;
  renderGlobalLogoPreview();
  showToast('品牌 Logo 已就绪！请点击右上角保存同步至全站');
};

window.restoreDefaultLogo = function() {
  if (!localSiteData.content) localSiteData.content = {};
  if (!localSiteData.content.global) localSiteData.content.global = {};
  localSiteData.content.global.logoImage = '';
  renderGlobalLogoPreview();
  showToast('已恢复默认品牌图标！');
};

window.renderAdminNavItemsList = function() {
  const container = document.getElementById('admin-nav-items-list');
  if (!container) return;
  const items = getGlobalNavItemsArray();
  container.innerHTML = items.map((item, idx) => `
    <div class="nav-editor-row" style="display: grid; grid-template-columns: 1fr 1.4fr auto; gap: 8px; align-items: center; background: #fafafc; padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.06);">
      <input type="text" class="form-input nav-edit-label" data-idx="${idx}" value="${escapeHtml(item.label || '')}" placeholder="菜单名称" style="height: 34px; font-size: 13px;">
      <input type="text" class="form-input nav-edit-href" data-idx="${idx}" value="${escapeHtml(item.href || '')}" placeholder="跳转链接 (如 products.html)" style="height: 34px; font-size: 13px;">
      <div style="display: flex; gap: 4px;">
        <button type="button" class="btn-pill" style="padding: 4px 8px; font-size: 11px;" onclick="moveGlobalNavItem(${idx}, -1)" ${idx === 0 ? 'disabled' : ''}>⬆️</button>
        <button type="button" class="btn-pill" style="padding: 4px 8px; font-size: 11px;" onclick="moveGlobalNavItem(${idx}, 1)" ${idx === items.length - 1 ? 'disabled' : ''}>⬇️</button>
        <button type="button" class="btn-pill" style="padding: 4px 8px; font-size: 11px; color: #ff3b30;" onclick="deleteGlobalNavItem(${idx})">✕</button>
      </div>
    </div>
  `).join('');
};

function syncNavItemsFromInputs() {
  const rows = document.querySelectorAll('#admin-nav-items-list .nav-editor-row');
  if (!rows.length) return;
  const updated = [];
  rows.forEach(row => {
    const label = row.querySelector('.nav-edit-label')?.value.trim() || '';
    const href = row.querySelector('.nav-edit-href')?.value.trim() || '#';
    if (label) updated.push({ label, href });
  });
  if (!localSiteData.content) localSiteData.content = {};
  if (!localSiteData.content.global) localSiteData.content.global = {};
  localSiteData.content.global.navItems = updated;
}

window.addGlobalNavItem = function() {
  syncNavItemsFromInputs();
  const items = getGlobalNavItemsArray();
  items.push({ label: '新菜单项', href: 'index.html' });
  renderAdminNavItemsList();
};

window.moveGlobalNavItem = function(idx, dir) {
  syncNavItemsFromInputs();
  const items = getGlobalNavItemsArray();
  const target = idx + dir;
  if (target < 0 || target >= items.length) return;
  [items[idx], items[target]] = [items[target], items[idx]];
  renderAdminNavItemsList();
};

window.deleteGlobalNavItem = function(idx) {
  syncNavItemsFromInputs();
  const items = getGlobalNavItemsArray();
  if (items.length <= 1) {
    alert('至少保留 1 个导航菜单项！');
    return;
  }
  items.splice(idx, 1);
  renderAdminNavItemsList();
};

window.restoreDefaultNavItems = function() {
  const defNav = (window.LUCK_SITE_DEFAULT_DATA?.content?.global?.navItems) || [];
  if (!localSiteData.content) localSiteData.content = {};
  if (!localSiteData.content.global) localSiteData.content.global = {};
  localSiteData.content.global.navItems = JSON.parse(JSON.stringify(defNav));
  renderAdminNavItemsList();
  showToast('已恢复默认顶部导航菜单！');
};

// =========================================================================
// 2. 产品中心 · 小列表管理、规格编辑、购买跳转链接与商品详情页多图上传
// =========================================================================
function getProductItemsArray() {
  if (!localSiteData.content) localSiteData.content = {};
  if (!localSiteData.content.products) localSiteData.content.products = {};
  if (!Array.isArray(localSiteData.content.products.items) || localSiteData.content.products.items.length === 0) {
    const defaultItems = (window.LUCK_SITE_DEFAULT_DATA?.content?.products?.items) || [];
    localSiteData.content.products.items = JSON.parse(JSON.stringify(defaultItems));
  }
  return localSiteData.content.products.items;
}

function getSeriesDisplayName(series) {
  if (series === 'phone') return '📱 智能手机';
  if (series === 'tablet') return '💻 随身平板';
  return '⚡ 精工配件';
}

let adminProductSeriesFilter = 'all';

window.filterProductSeries = function(series) {
  adminProductSeriesFilter = series;
  document.querySelectorAll('.product-series-filter-pills .pill-filter').forEach(btn => {
    if (btn.getAttribute('data-series') === series) btn.classList.add('active');
    else btn.classList.remove('active');
  });
  renderAdminProductMiniList();
};

window.renderAdminProductMiniList = function() {
  const container = document.getElementById('admin-products-mini-list');
  const countEl = document.getElementById('admin-products-count');
  if (!container) return;

  const items = getProductItemsArray();
  const query = (document.getElementById('admin-product-search')?.value || '').trim().toLowerCase();
  const activeIdx = parseInt(document.getElementById('edit-prod-index')?.value || '0', 10);

  const filtered = items.map((item, idx) => ({ item, idx })).filter(({ item }) => {
    if (adminProductSeriesFilter !== 'all' && item.series !== adminProductSeriesFilter) return false;
    if (query) {
      const hay = `${item.title || ''} ${item.subtitle || ''} ${item.id || ''} ${item.price || ''}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  if (countEl) {
    countEl.textContent = filtered.length === items.length ? `${items.length} 款` : `${filtered.length} / ${items.length} 款`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 28px 14px; background: #ffffff; border-radius: 10px; border: 1px dashed var(--admin-border); color: var(--admin-text-muted); font-size: 12.5px;">未找到匹配的产品</div>`;
    return;
  }

  container.innerHTML = filtered.map(({ item, idx }) => {
    const detailCount = Array.isArray(item.detailImages) ? item.detailImages.length : 0;
    const hasBuyUrl = !!(item.buyUrl && item.buyUrl.trim());
    const isSelected = (idx === activeIdx);
    return `
      <div class="product-mini-item ${isSelected ? 'active' : ''}" onclick="loadProductIntoEditor(${idx}, false)">
        <div class="mini-item-thumb">
          <img src="${item.image || 'images/showcase_lucky_mini.jpg'}" alt="${escapeHtml(item.title || '')}">
        </div>
        <div class="mini-item-body">
          <div class="mini-item-title-row">
            <span class="mini-item-title" title="${escapeHtml(item.title || '')}">${escapeHtml(item.title || '未命名产品')}</span>
            <span style="font-weight: 700; font-size: 12px; color: var(--admin-blue); white-space: nowrap;">${escapeHtml(item.price || '-')}</span>
          </div>
          <div class="mini-item-meta">
            <span>${getSeriesDisplayName(item.series)}</span>
            <span>·</span>
            <code>${escapeHtml(item.id)}</code>
          </div>
          <div class="mini-item-status-row">
            ${detailCount > 0 ? `<span class="tag-badge has-imgs">✓ ${detailCount} 张详情图</span>` : `<span class="tag-badge no-imgs">未传详情页</span>`}
            ${hasBuyUrl ? `<span class="tag-badge buy-linked">已配购买</span>` : ``}
          </div>
        </div>
        <button type="button" class="btn-pill" style="padding: 2px 6px; font-size: 11px; color: #ff3b30; border: none; background: transparent; opacity: 0.6;" onclick="event.stopPropagation(); deleteProductItem(${idx});" title="删除该产品">🗑️</button>
      </div>
    `;
  }).join('');
};

function renderProductSpecsEditor(item) {
  const listEl = document.getElementById('edit-prod-specs-list');
  if (!listEl) return;
  const specs = Array.isArray(item.specs) ? item.specs : [];
  if (specs.length === 0) {
    listEl.innerHTML = `<div style="font-size:12px; color:var(--admin-text-muted); padding:8px;">暂无规格参数，点击右上角「➕ 添加规格」可新增。</div>`;
    return;
  }
  listEl.innerHTML = specs.map((s, sIdx) => `
    <div class="prod-spec-row" style="display:grid; grid-template-columns:1fr 1.6fr auto; gap:8px; align-items:center;">
      <input type="text" class="form-input spec-label-input" value="${escapeHtml(s.label || '')}" placeholder="参数名称" style="height:34px; font-size:13px;">
      <input type="text" class="form-input spec-val-input" value="${escapeHtml(s.val || '')}" placeholder="参数值" style="height:34px; font-size:13px;">
      <button type="button" class="btn-pill" style="padding:4px 8px; font-size:11px; color:#ff3b30;" onclick="removeProductSpecRow(${sIdx})">✕</button>
    </div>
  `).join('');
}

function syncProductSpecsFromInputs() {
  const idx = parseInt(getVal('edit-prod-index'), 10);
  const items = getProductItemsArray();
  if (!items[idx]) return;
  const rows = document.querySelectorAll('#edit-prod-specs-list .prod-spec-row');
  const updated = [];
  rows.forEach(row => {
    const label = row.querySelector('.spec-label-input')?.value.trim() || '';
    const val = row.querySelector('.spec-val-input')?.value.trim() || '';
    if (label || val) updated.push({ label, val });
  });
  items[idx].specs = updated;
}

window.addProductSpecRow = function() {
  syncProductSpecsFromInputs();
  const idx = parseInt(getVal('edit-prod-index'), 10);
  const items = getProductItemsArray();
  if (!items[idx]) return;
  if (!Array.isArray(items[idx].specs)) items[idx].specs = [];
  items[idx].specs.push({ label: '新参数', val: '参数内容' });
  renderProductSpecsEditor(items[idx]);
};

window.removeProductSpecRow = function(sIdx) {
  syncProductSpecsFromInputs();
  const idx = parseInt(getVal('edit-prod-index'), 10);
  const items = getProductItemsArray();
  if (!items[idx] || !Array.isArray(items[idx].specs)) return;
  items[idx].specs.splice(sIdx, 1);
  renderProductSpecsEditor(items[idx]);
};

let productEditorHasLoaded = false;

window.loadProductIntoEditor = function(idx, scrollToEditor, skipAutoSyncPrev) {
  const items = getProductItemsArray();
  if (!items.length) return;
  if (idx < 0 || idx >= items.length) idx = 0;

  // 修复切卡片丢修改 Bug：切换单品前先把正在编辑的单品改动暂存到内存
  if (!skipAutoSyncPrev && productEditorHasLoaded) {
    const prevIdx = parseInt(getVal('edit-prod-index'), 10);
    if (!isNaN(prevIdx) && prevIdx !== idx && items[prevIdx]) {
      syncCurrentEditedProductToMemory(false);
    }
  }
  productEditorHasLoaded = true;

  const item = items[idx];

  safeSetVal('edit-prod-index', idx);
  safeSetVal('edit-prod-title', item.title || '');
  safeSetVal('edit-prod-series', item.series || 'phone');
  safeSetVal('edit-prod-subtitle', item.subtitle || '');
  safeSetVal('edit-prod-badge', item.badge || '');
  safeSetVal('edit-prod-badge-type', item.badgeType || 'live');
  safeSetVal('edit-prod-price', item.price || '');
  safeSetVal('edit-prod-price-sub', item.priceSub || '');
  safeSetVal('edit-prod-desc', item.desc || '');
  safeSetVal('edit-prod-buy-url', item.buyUrl || '');
  safeSetVal('edit-prod-buy-text', item.buyText || '立即购买');
  safeSetVal('edit-prod-detail-desc', item.detailDesc || '');

  const thumb = document.getElementById('edit-prod-thumb');
  if (thumb) thumb.src = item.image || 'images/showcase_lucky_mini.jpg';

  const heading = document.getElementById('editor-product-heading');
  if (heading) heading.textContent = '✏️ 编辑产品：' + (item.title || '未命名产品');
  const idLabel = document.getElementById('editor-product-id-label');
  if (idLabel) idLabel.textContent = '产品 ID: ' + (item.id || '');

  const previewBtn = document.getElementById('preview-prod-detail-btn');
  if (previewBtn) previewBtn.href = `products.html?detail=${encodeURIComponent(item.id)}`;

  updateBuyLinkTestBtn();
  renderProductSpecsEditor(item);
  renderEditorDetailImages(item);
  renderAdminProductMiniList();

  if (scrollToEditor) {
    document.getElementById('admin-product-editor-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

window.updateBuyLinkTestBtn = function() {
  const url = getVal('edit-prod-buy-url');
  const testBtn = document.getElementById('edit-prod-buy-test');
  if (!testBtn) return;
  if (url) {
    testBtn.href = url;
    testBtn.style.opacity = '1';
    testBtn.style.pointerEvents = 'auto';
  } else {
    testBtn.href = '#';
    testBtn.style.opacity = '0.45';
    testBtn.style.pointerEvents = 'none';
  }
};

window.applyQuickBuyUrlTemplate = function(type) {
  const idx = parseInt(getVal('edit-prod-index'), 10);
  const items = getProductItemsArray();
  const currentId = items[idx]?.id || 'lucky-mini';
  const urlInput = document.getElementById('edit-prod-buy-url');
  const textInput = document.getElementById('edit-prod-buy-text');
  if (!urlInput) return;

  if (type === 'channels') {
    urlInput.value = `channels.html?product=${currentId}`;
    if (textInput) textInput.value = '立即购买';
  } else if (type === 'shop') {
    urlInput.value = `https://shop.luckwheat.com/products/${currentId}`;
    if (textInput) textInput.value = '官网直购';
  } else if (type === 'jd') {
    urlInput.value = `https://item.jd.com/luckwheat-${currentId}.html`;
    if (textInput) textInput.value = '京东自营';
  } else if (type === 'tmall') {
    urlInput.value = `https://detail.tmall.com/item.htm?id=luckwheat-${currentId}`;
    if (textInput) textInput.value = '天猫旗舰店';
  }
  updateBuyLinkTestBtn();
  showToast('已填入购买链接模板，可根据需要调整并点击保存！');
};

function renderEditorDetailImages(item) {
  const container = document.getElementById('edit-prod-detail-imgs-list');
  if (!container) return;
  const imgs = Array.isArray(item.detailImages) ? item.detailImages : [];
  if (imgs.length === 0) {
    container.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding:20px; background:#fff; border-radius:8px; color:var(--admin-text-muted); font-size:12.5px;">暂未上传商品详情页图片。点击右上角「上传商品详情页图片」可一次选择多张详情长图。</div>`;
    return;
  }
  container.innerHTML = imgs.map((src, i) => `
    <div style="background:#fff; border:1px solid var(--admin-border); border-radius:10px; padding:8px; display:flex; flex-direction:column; gap:6px;">
      <div style="height:120px; border-radius:6px; overflow:hidden; background:#f5f5f7; display:flex; align-items:center; justify-content:center;">
        <img src="${src}" alt="详情图 ${i + 1}" style="max-width:100%; max-height:100%; object-fit:contain;">
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:11.5px; color:var(--admin-text-muted);">
        <span>第 ${i + 1} 张</span>
        <div style="display:flex; gap:4px;">
          <button type="button" class="btn-pill" style="padding:2px 6px; font-size:11px;" onclick="moveProductDetailImg(${i}, -1)" ${i === 0 ? 'disabled' : ''}>⬆️</button>
          <button type="button" class="btn-pill" style="padding:2px 6px; font-size:11px;" onclick="moveProductDetailImg(${i}, 1)" ${i === imgs.length - 1 ? 'disabled' : ''}>⬇️</button>
          <button type="button" class="btn-pill" style="padding:2px 6px; font-size:11px; color:#ff3b30;" onclick="removeProductDetailImg(${i})">✕</button>
        </div>
      </div>
    </div>
  `).join('');
}

window.handleProductMainImgUpload = async function(inputEl) {
  const file = inputEl.files[0];
  if (!file) return;
  const idx = parseInt(getVal('edit-prod-index'), 10);
  const items = getProductItemsArray();
  if (!items[idx]) return;
  showToast('正在上传产品主图...');
  const imgUrl = await compressAndUploadImage(file, 1200, 0.86, `prod_${items[idx].id || 'main'}`);
  items[idx].image = imgUrl;
  const thumb = document.getElementById('edit-prod-thumb');
  if (thumb) thumb.src = imgUrl;
  inputEl.value = '';
  renderAdminProductMiniList();
  showToast('产品主图已就绪！请点击右上角保存并同步全站');
};

window.handleProductDetailImgsUpload = async function(inputEl) {
  const files = Array.from(inputEl.files || []);
  if (!files.length) return;
  const idx = parseInt(getVal('edit-prod-index'), 10);
  const items = getProductItemsArray();
  if (!items[idx]) return;
  if (!Array.isArray(items[idx].detailImages)) items[idx].detailImages = [];

  showToast(`正在处理并上传 ${files.length} 张详情图，请稍候...`);
  for (const file of files) {
    const imgUrl = await compressAndUploadImage(file, 1200, 0.84, `detail_${items[idx].id || 'p'}`);
    items[idx].detailImages.push(imgUrl);
  }
  inputEl.value = '';
  renderEditorDetailImages(items[idx]);
  renderAdminProductMiniList();
  showToast(`已成功添加 ${files.length} 张商品详情长图！请点击保存同步全站`);
};

window.moveProductDetailImg = function(imgIdx, dir) {
  const idx = parseInt(getVal('edit-prod-index'), 10);
  const items = getProductItemsArray();
  const imgs = items[idx]?.detailImages;
  if (!Array.isArray(imgs)) return;
  const target = imgIdx + dir;
  if (target < 0 || target >= imgs.length) return;
  [imgs[imgIdx], imgs[target]] = [imgs[target], imgs[imgIdx]];
  renderEditorDetailImages(items[idx]);
};

window.removeProductDetailImg = function(imgIdx) {
  const idx = parseInt(getVal('edit-prod-index'), 10);
  const items = getProductItemsArray();
  const imgs = items[idx]?.detailImages;
  if (!Array.isArray(imgs)) return;
  imgs.splice(imgIdx, 1);
  renderEditorDetailImages(items[idx]);
  renderAdminProductMiniList();
};

window.clearCurrentProductDetailImgs = function() {
  const idx = parseInt(getVal('edit-prod-index'), 10);
  const items = getProductItemsArray();
  if (!items[idx]) return;
  if (confirm('确定清空当前产品的全部商品详情页图片吗？')) {
    items[idx].detailImages = [];
    renderEditorDetailImages(items[idx]);
    renderAdminProductMiniList();
  }
};

window.restoreCurrentProductDefaultDetailImgs = function() {
  const idx = parseInt(getVal('edit-prod-index'), 10);
  const items = getProductItemsArray();
  if (!items[idx]) return;
  const defaultItems = (window.LUCK_SITE_DEFAULT_DATA?.content?.products?.items) || [];
  const found = defaultItems.find(d => d.id === items[idx].id);
  items[idx].detailImages = found && Array.isArray(found.detailImages) ? [...found.detailImages] : [items[idx].image];
  renderEditorDetailImages(items[idx]);
  renderAdminProductMiniList();
  showToast('已恢复官方默认详情页图片！');
};

function syncCurrentEditedProductToMemory(showMsg) {
  const idx = parseInt(getVal('edit-prod-index'), 10);
  const items = getProductItemsArray();
  if (!items[idx]) return;
  const item = items[idx];
  item.title = getVal('edit-prod-title') || item.title;
  item.series = getVal('edit-prod-series') || 'phone';
  item.seriesLabel = item.series === 'phone' ? '旗舰小机系列 · 01' : (item.series === 'tablet' ? '随身平板系列 · 02' : '精工配件系列 · 03');
  item.subtitle = getVal('edit-prod-subtitle');
  item.badge = getVal('edit-prod-badge');
  item.badgeType = getVal('edit-prod-badge-type') || 'live';
  item.price = getVal('edit-prod-price');
  item.priceSub = getVal('edit-prod-price-sub');
  item.desc = getVal('edit-prod-desc');
  item.buyUrl = getVal('edit-prod-buy-url');
  item.buyText = getVal('edit-prod-buy-text') || '立即购买';
  item.detailDesc = getVal('edit-prod-detail-desc');
  syncProductSpecsFromInputs();
  if (showMsg) renderAdminProductMiniList();
}

window.saveCurrentEditedProduct = async function() {
  syncCurrentEditedProductToMemory(true);
  const idx = parseInt(getVal('edit-prod-index'), 10);
  const items = getProductItemsArray();
  if (items[idx] && items[idx].id) {
    localStorage.removeItem('luck_custom_detail_images_' + items[idx].id);
  }
  await saveAllChanges();
  renderAdminProductMiniList();
};

window.createNewProductItem = function() {
  syncCurrentEditedProductToMemory(false);
  const items = getProductItemsArray();
  const newId = 'product-' + Date.now().toString().slice(-5);
  const newItem = {
    id: newId,
    series: 'phone',
    seriesLabel: '旗舰小机系列 · 01',
    badge: '新品上架',
    badgeType: 'live',
    title: '新产品 ' + (items.length + 1),
    subtitle: '拥有它，就拥有幸运。',
    desc: '请填写新产品的核心卖点与介绍描述。',
    image: 'images/showcase_lucky_mini.jpg',
    specs: [
      { label: '产品系列', val: 'LUCK WHEAT 智能硬件' },
      { label: '售后保障', val: '官方正品联保' }
    ],
    price: '¥999',
    priceSub: '官方直营',
    detailUrl: `products.html?product=${newId}`,
    buyUrl: `channels.html?product=${newId}`,
    buyText: '立即购买',
    detailImages: [],
    detailDesc: ''
  };
  items.push(newItem);
  loadProductIntoEditor(items.length - 1, true, true);
  renderDashboard();
  showToast('已创建新产品草稿，请完善信息后保存并同步！');
};

window.deleteProductItem = function(idx) {
  const items = getProductItemsArray();
  if (!items[idx]) return;
  if (items.length <= 1) {
    alert('至少需要保留 1 款产品！');
    return;
  }
  if (confirm(`确定要从产品中心删除「${items[idx].title}」吗？`)) {
    items.splice(idx, 1);
    loadProductIntoEditor(0, false, true);
    saveAllChanges();
  }
};

// =========================================================================
// 3. 品牌动态 (微信公众号推文一键智能抓取与维护)
// =========================================================================
function getBrandNewsArray() {
  if (!localSiteData.content) localSiteData.content = {};
  if (!localSiteData.content.index) localSiteData.content.index = {};
  if (!Array.isArray(localSiteData.content.index.brand_news)) {
    const defaultNews = (window.LUCK_SITE_DEFAULT_DATA?.content?.index?.brand_news) || [];
    localSiteData.content.index.brand_news = JSON.parse(JSON.stringify(defaultNews));
  }
  return localSiteData.content.index.brand_news;
}

window.renderAdminBrandNewsList = function() {
  const container = document.getElementById('admin-news-list-container');
  const countEl = document.getElementById('news-count');
  if (!container) return;

  const list = getBrandNewsArray();
  if (countEl) countEl.textContent = list.length;

  if (list.length === 0) {
    container.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--admin-text-muted); background: #ffffff; border: 1px dashed var(--admin-border); border-radius: var(--radius-md);">暂无动态。请在上方输入微信公众号推文链接，点击「⚡ 一键智能解析」添加！</div>`;
    return;
  }

  container.innerHTML = list.map((item, idx) => `
    <div style="background: #ffffff; border: 1px solid var(--admin-border); border-radius: var(--radius-md); padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; gap: 16px;">
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span style="font-family: monospace; font-size: 12px; background: #e8f3ff; color: var(--apple-blue); padding: 2px 6px; border-radius: 4px; font-weight: 600;">${escapeHtml(item.date || '未设日期')}</span>
          <strong style="font-size: 14px; color: #1d1d1f; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(item.title || '无标题')}</strong>
        </div>
        <p style="font-size: 12px; color: #6e6e73; margin: 0 0 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(item.desc || '无描述')}</p>
        <div style="font-size: 11px; color: #86868b; display: flex; align-items: center; gap: 6px;">
          <span style="color: #07c160; font-weight: 600;">微信链接:</span>
          <a href="${escapeHtml(item.link || '#')}" target="_blank" rel="noopener noreferrer" style="color: var(--apple-blue); text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 450px;">${escapeHtml(item.link || '未设置链接')} ↗</a>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
        <button type="button" class="btn-pill" onclick="editBrandNewsItem(${idx})" title="编辑此条">✏️ 编辑</button>
        <button type="button" class="btn-pill" onclick="moveBrandNewsItem(${idx}, -1)" ${idx === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} title="上移">⬆️</button>
        <button type="button" class="btn-pill" onclick="moveBrandNewsItem(${idx}, 1)" ${idx === list.length - 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} title="下移">⬇️</button>
        <button type="button" class="btn-pill" style="color: #ff3b30; border-color: rgba(255,59,48,0.3);" onclick="deleteBrandNewsItem(${idx})" title="删除">🗑️</button>
      </div>
    </div>
  `).join('');
};

window.autoFetchArticleMetadata = async function() {
  const urlInput = document.getElementById('news-input-url');
  const url = urlInput ? urlInput.value.trim() : '';
  const spinner = document.getElementById('fetch-spinner');
  const statusMsg = document.getElementById('fetch-status-msg');

  if (!url) {
    showToast('请先输入或粘贴微信公众号推文链接 URL！');
    if (urlInput) urlInput.focus();
    return;
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    showToast('链接格式不正确，需以 http:// 或 https:// 开头');
    return;
  }

  if (spinner) spinner.style.display = 'inline';
  if (statusMsg) {
    statusMsg.style.display = 'block';
    statusMsg.style.background = '#e8f3ff';
    statusMsg.style.color = 'var(--apple-blue)';
    statusMsg.textContent = '⏳ 正在智能请求与解析微信文章元数据，请稍候...';
  }

  try {
    let data = null;
    try {
      const resp = await fetch(`/api/fetch-article?url=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(8000) });
      if (resp.ok) data = await resp.json();
    } catch (localErr) {
      console.warn('[CMS] 本地解析服务异常', localErr);
    }

    if (data && data.success) {
      if (data.title) document.getElementById('news-input-title').value = data.title;
      if (data.desc) document.getElementById('news-input-desc').value = data.desc;
      if (data.date) document.getElementById('news-input-date').value = data.date;
      if (statusMsg) {
        statusMsg.style.background = '#e8f8f0';
        statusMsg.style.color = '#00875a';
        statusMsg.textContent = '✅ 解析成功！已自动填充标题、摘要及发布日期。';
      }
      showToast('微信推文解析成功！');
    } else {
      throw new Error((data && data.error) || '未提取到文章标题');
    }
  } catch (err) {
    if (statusMsg) {
      statusMsg.style.background = '#fff8e6';
      statusMsg.style.color = '#b76e00';
      statusMsg.textContent = '⚠️ 自动解析受限（微信防爬或网络超时）。您可直接在下方手动输入标题和摘要，前台链接依然有效！';
    }
    showToast('未能自动获取，可直接手动填入标题与内容');
  } finally {
    if (spinner) spinner.style.display = 'none';
  }
};

window.submitBrandNewsItem = function() {
  const url = document.getElementById('news-input-url').value.trim();
  const title = document.getElementById('news-input-title').value.trim();
  const desc = document.getElementById('news-input-desc').value.trim();
  let date = document.getElementById('news-input-date').value.trim();
  const editIdx = parseInt(document.getElementById('news-edit-index').value, 10);

  if (!title) {
    showToast('请填写动态标题！');
    document.getElementById('news-input-title').focus();
    return;
  }
  if (!date) date = new Date().toISOString().slice(0, 7);

  const list = getBrandNewsArray();
  const newItem = { date, title, desc: desc || '', link: url || 'https://mp.weixin.qq.com' };

  if (editIdx >= 0 && editIdx < list.length) {
    list[editIdx] = newItem;
    showToast('品牌动态已更新！');
  } else {
    list.unshift(newItem);
    showToast('已新增品牌动态！');
  }

  clearNewsInputForm();
  renderAdminBrandNewsList();
  saveAllChanges();
};

window.editBrandNewsItem = function(idx) {
  const list = getBrandNewsArray();
  if (!list[idx]) return;
  const item = list[idx];
  document.getElementById('news-input-url').value = item.link || '';
  document.getElementById('news-input-title').value = item.title || '';
  document.getElementById('news-input-desc').value = item.desc || '';
  document.getElementById('news-input-date').value = item.date || '';
  document.getElementById('news-edit-index').value = idx;
  document.getElementById('news-form-title').textContent = '✏️ 正在编辑动态 #' + (idx + 1);
  document.getElementById('btn-add-news').textContent = '💾 保存对此条的修改';
  document.getElementById('cms-news-panel').scrollIntoView({ behavior: 'smooth' });
};

window.clearNewsInputForm = function() {
  document.getElementById('news-input-url').value = '';
  document.getElementById('news-input-title').value = '';
  document.getElementById('news-input-desc').value = '';
  document.getElementById('news-input-date').value = '';
  document.getElementById('news-edit-index').value = -1;
  document.getElementById('news-form-title').textContent = '⚡ 智能添加推文动态';
  document.getElementById('btn-add-news').textContent = '➕ 添加到动态列表';
  const statusMsg = document.getElementById('fetch-status-msg');
  if (statusMsg) statusMsg.style.display = 'none';
};

window.deleteBrandNewsItem = function(idx) {
  const list = getBrandNewsArray();
  if (!list[idx]) return;
  if (confirm(`确定要删除动态「${list[idx].title}」吗？`)) {
    list.splice(idx, 1);
    renderAdminBrandNewsList();
    saveAllChanges();
  }
};

window.moveBrandNewsItem = function(idx, direction) {
  const list = getBrandNewsArray();
  const targetIdx = idx + direction;
  if (targetIdx < 0 || targetIdx >= list.length) return;
  [list[idx], list[targetIdx]] = [list[targetIdx], list[idx]];
  renderAdminBrandNewsList();
  saveAllChanges();
};

window.handleCmsImageUpload = async function(inputEl, pageKey, imgKey, thumbId, globalImgPath) {
  const file = inputEl.files[0];
  if (!file) return;
  showToast('正在压缩并上传图片...');
  const imgUrl = await compressAndUploadImage(file, 1600, 0.86, `${pageKey}_${imgKey}`);
  const thumb = document.getElementById(thumbId);
  if (thumb) thumb.src = imgUrl;
  if (!localSiteData.content) localSiteData.content = {};
  if (!localSiteData.content[pageKey]) localSiteData.content[pageKey] = {};
  localSiteData.content[pageKey][imgKey] = imgUrl;
  if (globalImgPath) {
    if (!localSiteData.images) localSiteData.images = {};
    localSiteData.images[globalImgPath] = imgUrl;
  }
  inputEl.value = '';
  showToast('图片上传就绪！请点击右上角「一键保存全站变更」生效');
};
