/**
 * 幸运无限 (Lucky Infinite) 官网交互脚本
 * 遵循现代 Web 规范及 WCAG 无障碍标准 (Apple 极简风格适配)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeroCarousel();
  initLuckyKeySimulator();
  initAccessorySearch();
  initFormInteractions();
  initCertModal();
  initSeriesNav();
  initProductDetailModal();
});

/**
 * 移动端菜单与无障碍焦点管理
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!toggleBtn || !navMenu) return;

  function closeMenu() {
    navMenu.classList.remove('open');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', '打开导航菜单');
    document.body.classList.remove('nav-open');
  }

  function openMenu() {
    navMenu.classList.add('open');
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', '关闭导航菜单');
    document.body.classList.add('nav-open');
  }

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // 按 ESC 键关闭菜单
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
      toggleBtn.focus();
    }
  });

  // 点击菜单项或行动按钮后关闭
  navMenu.querySelectorAll('.nav-link, .mobile-menu-cta a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMenu();
      }
    });
  });
}

/**
 * Apple 风格 Hero 首页大型可切换轮播 Banner
 * 支持：左右按钮、底部胶囊指示条、自动播放/暂停、键盘左右键、移动端触控滑动
 */
function initHeroCarousel() {
  const carousel = document.getElementById('hero-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.hero-slide');
  const indicators = carousel.querySelectorAll('.indicator-pill');
  const prevBtn = document.getElementById('carousel-prev-btn');
  const nextBtn = document.getElementById('carousel-next-btn');
  const playToggle = document.getElementById('carousel-play-toggle');

  if (!slides.length) return;

  let currentIndex = 0;
  let isPlaying = true;
  let autoTimer = null;
  const INTERVAL = 5500;

  function showSlide(index) {
    // 移除旧的状态
    slides[currentIndex].classList.remove('active');
    if (indicators[currentIndex]) {
      indicators[currentIndex].classList.remove('active');
      indicators[currentIndex].setAttribute('aria-selected', 'false');
    }

    // 计算新的索引
    currentIndex = (index + slides.length) % slides.length;

    // 激活新的幻灯片
    slides[currentIndex].classList.add('active');
    if (indicators[currentIndex]) {
      indicators[currentIndex].classList.add('active');
      indicators[currentIndex].setAttribute('aria-selected', 'true');
    }
  }

  function next() {
    showSlide(currentIndex + 1);
  }

  function prev() {
    showSlide(currentIndex - 1);
  }

  function startAuto() {
    if (!autoTimer) {
      autoTimer = setInterval(next, INTERVAL);
    }
    isPlaying = true;
    if (playToggle) {
      const playIcon = playToggle.querySelector('.play-icon');
      const pauseIcon = playToggle.querySelector('.pause-icon');
      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'block';
      playToggle.setAttribute('aria-label', '暂停自动轮播');
    }
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
    isPlaying = false;
    if (playToggle) {
      const playIcon = playToggle.querySelector('.play-icon');
      const pauseIcon = playToggle.querySelector('.pause-icon');
      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      playToggle.setAttribute('aria-label', '开始自动轮播');
    }
  }

  function userInteract() {
    if (isPlaying) {
      stopAuto();
      startAuto();
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      next();
      userInteract();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prev();
      userInteract();
    });
  }

  indicators.forEach(pill => {
    pill.addEventListener('click', () => {
      const target = parseInt(pill.getAttribute('data-slide'), 10);
      showSlide(target);
      userInteract();
    });
  });

  if (playToggle) {
    playToggle.addEventListener('click', () => {
      if (isPlaying) {
        stopAuto();
      } else {
        startAuto();
      }
    });
  }

  // 鼠标悬停时暂停播放
  carousel.addEventListener('mouseenter', () => {
    if (isPlaying && autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  });

  carousel.addEventListener('mouseleave', () => {
    if (isPlaying && !autoTimer) {
      autoTimer = setInterval(next, INTERVAL);
    }
  });

  // 键盘左右箭头支持
  document.addEventListener('keydown', (e) => {
    if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (e.key === 'ArrowRight') {
      next();
      userInteract();
    } else if (e.key === 'ArrowLeft') {
      prev();
      userInteract();
    }
  });

  // 移动端左右手势触控滑动 (Swipe)
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff < 0) {
        next(); // 向左滑 -> 下一张
      } else {
        prev(); // 向右滑 -> 上一张
      }
      userInteract();
    }
  }, { passive: true });

  // 启动自动播放
  startAuto();
}

/**
 * Lucky 键互动仿真器 (Apple 风格交互展台)
 */
