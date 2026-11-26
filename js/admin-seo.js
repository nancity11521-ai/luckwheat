/**
 * LUCK WHEAT 幸运无限 - 管理后台 SEO 优化中心模块
 */
let currentSeoPage = 'index';
let seoSelectorBound = false;

function initSeoForm() {
  const selector = document.getElementById('seo-page-selector');
  if (!seoSelectorBound && selector) {
    seoSelectorBound = true;
    selector.addEventListener('change', () => {
      syncSeoInputsToData();
      currentSeoPage = selector.value;
      loadSeoForPage(currentSeoPage);
    });
  }

  const glob = (localSiteData.seo && localSiteData.seo.global) || {};
  safeSetVal('seo-global-sitename', glob.siteName || 'LUCK WHEAT 幸运无限');
  safeSetVal('seo-global-canonical', glob.canonicalBase || 'https://lucky-infinite.com');
  safeSetVal('seo-global-baidu', glob.baiduVerify || '');
  safeSetVal('seo-global-google', glob.googleVerify || '');
  safeSetVal('seo-global-bing', glob.bingVerify || '');

  loadSeoForPage(currentSeoPage);
}

function loadSeoForPage(pageKey) {
  const seo = (localSiteData.seo && localSiteData.seo.pages && localSiteData.seo.pages[pageKey]) || {};
  safeSetVal('seo-input-title', seo.title || '');
  safeSetVal('seo-input-desc', seo.description || '');
  safeSetVal('seo-input-keywords', seo.keywords || '');

  const slugEl = document.getElementById('serp-preview-slug');
  if (slugEl) slugEl.textContent = pageKey === 'index' ? '' : `> ${pageKey}`;
  if (seo.ogImage) {
    const ogImg = document.getElementById('og-preview-img');
    if (ogImg) ogImg.src = seo.ogImage;
  }
  updateSerpPreview();
}

function syncSeoInputsToData() {
  if (!localSiteData.seo) localSiteData.seo = {};
  if (!localSiteData.seo.pages) localSiteData.seo.pages = {};
  if (!localSiteData.seo.pages[currentSeoPage]) localSiteData.seo.pages[currentSeoPage] = {};
  if (!localSiteData.seo.global) localSiteData.seo.global = {};

  const p = localSiteData.seo.pages[currentSeoPage];
  p.title = getVal('seo-input-title');
  p.description = getVal('seo-input-desc');
  p.keywords = getVal('seo-input-keywords');
  p.ogTitle = p.title;
  p.ogDescription = p.description;

  const g = localSiteData.seo.global;
  g.siteName = getVal('seo-global-sitename') || 'LUCK WHEAT 幸运无限';
  g.canonicalBase = getVal('seo-global-canonical') || 'https://lucky-infinite.com';
  g.baiduVerify = getVal('seo-global-baidu');
  g.googleVerify = getVal('seo-global-google');
  g.bingVerify = getVal('seo-global-bing');
}

window.updateSerpPreview = function() {
  const title = getVal('seo-input-title') || 'LUCK WHEAT 幸运无限官方网站';
  const desc = getVal('seo-input-desc') || '暂无网页描述内容...';

  document.getElementById('serp-preview-title').textContent = title;
  document.getElementById('serp-preview-desc').textContent = desc;
  document.getElementById('og-preview-title').textContent = title;
  document.getElementById('og-preview-desc').textContent = desc;

  const tLen = title.length;
  const countEl = document.getElementById('seo-title-count');
  if (tLen >= 25 && tLen <= 65) {
    countEl.innerHTML = `<span style="color:var(--admin-green);">长度健康 (${tLen} 字符)</span>`;
  } else if (tLen > 65) {
    countEl.innerHTML = `<span style="color:var(--admin-orange);">略长，搜索结果易被截断 (${tLen} 字符)</span>`;
  } else {
    countEl.innerHTML = `<span style="color:var(--admin-blue);">偏短 (${tLen} 字符)</span>`;
  }
};

window.handleOgImageUpload = async function(inputEl) {
  const file = inputEl.files[0];
  if (!file) return;
  showToast('正在压缩并上传社交分享大图...');
  const imgUrl = await compressAndUploadImage(file, 1200, 0.85, `og_${currentSeoPage}`);
  document.getElementById('og-preview-img').src = imgUrl;
  if (!localSiteData.seo) localSiteData.seo = {};
  if (!localSiteData.seo.pages) localSiteData.seo.pages = {};
  if (!localSiteData.seo.pages[currentSeoPage]) localSiteData.seo.pages[currentSeoPage] = {};
  localSiteData.seo.pages[currentSeoPage].ogImage = imgUrl;
  inputEl.value = '';
  showToast('社交大图已就绪！请点击右上角保存生效');
};

window.generateAndDownloadSitemap = function() {
  syncSeoInputsToData();
  const baseUrl = (localSiteData.seo?.global?.canonicalBase) || 'https://lucky-infinite.com';
  const pages = ['index.html', 'products.html', 'lucky-mini.html', 'support.html', 'channels.html', 'partners.html', 'about.html', 'contact.html'];
  const now = new Date().toISOString().split('T')[0];

  const ns = 'http://' + 'www.sitemaps.org/schemas/sitemap/0.9';
  let xml = '<' + '?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="' + ns + '">\n';
  pages.forEach(p => {
    xml += `  <url>\n    <loc>${baseUrl.replace(/\/$/, '')}/${p}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${p === 'index.html' || p === 'lucky-mini.html' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
  });
  xml += `</urlset>`;

  downloadFile('sitemap.xml', xml, 'application/xml');
  showToast('Sitemap.xml 生成成功，已自动开始下载！');
};
