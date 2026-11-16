/**
 * LUCK WHEAT 幸运无限 - 前台 CMS 数据驱动与 SEO 动态桥接器
 * 自动同步后台修改的文字、图片、SEO 标签及拦截保存前台预约线索
 */
(function() {
  // 1. 初始化数据中心
  function getMergedData() {
    const defaultData = window.LUCK_SITE_DEFAULT_DATA || {};
    try {
      const savedDataStr = localStorage.getItem('LUCK_SITE_CONTENT_DATA');
      if (savedDataStr) {
        const savedData = JSON.parse(savedDataStr);
        return deepMerge(defaultData, savedData);
      }
    } catch (e) {
      console.warn('[CMS Bridge] 读取后台本地存储失败，使用默认数据', e);
    }
    return defaultData;
  }

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

  // 2. 识别当前页面
  function detectCurrentPage() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('products')) return 'products';
    if (path.includes('lucky-mini')) return 'lucky_mini';
    if (path.includes('support')) return 'support';
    if (path.includes('channels')) return 'channels';
    if (path.includes('partners')) return 'partners';
    if (path.includes('about')) return 'about';
    if (path.includes('contact')) return 'contact';
    return 'index';
  }

  // 3. 应用 SEO 动态标签 (Title, Description, Keywords, OpenGraph, Schema.org)
  function applySEO(data, pageKey) {
    if (!data.seo) return;
    const pageSeo = (data.seo.pages && data.seo.pages[pageKey]) || {};
    const globalSeo = data.seo.global || {};

    // 网页 Title
    if (pageSeo.title) {
      document.title = pageSeo.title;
    }

    // 页面 Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    if (pageSeo.description) {
      metaDesc.setAttribute('content', pageSeo.description);
    }

    // 页面 Meta Keywords
    let metaKw = document.querySelector('meta[name="keywords"]');
    if (!metaKw) {
      metaKw = document.createElement('meta');
      metaKw.setAttribute('name', 'keywords');
      document.head.appendChild(metaKw);
    }
    if (pageSeo.keywords) {
      metaKw.setAttribute('content', pageSeo.keywords);
    }

    // 社交 Open Graph 标签注入
    setMetaProperty('og:site_name', globalSeo.siteName || 'LUCK WHEAT 幸运无限');
    setMetaProperty('og:title', pageSeo.ogTitle || pageSeo.title || document.title);
    setMetaProperty('og:description', pageSeo.ogDescription || pageSeo.description || '');
    if (pageSeo.ogImage) {
      setMetaProperty('og:image', pageSeo.ogImage);
    }

    // 站长平台验证代码注入
    if (globalSeo.baiduVerify) setMetaName('baidu-site-verification', globalSeo.baiduVerify);
    if (globalSeo.googleVerify) setMetaName('google-site-verification', globalSeo.googleVerify);

    // 结构化数据注入 (Schema.org JSON-LD)
    injectStructuredData(data, pageKey);
  }

  function setMetaProperty(prop, content) {
    if (!content) return;
    let meta = document.querySelector(`meta[property="${prop}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', prop);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  function setMetaName(name, content) {
    if (!content) return;
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  function injectStructuredData(data, pageKey) {
    let script = document.getElementById('luck-structured-data');
    if (!script) {
      script = document.createElement('script');
      script.id = 'luck-structured-data';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": pageKey === 'lucky_mini' ? "Product" : "Organization",
      "name": "LUCK WHEAT 幸运无限",
      "url": window.location.origin,
      "logo": window.location.origin + "/images/hero_banner_lucky_mini.jpg",
      "slogan": "拥有它，就拥有幸运"
    };

    if (pageKey === 'lucky_mini') {
      schemaData.name = "Lucky Mini 3.7 英寸 AI 旗舰小手机";
      schemaData.description = "掌心黄金尺寸的完整安卓智能小机，专属 Lucky 物理键一键唤醒大模型。";
      schemaData.offers = {
        "@type": "Offer",
        "priceCurrency": "USD",
        "price": "299.00",
        "availability": "https://schema.org/PreOrder"
      };
    }

    script.textContent = JSON.stringify(schemaData);
  }

  // 4. 应用全站图片资产替换 (支持所有 <img> 和 CSS background-image)
  function applyImageOverrides(data) {
    const images = data.images || {};
    Object.keys(images).forEach(origKey => {
      const newSrc = images[origKey];
      if (!newSrc || newSrc === origKey) return;

      // 提取文件名用于精确匹配，例如 "hero_banner_lucky_mini.jpg"
      const basename = origKey.split('/').pop();

      // 替换 <img> 标签
      document.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src') || '';
        if (src.includes(origKey) || src.includes(basename)) {
          img.src = newSrc;
        }
      });

      // 替换带有 background-image 样式的元素
      document.querySelectorAll('*').forEach(el => {
        const bg = el.style.backgroundImage || '';
        if (bg && (bg.includes(origKey) || bg.includes(basename))) {
          el.style.backgroundImage = `url("${newSrc}")`;
        }
      });
    });
  }

  // 5. 应用全局任意文本快速替换 (查找与替换)
  function applyTextReplacements(data) {
    const reps = data.textReplacements || {};
    const keys = Object.keys(reps);
    if (keys.length === 0) return;

    function walk(node) {
      if (node.nodeType === 3) { // 文本节点
        let val = node.nodeValue;
        let modified = false;
        keys.forEach(k => {
          if (k && reps[k] && val.includes(k)) {
            val = val.split(k).join(reps[k]);
            modified = true;
          }
        });
        if (modified) node.nodeValue = val;
      } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
        for (let i = 0; i < node.childNodes.length; i++) {
          walk(node.childNodes[i]);
        }
      }
    }
    walk(document.body);
  }

  // 6. 应用前台文字与结构化内容替换
  function applyContent(data, pageKey) {
    const content = data.content || {};
    const pageContent = content[pageKey] || {};
    const globalContent = content.global || {};

    // 6.1 通用带有 data-cms-key 标记的元素
    document.querySelectorAll('[data-cms-key]').forEach(el => {
      const key = el.getAttribute('data-cms-key');
      const val = pageContent[key] || globalContent[key];
      if (val !== undefined) {
        if (el.tagName === 'IMG') {
          el.src = val;
        } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.value = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // 6.2 全局公共区块 (Header & Footer)
    safeSetText('.brand-en', globalContent.brandEn);
    safeSetText('.brand-cn', globalContent.brandCn);
    safeSetText('.btn-header-cta', globalContent.headerCtaText);
    safeSetText('.footer-brand-p', globalContent.footerDesc);
    safeSetText('#footer-desc-text', globalContent.footerDesc);
    safeSetText('.service-hours-text', globalContent.serviceHours);
    safeSetText('.copyright-text', globalContent.copyright);
    safeSetText('.icp-text', globalContent.icpNumber);

    // 6.2.1 通用子页面顶部全景 Banner 动态加载与素材响应
    const bannerCard = document.querySelector('.subpage-banner-card');
    if (bannerCard) {
      const bannerKey = `images/banner_subpage_${pageKey.replace('-', '_')}.jpg`;
      if (data.images && data.images[bannerKey]) {
        bannerCard.style.backgroundImage = `url("${data.images[bannerKey]}")`;
      }
    }

    // 6.3 官方首页 (index.html)
    if (pageKey === 'index') {
      // 幻灯片 1
      safeSetText('#hero-slide-0 .eyebrow', pageContent.hero_badge);
      safeSetText('#hero-slide-0 .hero-title', pageContent.hero_title);
      safeSetText('#hero-slide-0 .hero-subtitle', pageContent.hero_subtitle);
      safeSetText('#hero-slide-0 .hero-actions a:first-child', pageContent.hero_btn_primary);
      safeSetText('#hero-slide-0 .hero-actions a:last-child', pageContent.hero_btn_secondary);
      safeSetText('#hero-slide-0 .badge-left span:last-child', pageContent.hero_badge_left);
      safeSetText('#hero-slide-0 .badge-right span', pageContent.hero_badge_right);
      if (pageContent.hero_image_mini) {
        const bg1 = document.querySelector('#hero-slide-0 .hero-banner-card');
        if (bg1) bg1.style.backgroundImage = `url("${pageContent.hero_image_mini}")`;
      }

      // 幻灯片 2
      safeSetText('#hero-slide-1 .eyebrow', pageContent.hero_slide2_badge);
      safeSetText('#hero-slide-1 .hero-title', pageContent.hero_slide2_title);
      safeSetText('#hero-slide-1 .hero-subtitle', pageContent.hero_slide2_sub);
      safeSetText('#hero-slide-1 .hero-actions a:first-child', pageContent.hero_slide2_btn1);
      safeSetText('#hero-slide-1 .hero-actions a:last-child', pageContent.hero_slide2_btn2);
      safeSetText('#hero-slide-1 .badge-left span', pageContent.hero_slide2_badge_left);
      safeSetText('#hero-slide-1 .badge-right span', pageContent.hero_slide2_badge_right);
      if (pageContent.hero_image_tab) {
        const bg2 = document.querySelector('#hero-slide-1 .hero-banner-card');
        if (bg2) bg2.style.backgroundImage = `url("${pageContent.hero_image_tab}")`;
      }

      // 幻灯片 3
      safeSetText('#hero-slide-2 .eyebrow', pageContent.hero_slide3_badge);
      safeSetText('#hero-slide-2 .hero-title', pageContent.hero_slide3_title);
      safeSetText('#hero-slide-2 .hero-subtitle', pageContent.hero_slide3_sub);
      safeSetText('#hero-slide-2 .hero-actions a:first-child', pageContent.hero_slide3_btn1);
      safeSetText('#hero-slide-2 .hero-actions a:last-child', pageContent.hero_slide3_btn2);
      safeSetText('#hero-slide-2 .badge-left span', pageContent.hero_slide3_badge_left);
      safeSetText('#hero-slide-2 .badge-right span', pageContent.hero_slide3_badge_right);
      if (pageContent.hero_image_acc) {
        const bg3 = document.querySelector('#hero-slide-2 .hero-banner-card');
        if (bg3) bg3.style.backgroundImage = `url("${pageContent.hero_image_acc}")`;
      }

      // 核心度量条
      const stats = document.querySelectorAll('.stats-banner .stat-item');
      if (stats.length >= 4) {
        if (pageContent.stat_1_val) stats[0].querySelector('.stat-number').textContent = pageContent.stat_1_val;
        if (pageContent.stat_1_lbl) stats[0].querySelector('.stat-label').textContent = pageContent.stat_1_lbl;
        if (pageContent.stat_2_val) stats[1].querySelector('.stat-number').textContent = pageContent.stat_2_val;
        if (pageContent.stat_2_lbl) stats[1].querySelector('.stat-label').textContent = pageContent.stat_2_lbl;
        if (pageContent.stat_3_val) stats[2].querySelector('.stat-number').textContent = pageContent.stat_3_val;
        if (pageContent.stat_3_lbl) stats[2].querySelector('.stat-label').textContent = pageContent.stat_3_lbl;
        if (pageContent.stat_4_val) stats[3].querySelector('.stat-number').textContent = pageContent.stat_4_val;
        if (pageContent.stat_4_lbl) stats[3].querySelector('.stat-label').textContent = pageContent.stat_4_lbl;
      }

      // 品牌理念
      safeSetText('#concept-heading', pageContent.concept_title);
      const conceptSection = document.querySelector('section[aria-labelledby="concept-heading"]');
      if (conceptSection) {
        const descP = conceptSection.querySelector('.section-desc');
        if (descP && pageContent.concept_desc) descP.textContent = pageContent.concept_desc;
        const cards = conceptSection.querySelectorAll('.grid-3 .card');
        if (cards.length >= 3) {
          if (pageContent.concept_card1_title) cards[0].querySelector('.card-title').textContent = pageContent.concept_card1_title;
          if (pageContent.concept_card1_desc) cards[0].querySelector('.card-desc').textContent = pageContent.concept_card1_desc;
          if (pageContent.concept_card2_title) cards[1].querySelector('.card-title').textContent = pageContent.concept_card2_title;
          if (pageContent.concept_card2_desc) cards[1].querySelector('.card-desc').textContent = pageContent.concept_card2_desc;
          if (pageContent.concept_card3_title) cards[2].querySelector('.card-title').textContent = pageContent.concept_card3_title;
          if (pageContent.concept_card3_desc) cards[2].querySelector('.card-desc').textContent = pageContent.concept_card3_desc;
        }
      }

      // 底部 CTA
      safeSetText('#cta-heading', pageContent.cta_title);
      const ctaSection = document.querySelector('section[aria-labelledby="cta-heading"]');
      if (ctaSection) {
        const descP = ctaSection.querySelector('.section-desc');
        if (descP && pageContent.cta_desc) descP.textContent = pageContent.cta_desc;
        const btns = ctaSection.querySelectorAll('.cta-actions .btn');
        if (btns.length >= 2) {
          if (pageContent.cta_btn1_text) btns[0].textContent = pageContent.cta_btn1_text;
          if (pageContent.cta_btn2_text) btns[1].textContent = pageContent.cta_btn2_text;
        }
      }

      // 品牌动态列表渲染 (支持微信公众号推文链接直达)
      const newsContainer = document.getElementById('brand-news-list');
      if (newsContainer && pageContent.brand_news && Array.isArray(pageContent.brand_news)) {
        newsContainer.innerHTML = pageContent.brand_news.map(item => `
          <a href="${item.link || 'https://mp.weixin.qq.com'}" target="_blank" rel="noopener noreferrer" class="card brand-news-card" style="padding: 22px 28px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--brand-primary);">${item.date || ''}</div>
              <span class="news-link-badge">${(item.link && item.link.includes('weixin.qq.com')) ? '微信推文 ↗' : '阅读全文 ↗'}</span>
            </div>
            <h3 style="font-size: 1.1rem; margin-bottom: 6px; color: var(--text-primary);">${item.title || ''}</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0;">${item.desc || ''}</p>
          </a>
        `).join('');
      }
    }

    // 6.4 产品中心 (products.html)
    else if (pageKey === 'products') {
      safeSetText('#products-title', pageContent.page_title);
      safeSetText('.subpage-banner-desc', pageContent.page_desc);
      safeSetText('#heading-phone-series', pageContent.phone_series_title);
      safeSetText('#desc-phone-series', pageContent.phone_series_desc);
      safeSetText('#heading-tablet-series', pageContent.tablet_series_title);
      safeSetText('#desc-tablet-series', pageContent.tablet_series_desc);
      safeSetText('#heading-acc-series', pageContent.acc_series_title);
      safeSetText('#desc-acc-series', pageContent.acc_series_desc);

      // 结构化产品中心单品卡片同步更新与动态新增
      if (pageContent.items && Array.isArray(pageContent.items)) {
        const itemIds = new Set(pageContent.items.map(it => it.id));
        document.querySelectorAll('[data-product-id]').forEach(el => {
          const pid = el.getAttribute('data-product-id');
          if (!itemIds.has(pid)) el.style.display = 'none';
        });

        pageContent.items.forEach(it => {
          let card = document.querySelector(`[data-product-id="${it.id}"]`);
          if (!card) {
            const targetGrid = it.series === 'phone'
              ? document.getElementById('series-phone')
              : (it.series === 'tablet'
                ? document.querySelector('#series-tablet .grid-2')
                : document.querySelector('#series-accessories .grid-3'));
            if (targetGrid) {
              card = document.createElement('article');
              card.className = 'product-card';
              card.setAttribute('data-product-id', it.id);
              if (it.series === 'phone') card.style.marginTop = '24px';
              const badgeClass = it.badgeType === 'pending' ? 'badge-pending' : 'badge-live';
              const buyHref = it.buyUrl || 'channels.html';
              const isExt = /^https?:\/\//i.test(buyHref);
              card.innerHTML = `
                <div class="product-thumb" style="cursor: pointer;" data-open-detail="${it.id}" title="点击查看详情与上传实拍图">
                  <img src="${it.image || 'images/showcase_lucky_mini.jpg'}" alt="${it.title || ''}" class="product-thumb-img" loading="lazy">
                </div>
                <div class="product-info">
                  <div class="product-meta">
                    <span class="badge ${badgeClass}">${it.badge || '新品'}</span>
                    <span class="badge badge-subtle">${it.series === 'phone' ? '手机系列' : (it.series === 'tablet' ? '平板系列' : '配件系列')}</span>
                  </div>
                  <h3 class="product-name" style="font-size: 1.35rem; cursor: pointer;" data-open-detail="${it.id}">${it.title || ''}</h3>
                  <p class="product-description">${it.desc || ''}</p>
                  <div class="product-footer">
                    <div class="product-price">
                      <span class="price-main">${it.price || ''}</span>
                      <span class="price-sub">${it.priceSub || ''}</span>
                    </div>
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                      <button type="button" class="btn btn-secondary btn-sm" data-open-detail="${it.id}">查看详情</button>
                      <a href="${buyHref}" ${isExt ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-primary btn-sm" data-buy-link>${it.buyText || '立即购买'} ↗</a>
                    </div>
                  </div>
                </div>
              `;
              targetGrid.appendChild(card);
            }
          } else {
            const img = card.querySelector('img');
            if (img && it.image) img.src = it.image;
            const nameEl = card.querySelector('.product-name, .hero-phone-title');
            if (nameEl && it.title) nameEl.textContent = it.title;
            const subEl = card.querySelector('.hero-phone-subtitle');
            if (subEl && it.subtitle) subEl.textContent = it.subtitle;
            const descEl = card.querySelector('.product-description, .hero-phone-desc');
            if (descEl && it.desc) descEl.textContent = it.desc;
            const priceEl = card.querySelector('.price-main');
            if (priceEl && it.price) priceEl.textContent = it.price;
            const priceSubEl = card.querySelector('.price-sub');
            if (priceSubEl && it.priceSub) priceSubEl.textContent = it.priceSub;
            const buyBtn = card.querySelector('[data-buy-link]');
            if (buyBtn && it.buyUrl) {
              buyBtn.href = it.buyUrl;
              if (/^https?:\/\//i.test(it.buyUrl)) {
                buyBtn.setAttribute('target', '_blank');
                buyBtn.setAttribute('rel', 'noopener noreferrer');
              } else {
                buyBtn.removeAttribute('target');
                buyBtn.removeAttribute('rel');
              }
              if (it.buyText) buyBtn.textContent = it.buyText + ' ↗';
            }
          }
        });
      }
    }

    // 6.5 Lucky Mini 旗舰页 (lucky-mini.html)
    else if (pageKey === 'lucky_mini') {
      safeSetText('#mini-title', pageContent.title);
      safeSetText('#mini-sub', pageContent.sub);
      safeSetText('#mini-desc', pageContent.desc);
      safeSetText('#features-title', pageContent.features_title);
      safeSetText('#features-desc', pageContent.features_desc);
    }

    // 6.6 服务支持 (support.html)
    else if (pageKey === 'support') {
      safeSetText('#support-title', pageContent.page_title);
      safeSetText('#support-desc', pageContent.page_desc);
      safeSetText('#os-heading', pageContent.os_heading);
      safeSetText('#warranty-heading', pageContent.warranty_heading);
      safeSetText('#compat-heading', pageContent.compat_heading);
      safeSetText('#faq-heading', pageContent.faq_heading);
    }

    // 6.7 购买渠道 (channels.html)
    else if (pageKey === 'channels') {
      safeSetText('#channels-title', pageContent.page_title);
      safeSetText('#channels-desc', pageContent.page_desc);
      safeSetText('#policy-heading', pageContent.policy_heading);
      safeSetText('#form-heading', pageContent.form_heading);
    }

    // 6.8 合作代理 (partners.html)
    else if (pageKey === 'partners') {
      safeSetText('#partners-title', pageContent.page_title);
      safeSetText('#partners-desc', pageContent.page_desc);
      safeSetText('#support-offerings', pageContent.support_offerings);
      safeSetText('#steps-title', pageContent.steps_title);
      safeSetText('#apply-heading', pageContent.apply_heading);
    }

    // 6.9 关于我们 (about.html)
    else if (pageKey === 'about') {
      safeSetText('#about-title', pageContent.page_title);
      safeSetText('#about-desc', pageContent.page_desc);
      safeSetText('#timeline-title', pageContent.timeline_title);
      safeSetText('#strengths-title', pageContent.strengths_title);
      safeSetText('#culture-title', pageContent.culture_title);
      safeSetText('#certs-heading', pageContent.certs_heading);
    }

    // 6.10 联系我们 (contact.html)
    else if (pageKey === 'contact') {
      safeSetText('#contact-title', pageContent.page_title);
      safeSetText('#contact-desc', pageContent.page_desc);
      safeSetText('#dept-table-heading', pageContent.dept_table_heading);
    }
  }

  function safeSetText(selector, text) {
    if (!text) return;
    const els = document.querySelectorAll(selector);
    els.forEach(el => { el.textContent = text; });
  }

  // 7. 监听与拦截前台预约表单，持久化保存在线索库
  function hookLeadSubmission() {
    document.addEventListener('submit', (e) => {
      const form = e.target;
      handleFormLead(form);
    });

    const submitBtn = document.querySelector('#btn-submit-message, button[type="submit"]');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const form = submitBtn.closest('form') || document.querySelector('.contact-form-grid');
        if (form) handleFormLead(form);
      });
    }
  }

  function handleFormLead(form) {
    try {
      const nameInput = form.querySelector('input[name="name"], #contact-name, input[placeholder*="称呼"], input[placeholder*="姓名"]');
      const phoneInput = form.querySelector('input[name="phone"], #contact-phone, input[placeholder*="手机"]');
      const emailInput = form.querySelector('input[name="email"], #contact-email, input[placeholder*="邮箱"]');
      const msgInput = form.querySelector('textarea, #contact-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const notes = msgInput ? msgInput.value.trim() : '';

      if (!name && !phone && !email) return;

      const newLead = {
        id: 'LEAD-' + Date.now().toString().slice(-6),
        name: name || '官网访客',
        phone: phone || '-',
        email: email || '-',
        product: document.title.includes('Lucky Mini') ? 'Lucky Mini 旗舰' : '官网咨询',
        date: new Date().toLocaleString('zh-CN', { hour12: false }),
        status: '待联系',
        notes: notes || '来自官网前台在线表单提交'
      };

      const existingLeads = JSON.parse(localStorage.getItem('LUCK_SITE_LEADS_DATA') || '[]');
      existingLeads.unshift(newLead);
      localStorage.setItem('LUCK_SITE_LEADS_DATA', JSON.stringify(existingLeads));
      console.log('[CMS Bridge] 成功录入客户新线索：', newLead);
    } catch (err) {
      console.warn('[CMS Bridge] 收集线索异常', err);
    }
  }

  // 8. 页面加载就绪执行
  window.LUCK_GET_MERGED_DATA = getMergedData;
  document.addEventListener('DOMContentLoaded', () => {
    const data = getMergedData();
    window.LUCK_CMS_DATA = data;
    const pageKey = detectCurrentPage();
    applySEO(data, pageKey);
    applyImageOverrides(data);
    applyContent(data, pageKey);
    applyTextReplacements(data);
    hookLeadSubmission();
  });
})();