function initLuckyKeySimulator() {
  const physicalKey = document.querySelector('.physical-lucky-key');
  const guideSteps = document.querySelectorAll('.guide-step');
  const screenTitle = document.querySelector('.screen-title');
  const screenPrompt = document.querySelector('.screen-prompt');
  const pulseOrb = document.querySelector('.ai-pulse-orb');

  if (!physicalKey || !screenTitle) return;

  const modes = [
    {
      title: "Lucky 实体键已按下",
      prompt: "硬件直达 · 免去解锁翻找应用",
      color: "#0071e3"
    },
    {
      title: "AI 智能对话已唤醒",
      prompt: "正在倾听您的提问与灵感...",
      color: "#34c759"
    },
    {
      title: "AI 拍照 · 拍学 · 忘物提醒",
      prompt: "双击抓拍识别：随身物品已确认无误",
      color: "#ff9500"
    },
    {
      title: "分享幸运瞬间",
      prompt: "生成的趣味卡片已同步至 Lucky OS",
      color: "#0071e3"
    }
  ];

  let currentStep = 0;

  function updateSimulator(index) {
    currentStep = index;
    guideSteps.forEach((step, i) => {
      step.classList.toggle('active', i === index);
    });

    const data = modes[index];
    screenTitle.textContent = data.title;
    screenPrompt.textContent = data.prompt;

    if (pulseOrb) {
      pulseOrb.style.boxShadow = `0 0 30px ${data.color}`;
    }

    // 硬件物理按键反馈
    physicalKey.classList.add('pressed');
    setTimeout(() => {
      physicalKey.classList.remove('pressed');
    }, 180);
  }

  // 点击硬件按键轮播
  physicalKey.addEventListener('click', () => {
    const nextIndex = (currentStep + 1) % modes.length;
    updateSimulator(nextIndex);
  });

  // 点击步骤直接切换
  guideSteps.forEach((step, idx) => {
    step.addEventListener('click', () => {
      updateSimulator(idx);
    });
  });
}

/**
 * 服务支持页：配件适配筛选工具
 */
function initAccessorySearch() {
  const searchInput = document.getElementById('accessory-search');
  const tableRows = document.querySelectorAll('.accessory-table-row');

  if (!searchInput || tableRows.length === 0) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();

    tableRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      if (text.includes(query)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
}

/**
 * 表单校验与提交交互反馈
 */
function initFormInteractions() {
  const forms = document.querySelectorAll('form[data-ajax-form]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = '正在提交...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = '提交成功';
        submitBtn.classList.add('btn-primary');

        alert('感谢您的留言与垂询！幸运无限商务/服务团队将在 1 个工作日内与您取得联系。');
        form.reset();

        setTimeout(() => {
          submitBtn.textContent = originalText;
        }, 3000);
      }, 600);
    });
  });
}

/**
 * 企业资质预览模态框（原生 dialog）
 */
function initCertModal() {
  const certTriggers = document.querySelectorAll('[data-cert-target]');
  const dialog = document.getElementById('cert-dialog');
  const dialogImg = document.getElementById('dialog-cert-img');
  const dialogTitle = document.getElementById('dialog-cert-title');
  const closeBtn = document.querySelector('.dialog-close');

  if (!dialog || certTriggers.length === 0) return;

  certTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = btn.getAttribute('data-cert-src');
      const title = btn.getAttribute('data-cert-title');

      if (dialogImg && imgSrc) dialogImg.src = imgSrc;
      if (dialogTitle && title) dialogTitle.textContent = title;

      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
    });
  }

  // 点击背景遮罩关闭
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.close();
    }
  });
}

/**
 * 产品中心系列分类子导航交互
 */
function initSeriesNav() {
  const seriesBtns = document.querySelectorAll('.series-nav-btn');
  const sections = document.querySelectorAll('.series-section');
  if (!seriesBtns.length || !sections.length) return;

  seriesBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = btn.getAttribute('data-filter');

      seriesBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (filter === 'all') {
        sections.forEach(sec => {
          sec.style.display = 'block';
        });
      } else {
        sections.forEach(sec => {
          if (sec.getAttribute('data-series') === filter) {
            sec.style.display = 'block';
          } else {
            sec.style.display = 'none';
          }
        });
      }

      // 平滑滚动定位到当前选中的系列
      const activeSection = filter === 'all' ? sections[0] : document.querySelector(`.series-section[data-series="${filter}"]`);
      if (activeSection) {
        const topOffset = activeSection.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: topOffset, behavior: 'smooth' });
      }
    });
  });
}

/**
 * 产品中心 - 产品详情视窗 (Product Detail Modal)
 * 移动端全屏 (100vw x 100vh)，PC端严格显示 2/3 的屏 (66.666vw)
 * 支持上传商品详情长图/切片图、即时本地渲染与全站持久化保存
 */
