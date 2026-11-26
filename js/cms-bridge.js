/**
 * LUCK WHEAT 幸运无限 - 前台 CMS 数据驱动与 SEO 动态桥接器
 * 支持：服务器实时 API 同步 (/api/site-data) + 静态快照 (data/site_live_data.js) + 本地预览兜底
 */
(function() {
  let serverLiveSiteData = null;
  let hasServerResponse = false;

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

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // 1. 数据融合中心：服务器实时 JSON > 静态发布快照 > 浏览器本地缓存 > 出厂默认字典
  function getMergedData() {
    const defaultData = window.LUCK_SITE_DEFAULT_DATA || {};
    const staticLiveData = (window.LUCK_SITE_LIVE_DATA && isObject(window.LUCK_SITE_LIVE_DATA))
      ? window.LUCK_SITE_LIVE_DATA
      : null;

    let merged = defaultData;
    if (staticLiveData) {
      merged = deepMerge(merged, staticLiveData);
    }

    if (hasServerResponse && serverLiveSiteData) {
      // 服务端在线且已有保存数据时，以服务器为唯一权威真相源
      merged = deepMerge(defaultData, serverLiveSiteData);
      return merged;
    }

    // 若未连接服务器保存（或处于纯静态/本地演示模式），允许读取当前浏览器本地缓存预览
    if (!hasServerResponse && window.location.protocol !== 'file:') {
      // 在等待服务端确认期间：若有 staticLiveData 则先用它，否则读 localStorage
      if (staticLiveData) return merged;
    }

    try {
      const savedDataStr = localStorage.getItem('LUCK_SITE_CONTENT_DATA');
      if (savedDataStr) {
        const savedData = JSON.parse(savedDataStr);
        merged = deepMerge(merged, savedData);
      }
    } catch (e) {
      console.warn('[CMS Bridge] 读取本地缓存失败，使用静态/默认数据', e);
    }
    return merged;
  }

  // 智能仲裁“图片总库替换图”与“单页特定替换图”，防止互相覆盖
  function resolvePreferredImg(pageFieldVal, defaultOrigPath, imagesMap) {
    const mapOverride = imagesMap && imagesMap[defaultOrigPath];
    const hasMapOverride = !!(mapOverride && mapOverride !== defaultOrigPath);
    const hasFieldOverride = !!(pageFieldVal && pageFieldVal !== defaultOrigPath);
    if (hasFieldOverride) return pageFieldVal;
    if (hasMapOverride) return mapOverride;
    return pageFieldVal || defaultOrigPath;
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

  // 3. 应用 SEO 动态标签
  function applySEO(data, pageKey) {
    if (!data.seo) return;
    const pageSeo = (data.seo.pages && data.seo.pages[pageKey]) || {};
    const globalSeo = data.seo.global || {};

    if (pageSeo.title) {
      document.title = pageSeo.title;
    }

    setMetaName('description', pageSeo.description || globalSeo.defaultDescription);
    setMetaName('keywords', pageSeo.keywords || globalSeo.defaultKeywords);

    setMetaProperty('og:site_name', globalSeo.siteName || 'LUCK WHEAT 幸运无限');
    setMetaProperty('og:title', pageSeo.ogTitle || pageSeo.title || document.title);
    setMetaProperty('og:description', pageSeo.ogDescription || pageSeo.description || '');
    if (pageSeo.ogImage) {
      setMetaProperty('og:image', pageSeo.ogImage);
    }

    if (globalSeo.baiduVerify) setMetaName('baidu-site-verification', globalSeo.baiduVerify);
    if (globalSeo.googleVerify) setMetaName('google-site-verification', globalSeo.googleVerify);
    if (globalSeo.bingVerify) setMetaName('msvalidate.01', globalSeo.bingVerify);

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

    const origin = window.location.origin && window.location.origin !== 'null'
      ? window.location.origin
      : ((data.seo && data.seo.global && data.seo.global.canonicalBase) || '');

    const schemaData = {
      "@context": "https://schema.org",
      "@type": pageKey === 'lucky_mini' ? "Product" : "Organization",
      "name": (data.content && data.content.global && data.content.global.brandEn) || "LUCK WHEAT 幸运无限",
      "url": origin,
      "logo": origin + "/images/hero_banner_lucky_mini.jpg",
      "slogan": (data.content && data.content.global && data.content.global.slogan) || "拥有它，就拥有幸运"
    };

    if (pageKey === 'lucky_mini') {
      const mini = (data.content && data.content.lucky_mini) || {};
      schemaData.name = mini.title || "Lucky Mini 3.7 英寸 AI 旗舰小手机";
      schemaData.description = mini.sub || "掌心黄金尺寸的完整安卓智能小机，专属 Lucky 物理键一键唤醒大模型。";
      schemaData.offers = {
        "@type": "Offer",
        "priceCurrency": "USD",
        "price": (mini.price || "299").replace(/[^\d.]/g, '') || "299.00",
        "availability": "https://schema.org/PreOrder"
      };
    }

    script.textContent = JSON.stringify(schemaData);
  }

  // 4. 应用全站图片资产替换
  function applyImageOverrides(data) {
    const images = data.images || {};
    Object.keys(images).forEach(origKey => {
      const newSrc = images[origKey];
      if (!newSrc || newSrc === origKey) return;
      const basename = origKey.split('/').pop();

      document.querySelectorAll('img').forEach(img => {
        if (!img.dataset.origSrc) {
          img.dataset.origSrc = img.getAttribute('src') || '';
        }
        const checkSrc = img.dataset.origSrc;
        if (checkSrc && (checkSrc.includes(origKey) || checkSrc.includes(basename))) {
          img.src = newSrc;
        }
      });

      document.querySelectorAll('*').forEach(el => {
        if (!el.dataset.origBg && el.style.backgroundImage) {
          el.dataset.origBg = el.style.backgroundImage;
        }
        const checkBg = el.dataset.origBg || '';
        if (checkBg && (checkBg.includes(origKey) || checkBg.includes(basename))) {
          el.style.backgroundImage = `url("${newSrc}")`;
        }
      });
    });
  }

  // 5. 应用全局任意文本快速替换
  function applyTextReplacements(data) {
    const reps = data.textReplacements || {};
    const keys = Object.keys(reps).filter(Boolean);
    if (keys.length === 0) return;

    function walk(node) {
      if (node.nodeType === 3) {
        let val = node.nodeValue;
        let modified = false;
        keys.forEach(k => {
          if (reps[k] !== undefined && val.includes(k)) {
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

  // 更新含 .badge-dot 图标标签的纯文本而不误删圆点元素
  function setTagTextKeepingDot(el, text) {
    if (!el || text === undefined || text === null || text === '') return;
    const dot = el.querySelector('.badge-dot');
    if (dot) {
      const dotHtml = dot.outerHTML;
      el.innerHTML = `${dotHtml} ${esc(text)}`;
    } else {
      el.textContent = text;
    }
  }

  // 按卡片数组精确对齐容器内卡片的数量与内容 (支持后台增删卡片)
  function syncDynamicCardGrid(container, list, renderCardFn, existingSelector) {
    if (!container || !Array.isArray(list)) return;
    const cards = Array.from(container.querySelectorAll(existingSelector || ':scope > .card, :scope > article.card'));
    // 确保数量足够，克隆已有卡片样式框架或新建
    while (container.querySelectorAll(existingSelector || ':scope > .card, :scope > article.card').length < list.length) {
      const tpl = cards[cards.length - 1] || cards[0];
      const clone = tpl ? tpl.cloneNode(true) : document.createElement('div');
      if (!tpl) clone.className = 'card';
      container.appendChild(clone);
    }
    const updatedCards = Array.from(container.querySelectorAll(existingSelector || ':scope > .card, :scope > article.card'));
    updatedCards.forEach((cardEl, idx) => {
      if (idx < list.length) {
        cardEl.style.display = '';
        renderCardFn(cardEl, list[idx], idx);
      } else {
        cardEl.style.display = 'none';
      }
    });
  }

  // 6. 应用前台文字与结构化内容替换
  function applyContent(data, pageKey) {
    const content = data.content || {};
    const pageContent = content[pageKey] || {};
    const globalContent = content.global || {};
    const imagesMap = data.images || {};

    // 6.1 通用带有 data-cms-key 标记的元素
    document.querySelectorAll('[data-cms-key]').forEach(el => {
      const key = el.getAttribute('data-cms-key');
      const val = pageContent[key] !== undefined ? pageContent[key] : globalContent[key];
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
    if (globalContent.headerCtaLink) {
      document.querySelectorAll('.btn-header-cta, .mobile-menu-cta a').forEach(btn => {
        btn.setAttribute('href', globalContent.headerCtaLink);
      });
    }
    if (globalContent.headerCtaText) {
      document.querySelectorAll('.mobile-menu-cta a').forEach(btn => {
        btn.textContent = globalContent.headerCtaText;
      });
    }

    if (globalContent.logoImage) {
      document.querySelectorAll('.brand-symbol').forEach(sym => {
        sym.innerHTML = `<img src="${esc(globalContent.logoImage)}" alt="${esc(globalContent.brandCn || 'Logo')}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;">`;
        sym.style.background = 'transparent';
        sym.style.overflow = 'hidden';
      });
    }

    if (Array.isArray(globalContent.navItems) && globalContent.navItems.length > 0) {
      const navMenu = document.querySelector('.nav-menu');
      if (navMenu) {
        const currentFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
        const mobileCta = navMenu.querySelector('.mobile-menu-cta');
        const mobileCtaHtml = mobileCta ? mobileCta.outerHTML : '';
        navMenu.innerHTML = globalContent.navItems.map(item => {
          const href = item.href || '#';
          const hrefFile = href.split('#')[0].split('?')[0].toLowerCase();
          const isActive = (hrefFile === currentFile) || (currentFile === '' && hrefFile === 'index.html');
          return `<li><a href="${esc(href)}" class="nav-link${isActive ? ' active' : ''}"${isActive ? ' aria-current="page"' : ''}>${esc(item.label || '')}</a></li>`;
        }).join('') + mobileCtaHtml;
      }
    }

    // 页脚信息与动态分栏重建 (支持自由增删列数与链接)
    safeSetText('.footer-desc, .footer-brand-p, #footer-desc-text', globalContent.footerDesc);
    safeSetText('.service-hours-text', globalContent.serviceHours);
    if (globalContent.copyright) {
      document.querySelectorAll('.footer-legal-row > div:first-child, .copyright-text').forEach(el => {
        el.textContent = globalContent.copyright;
      });
    }
    if (globalContent.icpNumber) {
      document.querySelectorAll('.footer-icp-link, .icp-text').forEach(el => {
        el.textContent = globalContent.icpNumber;
        if (globalContent.icpLink && el.tagName === 'A') {
          el.setAttribute('href', globalContent.icpLink);
        }
      });
    }
    if (Array.isArray(globalContent.footerColumns) && globalContent.footerColumns.length > 0) {
      const footerTop = document.querySelector('.footer-top');
      if (footerTop) {
        footerTop.querySelectorAll('.footer-col').forEach(col => col.remove());
        globalContent.footerColumns.forEach(colData => {
          const colDiv = document.createElement('div');
          colDiv.className = 'footer-col';
          const linksHtml = Array.isArray(colData.links)
            ? colData.links.map(lk => `<li><a href="${esc(lk.href || '#')}">${esc(lk.label || '')}</a></li>`).join('')
            : '';
          colDiv.innerHTML = `
            <h3>${esc(colData.title || '')}</h3>
            <ul class="footer-links">${linksHtml}</ul>
          `;
          footerTop.appendChild(colDiv);
        });
      }
    }

    // 全局邮箱同步（同步至客服默认邮箱链接）
    if (globalContent.contactEmail) {
      document.querySelectorAll('a[href="mailto:support@lucky-infinite.com"]').forEach(a => {
        a.href = `mailto:${globalContent.contactEmail}`;
        if (a.textContent.includes('support@')) a.textContent = globalContent.contactEmail;
      });
    }
    if (globalContent.b2bEmail) {
      document.querySelectorAll('a[href="mailto:sales@lucky-infinite.com"]').forEach(a => {
        a.href = `mailto:${globalContent.b2bEmail}`;
        if (a.textContent.includes('sales@')) a.textContent = globalContent.b2bEmail;
      });
    }

    // 6.2.1 通用子页面顶部全景 Banner 动态加载
    const bannerCard = document.querySelector('.subpage-banner-card');
    if (bannerCard) {
      const bannerKey = `images/banner_subpage_${pageKey.replace('-', '_')}.jpg`;
      if (imagesMap[bannerKey]) {
        bannerCard.style.backgroundImage = `url("${imagesMap[bannerKey]}")`;
      }
    }

    // 6.3 官方首页 (index.html)
    if (pageKey === 'index') {
      setSlideContent('#hero-slide-0', {
        badge: pageContent.hero_badge,
        title: pageContent.hero_title,
        sub: pageContent.hero_subtitle,
        btn1: pageContent.hero_btn_primary,
        btn1Href: pageContent.hero_btn1_href,
        btn2: pageContent.hero_btn_secondary,
        btn2Href: pageContent.hero_btn2_href,
        badgeLeft: pageContent.hero_badge_left,
        badgeRight: pageContent.hero_badge_right,
        image: resolvePreferredImg(pageContent.hero_image_mini, 'images/hero_banner_lucky_mini.jpg', imagesMap)
      });
      setSlideContent('#hero-slide-1', {
        badge: pageContent.hero_slide2_badge,
        title: pageContent.hero_slide2_title,
        sub: pageContent.hero_slide2_sub,
        btn1: pageContent.hero_slide2_btn1,
        btn1Href: pageContent.hero_slide2_btn1_href,
        btn2: pageContent.hero_slide2_btn2,
        btn2Href: pageContent.hero_slide2_btn2_href,
        badgeLeft: pageContent.hero_slide2_badge_left,
        badgeRight: pageContent.hero_slide2_badge_right,
        image: resolvePreferredImg(pageContent.hero_image_tab, 'images/hero_banner_lucky_tab.jpg', imagesMap)
      });
      setSlideContent('#hero-slide-2', {
        badge: pageContent.hero_slide3_badge,
        title: pageContent.hero_slide3_title,
        sub: pageContent.hero_slide3_sub,
        btn1: pageContent.hero_slide3_btn1,
        btn1Href: pageContent.hero_slide3_btn1_href,
        btn2: pageContent.hero_slide3_btn2,
        btn2Href: pageContent.hero_slide3_btn2_href,
        badgeLeft: pageContent.hero_slide3_badge_left,
        badgeRight: pageContent.hero_slide3_badge_right,
        image: resolvePreferredImg(pageContent.hero_image_acc, 'images/hero_banner_accessories.jpg', imagesMap)
      });

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
      const conceptSection = document.querySelector('section[aria-labelledby="concept-heading"]');
      if (conceptSection) {
        safeSetTextIn(conceptSection, '.eyebrow', pageContent.concept_eyebrow);
        safeSetText('#concept-heading', pageContent.concept_title);
        safeSetTextIn(conceptSection, '.section-desc', pageContent.concept_desc);
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

      // 首页产品矩阵区 (同步 products.items 前 4 款，直达产品详情或旗舰页)
      const prodSection = document.querySelector('section[aria-labelledby="products-heading"]');
      if (prodSection) {
        safeSetTextIn(prodSection, '.eyebrow', pageContent.products_eyebrow);
        safeSetText('#products-heading', pageContent.products_title);
        safeSetTextIn(prodSection, '.section-desc', pageContent.products_desc);
        const prodItems = (content.products && Array.isArray(content.products.items)) ? content.products.items : [];
        const grid4 = prodSection.querySelector('.grid-4');
        if (grid4 && prodItems.length > 0) {
          const top4 = prodItems.slice(0, 4);
          grid4.innerHTML = top4.map((it, idx) => {
            const isFirst = idx === 0;
            const badgeCls = it.badgeType === 'pending' ? 'badge-pending' : 'badge-live';
            const detailHref = it.id === 'lucky-mini'
              ? (it.detailUrl || 'lucky-mini.html')
              : `products.html?product=${encodeURIComponent(it.id)}`;
            const buyHref = (it.buyUrl && it.buyUrl.trim()) ? it.buyUrl : `channels.html?product=${encodeURIComponent(it.id)}`;
            const resolvedImg = resolvePreferredImg(it.image, it.image || 'images/showcase_lucky_mini.jpg', imagesMap);
            return `
              <article class="product-card${isFirst ? ' featured' : ''}">
                <div class="product-thumb" style="cursor:pointer;" onclick="location.href='${esc(detailHref)}'">
                  <img src="${esc(resolvedImg)}" alt="${esc(it.title)}" class="product-thumb-img" loading="lazy">
                </div>
                <div class="product-info">
                  <div class="product-meta">
                    <span class="badge ${badgeCls}">${esc(it.badge || '新品')}</span>
                    <span class="badge badge-subtle">${it.series === 'phone' ? '手机系列' : (it.series === 'tablet' ? '平板系列' : '智能配件')}</span>
                  </div>
                  <h3 class="product-name">${esc(it.title)}</h3>
                  <p class="product-description">${esc(it.desc)}</p>
                  ${isFirst && Array.isArray(it.specs) && it.specs.length ? `
                    <ul class="product-features-list">
                      ${it.specs.slice(0, 3).map(s => `
                        <li>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          ${esc(s.label)}：${esc(s.val)}
                        </li>
                      `).join('')}
                    </ul>
                  ` : ''}
                  <div class="product-footer">
                    <div class="product-price">
                      <span class="price-main"${it.badgeType === 'pending' ? ' style="font-size: 1.1rem; color: var(--status-pending);"' : ''}>${esc(it.price || '敬请期待')}</span>
                      <span class="price-sub">${esc(it.priceSub || '')}</span>
                    </div>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                      <a href="${esc(detailHref)}" class="btn btn-secondary btn-sm">详情</a>
                      <a href="${esc(buyHref)}" ${/^https?:\/\//i.test(buyHref) ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn ${isFirst ? 'btn-primary' : 'btn-secondary'} btn-sm">${esc(it.buyText || '购买')}</a>
                    </div>
                  </div>
                </div>
              </article>
            `;
          }).join('');
        }
      }

      // 首页核心体验与 Lucky 键仿真器
      const expSection = document.querySelector('section[aria-labelledby="experience-heading"]');
      if (expSection) {
        safeSetTextIn(expSection, '.eyebrow', pageContent.exp_eyebrow);
        safeSetText('#experience-heading', pageContent.exp_title);
        safeSetTextIn(expSection, '.section-desc', pageContent.exp_desc);
        if (Array.isArray(pageContent.exp_cards)) {
          syncDynamicCardGrid(expSection.querySelector('.grid-4'), pageContent.exp_cards, (cardEl, cItem) => {
            if (cItem.title) cardEl.querySelector('.card-title').textContent = cItem.title;
            if (cItem.desc) cardEl.querySelector('.card-desc').textContent = cItem.desc;
          }, ':scope > .card');
        }
        const simGuide = expSection.querySelector('.simulator-guide');
        if (simGuide) {
          if (pageContent.sim_title) simGuide.querySelector('h3').textContent = pageContent.sim_title;
          if (pageContent.sim_desc) simGuide.querySelector('p').textContent = pageContent.sim_desc;
          if (Array.isArray(pageContent.sim_steps)) {
            const steps = simGuide.querySelectorAll('.guide-step');
            pageContent.sim_steps.forEach((st, i) => {
              if (steps[i]) {
                if (st.title) steps[i].querySelector('h4').textContent = st.title;
                if (st.desc) steps[i].querySelector('p').textContent = st.desc;
              }
            });
          }
        }
        if (pageContent.sim_tip) {
          const tipP = expSection.querySelector('.simulator-device p');
          if (tipP) tipP.textContent = pageContent.sim_tip;
        }
      }

      // 首页品牌发展路径
      const pathSection = document.querySelector('section[aria-labelledby="path-heading"]');
      if (pathSection) {
        safeSetTextIn(pathSection, '.eyebrow', pageContent.path_eyebrow);
        safeSetText('#path-heading', pageContent.path_title);
        safeSetTextIn(pathSection, '.section-desc', pageContent.path_desc);
        if (Array.isArray(pageContent.path_cards)) {
          syncDynamicCardGrid(pathSection.querySelector('.grid-3'), pageContent.path_cards, (cardEl, pItem) => {
            const numEl = cardEl.querySelector('div[style*="font-mono"]');
            if (numEl && pItem.num) numEl.textContent = pItem.num;
            if (pItem.title) cardEl.querySelector('.card-title').textContent = pItem.title;
            if (pItem.desc) cardEl.querySelector('.card-desc').textContent = pItem.desc;
          }, ':scope > .card');
        }
      }

      // 首页品牌历程区
      const histSection = document.querySelector('section[aria-labelledby="history-heading"]');
      if (histSection) {
        safeSetTextIn(histSection, '.eyebrow', pageContent.history_eyebrow);
        safeSetText('#history-heading', pageContent.history_title);
        safeSetTextIn(histSection, '.section-desc', pageContent.history_desc);
        if (Array.isArray(pageContent.history_timeline)) {
          const tl = histSection.querySelector('.timeline');
          if (tl) {
            tl.innerHTML = pageContent.history_timeline.map(t => `
              <div class="timeline-item">
                <div class="timeline-year">${esc(t.year)}</div>
                <div class="timeline-content">${esc(t.content)}</div>
              </div>
            `).join('');
          }
        }
        const insistCard = histSection.querySelector('.grid-2 > .card');
        if (insistCard) {
          if (pageContent.history_insist_title) insistCard.querySelector('.card-title').textContent = pageContent.history_insist_title;
          if (Array.isArray(pageContent.history_insist_list)) {
            const ul = insistCard.querySelector('ul');
            if (ul) {
              ul.innerHTML = pageContent.history_insist_list.map(it => `
                <li style="display: flex; gap: 12px; align-items: flex-start;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 20px; height: 20px; color: var(--brand-primary); flex-shrink: 0; margin-top: 3px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span><strong>${esc(it.title)}</strong>：${esc(it.desc)}</span>
                </li>
              `).join('');
            }
          }
        }
      }

      // 首页品牌动态与创作者手记
      const newsSection = document.querySelector('section[aria-labelledby="news-heading"]');
      if (newsSection) {
        safeSetTextIn(newsSection, '.eyebrow', pageContent.news_eyebrow);
        safeSetText('#news-heading', pageContent.news_title);
        safeSetTextIn(newsSection, '.section-desc', pageContent.news_desc);
        const opinionCard = newsSection.querySelector('.grid-2 > .card');
        if (opinionCard) {
          safeSetTextIn(opinionCard, '.eyebrow', pageContent.opinion_eyebrow);
          safeSetTextIn(opinionCard, 'h3', pageContent.opinion_title);
          safeSetTextIn(opinionCard, 'blockquote', pageContent.opinion_quote);
          safeSetTextIn(opinionCard, 'p', pageContent.opinion_author);
        }
      }

      // 品牌动态列表渲染
      const newsContainer = document.getElementById('brand-news-list');
      if (newsContainer && Array.isArray(pageContent.brand_news)) {
        newsContainer.innerHTML = pageContent.brand_news.map(item => `
          <a href="${esc(item.link || 'https://mp.weixin.qq.com')}" target="_blank" rel="noopener noreferrer" class="card brand-news-card" style="padding: 22px 28px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--brand-primary);">${esc(item.date || '')}</div>
              <span class="news-link-badge">${(item.link && item.link.includes('weixin.qq.com')) ? '微信推文 ↗' : '阅读全文 ↗'}</span>
            </div>
            <h3 style="font-size: 1.1rem; margin-bottom: 6px; color: var(--text-primary);">${esc(item.title || '')}</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0;">${esc(item.desc || '')}</p>
          </a>
        `).join('');
      }

      // 底部 CTA
      safeSetText('#cta-heading', pageContent.cta_title);
      const ctaSection = document.querySelector('section[aria-labelledby="cta-heading"]');
      if (ctaSection) {
        const descP = ctaSection.querySelector('p');
        if (descP && pageContent.cta_desc) descP.textContent = pageContent.cta_desc;
        const btns = ctaSection.querySelectorAll('.cta-actions .btn');
        if (btns.length >= 2) {
          if (pageContent.cta_btn1_text) btns[0].textContent = pageContent.cta_btn1_text;
          if (pageContent.cta_btn1_href) btns[0].setAttribute('href', pageContent.cta_btn1_href);
          if (pageContent.cta_btn2_text) btns[1].textContent = pageContent.cta_btn2_text;
          if (pageContent.cta_btn2_href) btns[1].setAttribute('href', pageContent.cta_btn2_href);
        }
      }
    }

    // 6.4 产品中心 (products.html) —— 完整重构按后台顺序和所属系列分组渲染
    else if (pageKey === 'products') {
      safeSetText('.subpage-banner-eyebrow', pageContent.page_eyebrow);
      safeSetText('#products-title', pageContent.page_title);
      safeSetText('.subpage-banner-desc', pageContent.page_desc);

      setTagTextKeepingDot(document.querySelector('#series-phone .series-tag'), pageContent.phone_tag);
      safeSetText('#heading-phone-series', pageContent.phone_series_title);
      safeSetText('#series-phone .series-desc', pageContent.phone_series_desc);

      setTagTextKeepingDot(document.querySelector('#series-tablet .series-tag'), pageContent.tablet_tag);
      safeSetText('#heading-tablet-series', pageContent.tablet_series_title);
      safeSetText('#series-tablet .series-desc', pageContent.tablet_series_desc);

      setTagTextKeepingDot(document.querySelector('#series-accessories .series-tag'), pageContent.acc_tag);
      safeSetText('#heading-accessories-series', pageContent.acc_series_title);
      safeSetText('#series-accessories .series-desc', pageContent.acc_series_desc);

      // 研发哲学区
      const philSection = document.querySelector('section[aria-labelledby="philosophy-title"]');
      if (philSection) {
        safeSetTextIn(philSection, '.eyebrow', pageContent.philosophy_eyebrow);
        safeSetText('#philosophy-title', pageContent.philosophy_title);
        safeSetTextIn(philSection, '.section-desc', pageContent.philosophy_desc);
        if (Array.isArray(pageContent.philosophy_cards)) {
          syncDynamicCardGrid(philSection.querySelector('.grid-3'), pageContent.philosophy_cards, (cardEl, c) => {
            if (c.title) cardEl.querySelector('.card-title').textContent = c.title;
            if (c.desc) cardEl.querySelector('.card-desc').textContent = c.desc;
          }, ':scope > .card');
        }
        if (pageContent.philosophy_quote) {
          const qp = philSection.querySelector('div[style*="margin-top: 40px"] p');
          if (qp) qp.textContent = pageContent.philosophy_quote;
        }
      }

      // 动态更新单品小列表 & 按最新所属系列完整排列所有产品卡片
      if (Array.isArray(pageContent.items)) {
        const jumpBar = document.querySelector('.product-quick-jump-bar');
        if (jumpBar) {
          jumpBar.innerHTML = `<span style="font-size: 12px; color: var(--color-text-secondary); display: flex; align-items: center; white-space: nowrap; margin-right: 4px;">🎯 单品小列表：</span>` +
            pageContent.items.map(it => `<button type="button" class="btn-subtle-tag" onclick="quickJumpToProduct('${esc(it.id)}')">${esc(it.title)}</button>`).join('');
        }

        const phoneSec = document.getElementById('series-phone');
        const tabletGrid = document.querySelector('#series-tablet .grid-2');
        const accGrid = document.querySelector('#series-accessories .grid-3');

        // 清理原有静态产品卡片，按当前 items 顺序和系列重建，彻底解决调顺序/改系列/增删的同步问题
        if (phoneSec) phoneSec.querySelectorAll('[data-product-id]').forEach(el => el.remove());
        if (tabletGrid) tabletGrid.innerHTML = '';
        if (accGrid) accGrid.innerHTML = '';

        const phoneItems = pageContent.items.filter(it => it.series === 'phone');
        const tabletItems = pageContent.items.filter(it => it.series === 'tablet');
        const accItems = pageContent.items.filter(it => it.series !== 'phone' && it.series !== 'tablet');

        const buildStandardCard = (it) => {
          const card = document.createElement('article');
          card.className = 'product-card';
          card.setAttribute('data-product-id', it.id);
          const badgeClass = it.badgeType === 'pending' ? 'badge-pending' : 'badge-live';
          const buyHref = (it.buyUrl && it.buyUrl.trim()) ? it.buyUrl : `channels.html?product=${encodeURIComponent(it.id)}`;
          const isExt = /^https?:\/\//i.test(buyHref);
          const imgSrc = resolvePreferredImg(it.image, it.image || 'images/showcase_lucky_mini.jpg', imagesMap);
          card.innerHTML = `
            <div class="product-thumb" style="cursor: pointer;" data-open-detail="${esc(it.id)}" title="点击查看详情与详情页">
              <img src="${esc(imgSrc)}" alt="${esc(it.title || '')}" class="product-thumb-img" loading="lazy">
            </div>
            <div class="product-info">
              <div class="product-meta">
                <span class="badge ${badgeClass}">${esc(it.badge || '新品')}</span>
                <span class="badge badge-subtle">${it.series === 'phone' ? '手机系列' : (it.series === 'tablet' ? '平板系列' : '精工配件')}</span>
              </div>
              <h3 class="product-name" style="font-size: 1.35rem; cursor: pointer;" data-open-detail="${esc(it.id)}">${esc(it.title || '')}</h3>
              <p class="product-description">${esc(it.desc || '')}</p>
              <div class="product-footer">
                <div class="product-price">
                  <span class="price-main"${it.badgeType === 'pending' ? ' style="font-size: 1.15rem; color: var(--status-pending);"' : ''}>${esc(it.price || '')}</span>
                  <span class="price-sub">${esc(it.priceSub || '')}</span>
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                  <button type="button" class="btn btn-secondary btn-sm" data-open-detail="${esc(it.id)}">查看详情 / 详情页</button>
                  <a href="${esc(buyHref)}" ${isExt ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-primary btn-sm" data-buy-link>${esc(it.buyText || '立即购买')} ↗</a>
                </div>
              </div>
            </div>
          `;
          return card;
        };

        // 渲染手机系列 (首款使用全景旗舰卡 hero-phone-card，其余手机使用标准卡片)
        if (phoneSec) {
          phoneSec.style.display = phoneItems.length > 0 ? '' : 'none';
          phoneItems.forEach((it, idx) => {
            if (idx === 0) {
              const heroCard = document.createElement('article');
              heroCard.className = 'hero-phone-card';
              heroCard.setAttribute('data-product-id', it.id);
              const badgeClass = it.badgeType === 'pending' ? 'badge-pending' : 'badge-live';
              const buyHref = (it.buyUrl && it.buyUrl.trim()) ? it.buyUrl : `channels.html?product=${encodeURIComponent(it.id)}`;
              const isExt = /^https?:\/\//i.test(buyHref);
              const imgSrc = resolvePreferredImg(it.image, it.image || 'images/showcase_lucky_mini.jpg', imagesMap);
              const specsHtml = Array.isArray(it.specs) && it.specs.length
                ? it.specs.map(s => `<li><strong>${esc(s.label)}</strong> ${esc(s.val)}</li>`).join('')
                : '';
              heroCard.innerHTML = `
                <div class="hero-phone-visual" style="cursor: pointer;" data-open-detail="${esc(it.id)}" title="点击查看产品详情与详情页">
                  <img src="${esc(imgSrc)}" alt="${esc(it.title || '')}">
                </div>
                <div class="hero-phone-content">
                  <div class="product-meta">
                    <span class="badge ${badgeClass}">${esc(it.badge || '核心旗舰')}</span>
                    <span class="badge badge-subtle">手机系列</span>
                  </div>
                  <h3 class="hero-phone-title">${esc(it.title || '')}</h3>
                  <p class="hero-phone-subtitle">${esc(it.subtitle || '')}</p>
                  <p class="hero-phone-desc">${esc(it.desc || '')}</p>
                  ${specsHtml ? `<ul class="hero-phone-specs">${specsHtml}</ul>` : ''}
                  <div class="hero-phone-footer">
                    <div class="product-price">
                      <span class="price-main">${esc(it.price || '')}</span>
                      <span class="price-sub">${esc(it.priceSub || '')}</span>
                    </div>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                      <button type="button" class="btn btn-secondary btn-md" data-open-detail="${esc(it.id)}">查看详情与详情页 &gt;</button>
                      <a href="${esc(buyHref)}" ${isExt ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-primary btn-md" data-buy-link>${esc(it.buyText || '立即购买')} ↗</a>
                      ${it.id === 'lucky-mini' ? `<a href="lucky-mini.html" class="btn btn-secondary btn-md">了解旗舰页 &gt;</a>` : ''}
                    </div>
                  </div>
                </div>
              `;
              phoneSec.appendChild(heroCard);
            } else {
              const card = buildStandardCard(it);
              card.style.marginTop = '24px';
              phoneSec.appendChild(card);
            }
          });
        }

        const tabletSec = document.getElementById('series-tablet');
        if (tabletSec) tabletSec.style.display = tabletItems.length > 0 ? '' : 'none';
        if (tabletGrid) tabletItems.forEach(it => tabletGrid.appendChild(buildStandardCard(it)));

        const accSec = document.getElementById('series-accessories');
        if (accSec) accSec.style.display = accItems.length > 0 ? '' : 'none';
        if (accGrid) accItems.forEach(it => accGrid.appendChild(buildStandardCard(it)));
      }
    }

    // 6.5 Lucky Mini 旗舰页 (lucky-mini.html)
    else if (pageKey === 'lucky_mini') {
      safeSetText('.subpage-banner-eyebrow', pageContent.banner_eyebrow);
      safeSetText('.subpage-banner-title', pageContent.banner_title);
      safeSetText('.subpage-banner-desc', pageContent.banner_desc);

      const heroSec = document.querySelector('section[aria-labelledby="mini-title"]');
      if (heroSec) {
        safeSetTextIn(heroSec, '.badge-live', pageContent.badge);
        safeSetText('#mini-title', pageContent.title);
        safeSetText('#mini-sub', pageContent.sub);
        safeSetText('#mini-desc', pageContent.desc);
        const pricingCard = document.getElementById('pricing');
        if (pricingCard) {
          safeSetTextIn(pricingCard, '.mini-price-label', pageContent.price_label);
          safeSetTextIn(pricingCard, '.mini-price-val', pageContent.price);
          safeSetTextIn(pricingCard, '.mini-price-sub', pageContent.price_sub);
          safeSetTextIn(pricingCard, '.badge-live', pageContent.promo_badge);
          safeSetTextIn(pricingCard, '.mini-promo-tip', pageContent.promo_tip);
          const btns = pricingCard.querySelectorAll('.btn');
          if (btns.length >= 2) {
            if (pageContent.buy_btn_text) btns[0].textContent = pageContent.buy_btn_text;
            if (pageContent.buy_btn_href) btns[0].setAttribute('href', pageContent.buy_btn_href);
            if (pageContent.b2b_btn_text) btns[1].textContent = pageContent.b2b_btn_text;
            if (pageContent.b2b_btn_href) btns[1].setAttribute('href', pageContent.b2b_btn_href);
          }
        }
      }

      // 五大核心能力
      const featSec = document.querySelector('section[aria-labelledby="features-title"]');
      if (featSec) {
        safeSetTextIn(featSec, '.eyebrow', pageContent.features_eyebrow);
        safeSetText('#features-title', pageContent.features_title);
        safeSetTextIn(featSec, '.section-desc', pageContent.features_desc);
        if (Array.isArray(pageContent.features_list)) {
          syncDynamicCardGrid(featSec.querySelector('.grid-3'), pageContent.features_list, (cardEl, f) => {
            if (f.title) cardEl.querySelector('.card-title').textContent = f.title;
            if (f.desc) cardEl.querySelector('.card-desc').textContent = f.desc;
          }, ':scope > .card');
        }
      }

      // 适合谁用
      const audSec = document.querySelector('section[aria-labelledby="audience-title"]');
      if (audSec) {
        safeSetTextIn(audSec, '.eyebrow', pageContent.audience_eyebrow);
        safeSetText('#audience-title', pageContent.audience_title);
        safeSetTextIn(audSec, '.section-desc', pageContent.audience_desc);
        if (Array.isArray(pageContent.audience_list)) {
          syncDynamicCardGrid(audSec.querySelector('.grid-4'), pageContent.audience_list, (cardEl, a) => {
            if (a.tag) cardEl.querySelector('.badge').textContent = a.tag;
            if (a.title) cardEl.querySelector('.card-title').textContent = a.title;
            if (a.desc) cardEl.querySelector('.card-desc').textContent = a.desc;
          }, ':scope > .card');
        }
      }

      // 规格参数表
      const specSec = document.querySelector('section[aria-labelledby="specs-title"]');
      if (specSec) {
        safeSetTextIn(specSec, '.eyebrow', pageContent.specs_eyebrow);
        safeSetText('#specs-title', pageContent.specs_title);
        safeSetTextIn(specSec, '.section-desc', pageContent.specs_desc);
        safeSetTextIn(specSec, 'caption', pageContent.specs_caption);
        if (Array.isArray(pageContent.specs_rows)) {
          const tbody = specSec.querySelector('tbody');
          if (tbody) {
            tbody.innerHTML = pageContent.specs_rows.map(r => `
              <tr>
                <th scope="row">${esc(r.label)}</th>
                <td>${esc(r.val)}</td>
              </tr>
            `).join('');
          }
        }
      }

      // 配套周边生态
      const accSec = document.querySelector('section[aria-labelledby="accessories-title"]');
      if (accSec) {
        safeSetTextIn(accSec, '.eyebrow', pageContent.acc_eyebrow);
        safeSetText('#accessories-title', pageContent.acc_title);
        safeSetTextIn(accSec, '.section-desc', pageContent.acc_desc);
        if (Array.isArray(pageContent.acc_list)) {
          syncDynamicCardGrid(accSec.querySelector('.grid-3'), pageContent.acc_list, (cardEl, a) => {
            if (a.title) cardEl.querySelector('.card-title').textContent = a.title;
            if (a.desc) cardEl.querySelector('.card-desc').textContent = a.desc;
          }, ':scope > .card');
        }
      }

      // 相关产品区
      const relSec = document.getElementById('mini-related-section');
      if (relSec) {
        safeSetTextIn(relSec, 'h2', pageContent.related_title);
        safeSetTextIn(relSec, 'p', pageContent.related_desc);
        const btn = relSec.querySelector('.btn');
        if (btn) {
          if (pageContent.related_btn_text) btn.textContent = pageContent.related_btn_text;
          if (pageContent.related_btn_href) btn.setAttribute('href', pageContent.related_btn_href);
        }
      }
    }

    // 6.6 服务支持 (support.html)
    else if (pageKey === 'support') {
      safeSetText('.subpage-banner-eyebrow', pageContent.banner_eyebrow);
      safeSetText('#support-title', pageContent.page_title);
      safeSetText('.subpage-banner-desc', pageContent.page_desc);

      const osSec = document.getElementById('lucky-os');
      if (osSec) {
        safeSetText('#os-heading', pageContent.os_heading);
        safeSetTextIn(osSec, '.section-header p', pageContent.os_desc);
        if (Array.isArray(pageContent.os_rows)) {
          const tbody = osSec.querySelector('tbody');
          if (tbody) {
            tbody.innerHTML = pageContent.os_rows.map(r => `
              <tr>
                <th scope="row">${esc(r.name)}</th>
                <td>${esc(r.sys)}</td>
                <td><span class="badge ${r.statusType === 'pending' ? 'badge-pending' : 'badge-live'}">${esc(r.status)}</span></td>
                <td>${esc(r.way)}</td>
              </tr>
            `).join('');
          }
        }
        if (pageContent.os_note) {
          const noteEl = osSec.querySelector(':scope > p');
          if (noteEl) noteEl.textContent = pageContent.os_note;
        }
      }

      const warSec = document.getElementById('warranty');
      if (warSec) {
        safeSetText('#warranty-heading', pageContent.warranty_heading);
        safeSetTextIn(warSec, '.section-header p', pageContent.warranty_desc);
        if (Array.isArray(pageContent.warranty_cards)) {
          const grid = warSec.querySelector('.grid-3');
          if (grid) {
            grid.innerHTML = pageContent.warranty_cards.map(c => {
              let descText = esc(c.desc);
              if (pageContent.service_email && c.desc && c.desc.includes('@')) {
                descText = descText.replace(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g, esc(pageContent.service_email));
              }
              return `
                <div class="card">
                  <span class="badge ${c.badgeType === 'subtle' ? 'badge-subtle' : (c.badgeType === 'pending' ? 'badge-pending' : 'badge-live')}" style="margin-bottom: 12px;">${esc(c.badge)}</span>
                  <h3 class="card-title" style="font-size: 1.15rem;">${esc(c.title)}</h3>
                  <p class="card-desc">${descText}</p>
                </div>
              `;
            }).join('');
          }
        }
      }

      // 同步服务热线与售后邮箱
      if (pageContent.service_email) {
        document.querySelectorAll('a[href^="mailto:support"]').forEach(a => {
          a.href = `mailto:${pageContent.service_email}`;
          a.textContent = pageContent.service_email;
        });
      }

      const compSec = document.getElementById('compatibility');
      if (compSec) {
        safeSetText('#compat-heading', pageContent.compat_heading);
        safeSetTextIn(compSec, '.section-header p', pageContent.compat_desc);
        if (Array.isArray(pageContent.compat_rows)) {
          const tbody = compSec.querySelector('tbody');
          if (tbody) {
            tbody.innerHTML = pageContent.compat_rows.map(r => `
              <tr class="accessory-table-row">
                <th scope="row">${esc(r.cat)}</th>
                <td><span class="badge ${r.levelType === 'pending' ? 'badge-pending' : 'badge-live'}">${esc(r.level)}</span></td>
                <td>${esc(r.tip)}</td>
              </tr>
            `).join('');
          }
        }
      }

      const faqSec = document.getElementById('faq');
      if (faqSec) {
        safeSetTextIn(faqSec, '.eyebrow', pageContent.faq_eyebrow);
        safeSetText('#faq-heading', pageContent.faq_heading);
        safeSetTextIn(faqSec, '.section-header p', pageContent.faq_desc);
        if (Array.isArray(pageContent.faq_list)) {
          const faqList = faqSec.querySelector('.faq-list');
          if (faqList) {
            faqList.innerHTML = pageContent.faq_list.map((f, idx) => `
              <details class="faq-item"${idx === 0 ? ' open' : ''}>
                <summary class="faq-question">
                  <span>${esc(f.q)}</span>
                  <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </summary>
                <div class="faq-answer">${esc(f.a)}</div>
              </details>
            `).join('');
          }
        }
      }
    }

    // 6.7 购买渠道 (channels.html)
    else if (pageKey === 'channels') {
      safeSetText('.subpage-banner-eyebrow', pageContent.banner_eyebrow);
      safeSetText('#channels-title', pageContent.page_title);
      safeSetText('.subpage-banner-desc', pageContent.page_desc);

      if (Array.isArray(pageContent.channel_cards)) {
        const grid = document.querySelector('section[aria-label="购买渠道矩阵"] .grid-3');
        syncDynamicCardGrid(grid, pageContent.channel_cards, (cardEl, c) => {
          const b = cardEl.querySelector('.badge');
          if (b && c.badge) {
            b.textContent = c.badge;
            b.className = `badge ${c.badgeType === 'pending' ? 'badge-pending' : (c.badgeType === 'subtle' ? 'badge-subtle' : 'badge-live')}`;
          }
          if (c.title) cardEl.querySelector('.card-title').textContent = c.title;
          if (c.desc) cardEl.querySelector('.card-desc').textContent = c.desc;
        }, ':scope > article.card');
      }

      const polSec = document.querySelector('section[aria-labelledby="policy-heading"]');
      if (polSec) {
        safeSetText('#policy-heading', pageContent.policy_heading);
        safeSetTextIn(polSec, '.section-header p', pageContent.policy_desc);
        if (Array.isArray(pageContent.policy_rows)) {
          const tbody = polSec.querySelector('tbody');
          if (tbody) {
            tbody.innerHTML = pageContent.policy_rows.map(r => `
              <tr>
                <th scope="row">${esc(r.label)}</th>
                <td>${esc(r.val)}</td>
              </tr>
            `).join('');
          }
        }
      }

      const formSec = document.getElementById('inquiry-form');
      if (formSec) {
        safeSetTextIn(formSec, '.eyebrow', pageContent.form_eyebrow);
        safeSetText('#form-heading', pageContent.form_heading);
        safeSetTextIn(formSec, '.section-header p', pageContent.form_desc);
      }
    }

    // 6.8 合作代理 (partners.html)
    else if (pageKey === 'partners') {
      safeSetText('.subpage-banner-eyebrow', pageContent.banner_eyebrow);
      safeSetText('#partners-title', pageContent.page_title);
      safeSetText('.subpage-banner-desc', pageContent.page_desc);

      if (Array.isArray(pageContent.partner_directions)) {
        const dirGrid = document.querySelector('section[aria-label="合作代理主要内容"] > .container > .grid-3');
        syncDynamicCardGrid(dirGrid, pageContent.partner_directions, (cardEl, d) => {
          if (d.title) cardEl.querySelector('.card-title').textContent = d.title;
          if (d.desc) cardEl.querySelector('.card-desc').textContent = d.desc;
        }, ':scope > .card');
      }

      const suppSec = document.querySelector('section[aria-labelledby="support-offerings"]');
      if (suppSec) {
        safeSetTextIn(suppSec, '.eyebrow', pageContent.support_eyebrow);
        safeSetText('#support-offerings', pageContent.support_offerings);
        safeSetTextIn(suppSec, '.section-header p', pageContent.support_desc);
        if (Array.isArray(pageContent.support_cards)) {
          syncDynamicCardGrid(suppSec.querySelector('.grid-3'), pageContent.support_cards, (cardEl, c) => {
            if (c.title) cardEl.querySelector('.card-title').textContent = c.title;
            if (c.desc) cardEl.querySelector('.card-desc').textContent = c.desc;
          }, ':scope > .card');
        }
      }

      const stepsSec = document.querySelector('section[aria-labelledby="steps-title"]');
      if (stepsSec) {
        safeSetTextIn(stepsSec, '.eyebrow', pageContent.steps_eyebrow);
        safeSetText('#steps-title', pageContent.steps_title);
        safeSetTextIn(stepsSec, '.section-header p', pageContent.steps_desc);
        if (Array.isArray(pageContent.steps_list)) {
          syncDynamicCardGrid(stepsSec.querySelector('.grid-4'), pageContent.steps_list, (cardEl, s) => {
            const stepNum = cardEl.querySelector('div[style*="font-mono"]');
            if (stepNum && s.step) stepNum.textContent = s.step;
            if (s.title) cardEl.querySelector('.card-title').textContent = s.title;
            if (s.desc) cardEl.querySelector('.card-desc').textContent = s.desc;
          }, ':scope > .card');
        }
      }

      const applySec = document.getElementById('partner-form');
      if (applySec) {
        safeSetTextIn(applySec, '.eyebrow', pageContent.apply_eyebrow);
        safeSetText('#apply-heading', pageContent.apply_heading);
        safeSetTextIn(applySec, '.section-header p', pageContent.apply_desc);
      }
    }

    // 6.9 关于我们 (about.html)
    else if (pageKey === 'about') {
      safeSetText('.subpage-banner-eyebrow', pageContent.banner_eyebrow);
      safeSetText('#about-title', pageContent.page_title);
      safeSetText('.subpage-banner-desc', pageContent.page_desc);

      const introCard = document.getElementById('about-intro-card');
      if (introCard) {
        safeSetTextIn(introCard, '.badge', pageContent.intro_badge);
        safeSetTextIn(introCard, 'h2', pageContent.intro_quote);
        safeSetText('#about-intro-p1', pageContent.intro_p1);
        safeSetText('#about-intro-p2', pageContent.intro_p2);
        safeSetText('#about-global-title', pageContent.global_title);
        safeSetText('#about-dom-tag', pageContent.global_domestic_tag);
        safeSetText('#about-dom-name', pageContent.global_domestic_name);
        safeSetText('#about-dom-desc', pageContent.global_domestic_desc);
        safeSetText('#about-ovs-tag', pageContent.global_overseas_tag);
        safeSetText('#about-ovs-name', pageContent.global_overseas_name);
        safeSetText('#about-ovs-desc', pageContent.global_overseas_desc);
      }

      const tlSec = document.querySelector('section[aria-labelledby="timeline-title"]');
      if (tlSec) {
        safeSetTextIn(tlSec, '.eyebrow', pageContent.timeline_eyebrow);
        safeSetText('#timeline-title', pageContent.timeline_title);
        safeSetTextIn(tlSec, '.section-header p', pageContent.timeline_desc);
        if (Array.isArray(pageContent.timeline_list)) {
          const tl = tlSec.querySelector('.timeline');
          if (tl) {
            tl.innerHTML = pageContent.timeline_list.map(t => `
              <div class="timeline-item">
                <div class="timeline-year">${esc(t.year)}</div>
                <div class="timeline-content">${esc(t.content)}</div>
              </div>
            `).join('');
          }
        }
      }

      const strSec = document.querySelector('section[aria-labelledby="strengths-title"]');
      if (strSec) {
        safeSetTextIn(strSec, '.eyebrow', pageContent.strengths_eyebrow);
        safeSetText('#strengths-title', pageContent.strengths_title);
        safeSetTextIn(strSec, '.section-header p', pageContent.strengths_desc);
        if (Array.isArray(pageContent.strengths_list)) {
          syncDynamicCardGrid(strSec.querySelector('.grid-4'), pageContent.strengths_list, (cardEl, s) => {
            if (s.title) cardEl.querySelector('.card-title').textContent = s.title;
            if (s.desc) cardEl.querySelector('.card-desc').textContent = s.desc;
          }, ':scope > .card');
        }
      }

      const culSec = document.querySelector('section[aria-labelledby="culture-title"]');
      if (culSec) {
        safeSetTextIn(culSec, '.eyebrow', pageContent.culture_eyebrow);
        safeSetText('#culture-title', pageContent.culture_title);
        safeSetTextIn(culSec, '.section-header p', pageContent.culture_desc);
        if (Array.isArray(pageContent.culture_list)) {
          syncDynamicCardGrid(culSec.querySelector('.grid-4'), pageContent.culture_list, (cardEl, c) => {
            if (c.tag) cardEl.querySelector('.badge').textContent = c.tag;
            if (c.title) cardEl.querySelector('.card-title').textContent = c.title;
            if (c.desc) cardEl.querySelector('.card-desc').textContent = c.desc;
          }, ':scope > .card');
        }
      }

      const visSec = document.querySelector('section[aria-labelledby="vision-title"]');
      if (visSec) {
        safeSetText('#about-role-title', pageContent.role_title);
        safeSetText('#about-vision-title', pageContent.vision_title);
        if (Array.isArray(pageContent.role_list)) {
          const ul = document.getElementById('about-role-list');
          if (ul) {
            ul.innerHTML = pageContent.role_list.map(r => `
              <li style="display: flex; gap: 10px; align-items: flex-start;">
                <span style="color: var(--brand-primary); font-weight: 700;">•</span>
                <span><strong>${esc(r.title)}</strong>：${esc(r.desc)}</span>
              </li>
            `).join('');
          }
        }
        if (Array.isArray(pageContent.vision_list)) {
          const ul = document.getElementById('about-vision-list');
          if (ul) {
            ul.innerHTML = pageContent.vision_list.map(v => `
              <li style="display: flex; gap: 10px; align-items: flex-start;">
                <span style="color: var(--brand-cyan); font-weight: 700;">•</span>
                <span><strong>${esc(v.title)}</strong>：${esc(v.desc)}</span>
              </li>
            `).join('');
          }
        }
      }

      const certSec = document.querySelector('section[aria-labelledby="certs-heading"]');
      if (certSec) {
        safeSetTextIn(certSec, '.eyebrow', pageContent.certs_eyebrow);
        safeSetText('#certs-heading', pageContent.certs_heading);
        safeSetTextIn(certSec, '.section-header p', pageContent.certs_desc);
        const grid = document.getElementById('about-certs-grid');
        if (grid && Array.isArray(pageContent.certs_list)) {
          grid.innerHTML = pageContent.certs_list.map(c => {
            const imgSrc = resolvePreferredImg(pageContent[c.imgKey], c.defaultSrc, imagesMap);
            return `
              <div class="card" style="padding: 18px; display: flex; flex-direction: column; gap: 10px;">
                <div style="height: 180px; border-radius: 10px; overflow: hidden; background: #f5f5f7; border: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center;">
                  <img src="${esc(imgSrc)}" alt="${esc(c.title)}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                </div>
                <div>
                  <h3 class="card-title" style="font-size: 1.05rem; margin-bottom: 4px;">${esc(c.title)}</h3>
                  <p class="card-desc" style="font-size: 0.85rem; margin-bottom: 10px;">${esc(c.desc)}</p>
                </div>
                <button type="button" class="btn btn-secondary btn-sm" data-cert-target="cert-dialog" data-cert-src="${esc(imgSrc)}" data-cert-title="${esc(c.title)}">查看大图</button>
              </div>
            `;
          }).join('');
        }
      }
    }

    // 6.10 联系我们 (contact.html)
    else if (pageKey === 'contact') {
      safeSetText('.subpage-banner-eyebrow', pageContent.banner_eyebrow);
      safeSetText('#contact-title', pageContent.page_title);
      safeSetText('.subpage-banner-desc', pageContent.page_desc);

      safeSetText('#contact-hq-title', pageContent.hq_title);
      safeSetText('#contact-company-name', pageContent.company_name);
      safeSetText('#contact-brand-naming', pageContent.brand_naming);
      safeSetText('#contact-hq-address', pageContent.hq_address);
      safeSetText('#contact-service-hours', pageContent.service_hours);
      safeSetText('#contact-quick-title', pageContent.quick_support_title);
      safeSetText('#contact-quick-desc', pageContent.quick_support_desc);

      safeSetText('#contact-form-title', pageContent.form_title);
      safeSetText('#contact-form-desc', pageContent.form_desc);

      const deptSec = document.querySelector('section[aria-labelledby="dept-table-heading"]');
      if (deptSec) {
        safeSetTextIn(deptSec, '.eyebrow', pageContent.dept_eyebrow);
        safeSetText('#dept-table-heading', pageContent.dept_table_heading);
        safeSetTextIn(deptSec, '.section-header p', pageContent.dept_table_desc);
        if (Array.isArray(pageContent.dept_rows)) {
          const tbody = deptSec.querySelector('tbody');
          if (tbody) {
            tbody.innerHTML = pageContent.dept_rows.map(r => `
              <tr>
                <th scope="row">${esc(r.line)}</th>
                <td>${esc(r.dept)}</td>
                <td>${esc(r.hours)}</td>
                <td><a href="mailto:${esc(r.email)}" style="color: var(--brand-primary); font-family: var(--font-mono);">${esc(r.email)}</a></td>
              </tr>
            `).join('');
          }
        }
      }
    }
  }

  function setSlideContent(slideSel, cfg) {
    const slide = document.querySelector(slideSel);
    if (!slide) return;
    setTagTextKeepingDot(slide.querySelector('.eyebrow'), cfg.badge);
    safeSetTextIn(slide, '.hero-title', cfg.title);
    safeSetTextIn(slide, '.hero-subtitle', cfg.sub);
    const a1 = slide.querySelector('.hero-actions a:first-child');
    if (a1) {
      if (cfg.btn1) a1.textContent = cfg.btn1;
      if (cfg.btn1Href) a1.setAttribute('href', cfg.btn1Href);
    }
    const a2 = slide.querySelector('.hero-actions a:last-child');
    if (a2) {
      if (cfg.btn2) a2.textContent = cfg.btn2;
      if (cfg.btn2Href) a2.setAttribute('href', cfg.btn2Href);
    }
    const bl = slide.querySelector('.badge-left span:last-child');
    if (bl && cfg.badgeLeft) bl.textContent = cfg.badgeLeft;
    const br = slide.querySelector('.badge-right span');
    if (br && cfg.badgeRight) br.textContent = cfg.badgeRight;
    if (cfg.image) {
      const card = slide.querySelector('.hero-banner-card');
      if (card) card.style.backgroundImage = `url("${cfg.image}")`;
    }
  }

  function safeSetText(selector, text) {
    if (text === undefined || text === null || text === '') return;
    document.querySelectorAll(selector).forEach(el => { el.textContent = text; });
  }

  function safeSetTextIn(root, selector, text) {
    if (!root || text === undefined || text === null || text === '') return;
    const el = root.querySelector(selector);
    if (el) el.textContent = text;
  }

  // 7. 监听与拦截前台预约/合作表单：同时实时提交至服务器并本地兜底保存
  function hookLeadSubmission() {
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form && form.tagName === 'FORM') {
        handleFormLead(form);
      }
    });
  }

  function postRecordToServer(endpoint, record) {
    if (window.location.protocol === 'file:') return;
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    }).catch(() => {
      // 静态托管无后端时静默降级
    });
  }

  function handleFormLead(form) {
    try {
      const pageKey = detectCurrentPage();

      // 合作代理表单 (partners.html) -> 写入服务器 & LUCK_SITE_PARTNERSHIPS_DATA
      if (pageKey === 'partners') {
        const company = form.querySelector('#partner-company, input[name="company"]')?.value.trim() || '';
        const contactVal = form.querySelector('#partner-contact, input[name="contact"]')?.value.trim() || '';
        const typeSelect = form.querySelector('#partner-type, select[name="type"]');
        const channelType = typeSelect && typeSelect.selectedIndex >= 0
          ? typeSelect.options[typeSelect.selectedIndex].textContent.trim()
          : '商业合作咨询';
        const scale = form.querySelector('#partner-scale, input[name="scale"]')?.value.trim() || '-';
        const notes = form.querySelector('#partner-notes, textarea[name="notes"]')?.value.trim() || '';

        if (!company && !contactVal) return;

        const isEmail = contactVal.includes('@');
        const newPartner = {
          id: 'BIZ-' + Date.now().toString().slice(-6),
          company: company || '合作意向单位',
          contact: company || '负责人',
          phone: isEmail ? '-' : (contactVal || '-'),
          email: isEmail ? contactVal : '-',
          channelType: channelType,
          region: scale,
          expectedVolume: '待商务沟通',
          date: new Date().toLocaleString('zh-CN', { hour12: false }),
          status: '待跟进',
          notes: notes || '来自官网合作代理在线申请表单'
        };

        postRecordToServer('/api/partners', newPartner);
        try {
          const defaultPartners = (window.LUCK_SITE_DEFAULT_DATA && window.LUCK_SITE_DEFAULT_DATA.partnerships) || [];
          const existing = JSON.parse(localStorage.getItem('LUCK_SITE_PARTNERSHIPS_DATA') || JSON.stringify(defaultPartners));
          existing.unshift(newPartner);
          localStorage.setItem('LUCK_SITE_PARTNERSHIPS_DATA', JSON.stringify(existing));
        } catch (err) {}
        return;
      }

      // 客户线索表单 (contact.html / channels.html) -> 写入服务器 & LUCK_SITE_LEADS_DATA
      const nameInput = form.querySelector('input[name="name"], #contact-name, #msg-name');
      const contactInput = form.querySelector('input[name="contact"]');
      const phoneInput = form.querySelector('input[name="phone"], #msg-phone');
      const emailInput = form.querySelector('input[name="email"], #msg-email');
      const typeSelect = form.querySelector('select[name="type"], select[name="category"], #consult-type, #msg-category');
      const msgInput = form.querySelector('textarea, #contact-message, #msg-content, #consult-message');

      const name = nameInput ? nameInput.value.trim() : '';
      let phone = phoneInput ? phoneInput.value.trim() : '';
      let email = emailInput ? emailInput.value.trim() : '';
      if (contactInput) {
        const cv = contactInput.value.trim();
        if (cv.includes('@') && !email) email = cv;
        else if (!phone && cv) phone = cv;
      }
      const notes = msgInput ? msgInput.value.trim() : '';
      const categoryText = (typeSelect && typeSelect.selectedIndex >= 0) ? typeSelect.options[typeSelect.selectedIndex].textContent.trim() : '';

      if (!name && !phone && !email) return;

      const urlParams = new URLSearchParams(window.location.search);
      const prodParam = urlParams.get('product');
      const newLead = {
        id: 'LEAD-' + Date.now().toString().slice(-6),
        name: name || '官网访客',
        phone: phone || '-',
        email: email || '-',
        product: prodParam || categoryText || (document.title.includes('Lucky Mini') ? 'Lucky Mini 旗舰' : '官网咨询'),
        date: new Date().toLocaleString('zh-CN', { hour12: false }),
        status: '待联系',
        notes: notes || '来自官网前台在线表单提交'
      };

      postRecordToServer('/api/leads', newLead);
      try {
        const defaultLeads = (window.LUCK_SITE_DEFAULT_DATA && window.LUCK_SITE_DEFAULT_DATA.leads) || [];
        const existingLeads = JSON.parse(localStorage.getItem('LUCK_SITE_LEADS_DATA') || JSON.stringify(defaultLeads));
        existingLeads.unshift(newLead);
        localStorage.setItem('LUCK_SITE_LEADS_DATA', JSON.stringify(existingLeads));
      } catch (err) {}
    } catch (err) {
      console.warn('[CMS Bridge] 收集线索异常', err);
    }
  }

  function renderAllFromData(data, pageKey) {
    window.LUCK_CMS_DATA = data;
    applySEO(data, pageKey);
    applyImageOverrides(data);
    applyContent(data, pageKey);
    applyTextReplacements(data);
    window.dispatchEvent(new CustomEvent('luck:cms-updated', { detail: data }));
  }

  // 8. 页面加载即执行：先同步应用静态快照，再静默向服务端拉取最新状态防缓存
  window.LUCK_GET_MERGED_DATA = getMergedData;
  document.addEventListener('DOMContentLoaded', async () => {
    const pageKey = detectCurrentPage();
    const initialData = getMergedData();
    renderAllFromData(initialData, pageKey);
    hookLeadSubmission();

    if (window.location.protocol !== 'file:') {
      try {
        const resp = await fetch('/api/site-data?t=' + Date.now(), { cache: 'no-store' });
        if (resp.ok) {
          const json = await resp.json();
          if (json && json.success) {
            hasServerResponse = true;
            if (json.exists && json.data) {
              serverLiveSiteData = json.data;
              const freshData = getMergedData();
              renderAllFromData(freshData, pageKey);
            }
          }
        }
      } catch (e) {
        // 纯静态托管时自动降级，保持静默
      }
    }
  });
})();