function initProductDetailModal() {
  const modal = document.getElementById('product-detail-modal');
  if (!modal) return;

  const modalBackdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close-btn');
  const detailImgsContainer = document.getElementById('modal-detail-images-container');
  const fileInput = document.getElementById('product-img-upload-input');
  const resetBtn = document.getElementById('btn-reset-image');

  const tagEl = document.getElementById('modal-p-tag');
  const titleEl = document.getElementById('modal-p-title');
  const subEl = document.getElementById('modal-p-sub');
  const descEl = document.getElementById('modal-p-desc');
  const extraDescWrap = document.getElementById('modal-detail-extra-desc-wrap');
  const extraDescEl = document.getElementById('modal-p-extra-desc');
  const specsEl = document.getElementById('modal-p-specs');
  const priceEl = document.getElementById('modal-p-price');
  const priceSubEl = document.getElementById('modal-p-price-sub');
  const buyLinkEl = document.getElementById('modal-buy-link');
  const detailLinkEl = document.getElementById('modal-detail-link');
  const actionLinkEl = document.getElementById('modal-action-link');

  // 获取合并后的全站数据 (含后台 CMS 编辑并保存的产品列表)
  function getLiveProductsMap() {
    let items = [];
    try {
      const savedDataStr = localStorage.getItem('LUCK_SITE_CONTENT_DATA');
      if (savedDataStr) {
        const saved = JSON.parse(savedDataStr);
        if (saved.content && saved.content.products && Array.isArray(saved.content.products.items)) {
          items = saved.content.products.items;
        }
      }
    } catch (e) {
      console.warn('读取本地产品数据失败', e);
    }

    if (items.length === 0 && window.LUCK_SITE_DEFAULT_DATA &&
        window.LUCK_SITE_DEFAULT_DATA.content &&
        window.LUCK_SITE_DEFAULT_DATA.content.products &&
        Array.isArray(window.LUCK_SITE_DEFAULT_DATA.content.products.items)) {
      items = window.LUCK_SITE_DEFAULT_DATA.content.products.items;
    }

    const map = {};
    items.forEach(it => {
      map[it.id] = it;
    });

    // 默认垫底数据保证
    const fallbackIds = ['lucky-mini', 'lucky-tab-8', 'lucky-tab-10', 'lucky-paracord', 'lucky-charge', 'lucky-mag'];
    fallbackIds.forEach(id => {
      if (!map[id]) {
        map[id] = {
          id: id,
          title: id,
          series: 'accessories',
          subtitle: '',
          desc: '',
          price: '敬请期待',
          detailImages: ['images/showcase_lucky_mini.jpg'],
          specs: []
        };
      }
    });

    return map;
  }

  let currentProductId = null;

  function renderDetailImages(p) {
    if (!detailImgsContainer) return;
    let images = [];

    // 1. 优先读取单独上传的自定义详情图集
    try {
      const customDetailJson = localStorage.getItem('luck_custom_detail_images_' + p.id);
      if (customDetailJson) {
        images = JSON.parse(customDetailJson);
      }
    } catch (e) {}

    // 2. 若无单独上传，读取产品数据中的 detailImages
    if ((!images || images.length === 0) && p.detailImages && Array.isArray(p.detailImages) && p.detailImages.length > 0) {
      images = p.detailImages;
    }

    // 3. 兜底为产品主图
    if (!images || images.length === 0) {
      images = [p.image || p.defaultImg || 'images/showcase_lucky_mini.jpg'];
    }

    detailImgsContainer.innerHTML = images.map((imgSrc, idx) => `
      <div class="modal-detail-img-card">
        <img src="${imgSrc}" alt="${p.title} 商品详情图 第 ${idx + 1} 屏" loading="lazy">
      </div>
    `).join('');

    // 控制恢复默认按钮状态
    const hasCustom = localStorage.getItem('luck_custom_detail_images_' + p.id) !== null;
    if (resetBtn) {
      resetBtn.style.display = hasCustom ? 'inline-flex' : 'none';
    }
  }

  function openModal(productId) {
    const productsMap = getLiveProductsMap();
    const p = productsMap[productId] || productsMap['lucky-mini'];
    currentProductId = p.id;

    if (tagEl) tagEl.textContent = p.seriesLabel || (p.series === 'phone' ? '旗舰小机系列 · 01' : (p.series === 'tablet' ? '随身平板系列 · 02' : '精工配件系列 · 03'));
    if (titleEl) titleEl.textContent = p.title || '';
    if (subEl) subEl.textContent = p.subtitle || '';
    if (descEl) descEl.textContent = p.desc || '';
    if (priceEl) priceEl.textContent = p.price || '';
    if (priceSubEl) priceSubEl.textContent = p.priceSub || '';

    // 详情补充文字
    if (extraDescWrap && extraDescEl) {
      if (p.detailDesc && p.detailDesc.trim() !== '') {
        extraDescEl.textContent = p.detailDesc;
        extraDescWrap.style.display = 'block';
      } else {
        extraDescWrap.style.display = 'none';
      }
    }

    // 购买跳转链接
    if (buyLinkEl) {
      if (p.buyUrl && p.buyUrl.trim() !== '') {
        buyLinkEl.href = p.buyUrl;
        buyLinkEl.textContent = `${p.buyText || '立即购买'} ↗`;
        if (/^https?:\/\//i.test(p.buyUrl)) {
          buyLinkEl.setAttribute('target', '_blank');
          buyLinkEl.setAttribute('rel', 'noopener noreferrer');
        } else {
          buyLinkEl.removeAttribute('target');
          buyLinkEl.removeAttribute('rel');
        }
        buyLinkEl.style.display = 'inline-flex';
      } else {
        buyLinkEl.style.display = 'none';
      }
    }

    // 详细了解外链
    if (detailLinkEl) {
      if (p.id === 'lucky-mini') {
        detailLinkEl.href = 'lucky-mini.html';
        detailLinkEl.style.display = 'inline-flex';
      } else {
        detailLinkEl.style.display = 'none';
      }
    }

    // 规格参数渲染
    if (specsEl) {
      const specs = p.specs || [];
      if (specs.length > 0) {
        specsEl.innerHTML = specs.map(s => `
          <li class="modal-specs-item">
            <strong>${s.label}</strong>
            <span>${s.val}</span>
          </li>
        `).join('');
      } else {
        specsEl.innerHTML = `
          <li class="modal-specs-item"><strong>官方品质</strong><span>工业级自研制造</span></li>
          <li class="modal-specs-item"><strong>售后保障</strong><span>正品联保全国覆盖</span></li>
        `;
      }
    }

    // 渲染商品详情长图卷轴
    renderDetailImages(p);

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // 关闭事件
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  function compressDetailImage(file, maxWidth, quality) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
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
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(evt.target.result);
        img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // 上传商品详情长图处理 (支持多选与单选，自动压缩)
  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0 || !currentProductId) return;

      let currentImages = [];
      try {
        const saved = localStorage.getItem('luck_custom_detail_images_' + currentProductId);
        if (saved) currentImages = JSON.parse(saved);
      } catch (err) {}

      for (const file of files) {
        const compressed = await compressDetailImage(file, 1100, 0.82);
        currentImages.push(compressed);
      }

      try {
        localStorage.setItem('luck_custom_detail_images_' + currentProductId, JSON.stringify(currentImages));
        const siteDataStr = localStorage.getItem('LUCK_SITE_CONTENT_DATA');
        if (siteDataStr) {
          const siteData = JSON.parse(siteDataStr);
          if (siteData.content && siteData.content.products && Array.isArray(siteData.content.products.items)) {
            const targetItem = siteData.content.products.items.find(x => x.id === currentProductId);
            if (targetItem) {
              targetItem.detailImages = currentImages;
              localStorage.setItem('LUCK_SITE_CONTENT_DATA', JSON.stringify(siteData));
            }
          }
        }
      } catch (err) {
        alert('本地存储空间不足，建议减少单次上传的图片数量。');
      }

      const productsMap = getLiveProductsMap();
      renderDetailImages(productsMap[currentProductId] || { id: currentProductId, detailImages: currentImages });
      alert(`成功上传 ${files.length} 张商品详情长图！已实时更新展示。`);
      fileInput.value = '';
    });
  }

  // 恢复官方默认详情图
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!currentProductId) return;
      localStorage.removeItem('luck_custom_detail_images_' + currentProductId);
      const productsMap = getLiveProductsMap();
      renderDetailImages(productsMap[currentProductId] || { id: currentProductId });
      if (resetBtn) resetBtn.style.display = 'none';
      alert('已恢复为官方默认商品详情长图！');
    });
  }

  // 使用事件委托绑定产品卡片触发器 (兼容动态新增的产品卡片)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-open-detail]');
    if (!btn) return;
    e.preventDefault();
    const pid = btn.getAttribute('data-open-detail') || 'lucky-mini';
    openModal(pid);
  });

  // 支持 URL 参数自动打开详情 (例如 products.html?product=lucky-tab-8)
  const urlParams = new URLSearchParams(window.location.search);
  const detailParam = urlParams.get('detail') || urlParams.get('product');
  if (detailParam) {
    setTimeout(() => openModal(detailParam), 60);
  }
}
