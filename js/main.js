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
 * 移动端全屏，PC端显示 2/3 的屏
 * 支持上传图片、即时本地渲染与持久化保存
 */
function initProductDetailModal() {
  const modal = document.getElementById('product-detail-modal');
  if (!modal) return;

  const modalBackdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close-btn');
  const previewImg = document.getElementById('modal-product-img');
  const dropzone = document.getElementById('modal-dropzone');
  const fileInput = document.getElementById('product-img-upload-input');
  const resetBtn = document.getElementById('btn-reset-image');

  const tagEl = document.getElementById('modal-p-tag');
  const titleEl = document.getElementById('modal-p-title');
  const subEl = document.getElementById('modal-p-sub');
  const descEl = document.getElementById('modal-p-desc');
  const specsEl = document.getElementById('modal-p-specs');
  const priceEl = document.getElementById('modal-p-price');
  const priceSubEl = document.getElementById('modal-p-price-sub');
  const detailLinkEl = document.getElementById('modal-detail-link');
  const actionLinkEl = document.getElementById('modal-action-link');

  const PRODUCTS_DATA = {
    'lucky-mini': {
      id: 'lucky-mini',
      title: 'Lucky Mini 3.7 英寸',
      series: '旗舰小机系列 · 01',
      subtitle: '拥有它，就拥有幸运。',
      desc: '掌心黄金尺寸的完整安卓智能小机。专属 Lucky 物理微动按键，0.2 秒一键唤醒端侧大模型。航空级 CNC 钛金精工中框，配件随手可买，单手操作从容自如。',
      defaultImg: 'images/showcase_lucky_mini.jpg',
      specs: [
        { label: '屏幕尺寸', val: '3.7" 视网膜单手小屏' },
        { label: '专属硬件', val: '0.2s 物理微动 Lucky 键' },
        { label: '工艺中框', val: 'CNC 钛金精工一体化' },
        { label: '生态兼容', val: '通用标准化壳膜生态' }
      ],
      price: '$299',
      priceSub: '约 ¥1999 / 首发前1000名优惠',
      detailUrl: 'lucky-mini.html',
      actionText: '立即预约首发'
    },
    'lucky-tab-8': {
      id: 'lucky-tab-8',
      title: 'LUCKY Tab 8.68 英寸',
      series: '随身平板系列 · 02',
      subtitle: '轻便随身，大模型伴读与轻量办公利器。',
      desc: '8.68 英寸黄金黄金阅读比例随身智能平板，配备专属实体 Lucky 键。单手舒适托持，深度适配端侧 AI 助手，阅读、批注、即时问答流畅无缝。',
      defaultImg: 'images/showcase_lucky_tab.jpg',
      specs: [
        { label: '便携屏幕', val: '8.68" 黄金阅读比例' },
        { label: 'AI 系统', val: 'Lucky OS 多端流转协同' },
        { label: '机身工艺', val: '全铝 CNC 一体成型' },
        { label: '交互按键', val: '专属物理 Lucky 键' }
      ],
      price: '敬请期待',
      priceSub: '首批产品筹备推进中',
      detailUrl: 'contact.html?type=consult#leave-message',
      actionText: '获取发布通知'
    },
    'lucky-tab-10': {
      id: 'lucky-tab-10',
      title: 'LUCKY Tab 10.1 英寸',
      series: '随身平板系列 · 02',
      subtitle: '高清大屏，全家人身边的 AI 智慧中心。',
      desc: '10.1 英寸全视高清大屏平板，学习辅导、远程办公、家庭娱乐全场景覆盖。融入硬件级防蓝光护眼屏，全家人共享 AI 智慧生活。',
      defaultImg: 'images/showcase_lucky_tab.jpg',
      specs: [
        { label: '视网膜屏', val: '10.1" 全贴合视网膜屏' },
        { label: '健康护眼', val: '硬件级防蓝光认证' },
        { label: '全场景生态', val: '家庭伴读与远程协同' },
        { label: '续航能力', val: '超长待机大容量电池' }
      ],
      price: '敬请期待',
      priceSub: '新品即将亮相',
      detailUrl: 'contact.html?type=consult#leave-message',
      actionText: '获取发布通知'
    },
    'lucky-paracord': {
      id: 'lucky-paracord',
      title: 'Lucky Paracord 机能工装挂绳',
      series: '精工配件系列 · 03',
      subtitle: '50KG 承重伞绳，钛金快拆卡扣。',
      desc: '先锋街头机能工业美学，标配 50KG 承重抗拉高分子工装伞绳与钛合金快拆扣，让数码硬件化身随身潮流挂饰，户外街头随性出街。',
      defaultImg: 'images/showcase_accessories.jpg',
      specs: [
        { label: '极限承重', val: '50KG 户外抗拉伞绳' },
        { label: '卡扣材质', val: '钛合金秒级快拆扣' },
        { label: '风格设计', val: '机能工装街头美学' },
        { label: '色彩系列', val: '多色个性编织可选' }
      ],
      price: '¥129 起',
      priceSub: '多色现货发售',
      detailUrl: 'contact.html?type=purchase',
      actionText: '了解购买渠道'
    },
    'lucky-charge': {
      id: 'lucky-charge',
      title: 'Lucky Charge 45W 氮化镓闪充',
      series: '精工配件系列 · 03',
      subtitle: '双口快充，差旅极简能量方块。',
      desc: '围绕桌面与出行充电场景量身打造，支持主流 PD/QC 快充协议。采用氮化镓高能效功率芯片，智能控温散热，小巧便携折叠插脚。',
      defaultImg: 'images/banner_lucky_charge.jpg',
      specs: [
        { label: '输出功率', val: '45W GaN 双口快充' },
        { label: '快充协议', val: 'PD 3.0 / QC 4+ 全兼容' },
        { label: '结构设计', val: '90° 折叠插脚极简方块' },
        { label: '安全防护', val: '智能温控低温涓流' }
      ],
      price: '敬请期待',
      priceSub: '首发随主机同购特惠',
      detailUrl: 'contact.html?type=consult',
      actionText: '预约新品通知'
    },
    'lucky-mag': {
      id: 'lucky-mag',
      title: 'Lucky Mag 磁吸壳膜生态',
      series: '精工配件系列 · 03',
      subtitle: '主流标准开模，配件随手可买。',
      desc: '彻底打破小众硬件壳膜难买痛点。Lucky 系列尺寸严格对标主流旗舰通用模具，高铝硅防爆钢化膜、亲肤微磨砂磁吸保护套处处买得到。',
      defaultImg: 'images/hero_banner_accessories.jpg',
      specs: [
        { label: '模具标准', val: '主流旗舰通用标准化' },
        { label: '材质工艺', val: '微磨砂亲肤防滑手感' },
        { label: '磁吸生态', val: '强磁吸阵列无缝吸附' },
        { label: '屏幕保护', val: '9H 高铝硅防爆钢化膜' }
      ],
      price: '¥69 起',
      priceSub: '标准化即买即用',
      detailUrl: 'contact.html?type=purchase',
      actionText: '探索生态配件'
    }
  };

  let currentProductId = null;

  // 检查并在页面中同步用户之前上传的自定义图片
  Object.keys(PRODUCTS_DATA).forEach(pid => {
    const customImg = localStorage.getItem('luck_custom_img_' + pid);
    if (customImg) {
      applyImageToCard(pid, customImg);
    }
  });

  function applyImageToCard(pid, imgUrl) {
    const cardEl = document.querySelector(`[data-product-id="${pid}"]`);
    if (cardEl) {
      const img = cardEl.querySelector('img');
      if (img) img.src = imgUrl;
    }
  }

  function openModal(productId) {
    const p = PRODUCTS_DATA[productId] || PRODUCTS_DATA['lucky-mini'];
    currentProductId = p.id;

    tagEl.textContent = p.series;
    titleEl.textContent = p.title;
    subEl.textContent = p.subtitle;
    descEl.textContent = p.desc;
    priceEl.textContent = p.price;
    priceSubEl.textContent = p.priceSub;
    detailLinkEl.href = p.detailUrl;
    actionLinkEl.textContent = p.actionText;

    specsEl.innerHTML = p.specs.map(s => `
      <li class="modal-specs-item">
        <strong>${s.label}</strong>
        <span>${s.val}</span>
      </li>
    `).join('');

    // 加载图片 (优先读取本地用户上传图)
    const customImg = localStorage.getItem('luck_custom_img_' + p.id);
    if (customImg) {
      previewImg.src = customImg;
      resetBtn.style.display = 'inline-flex';
    } else {
      previewImg.src = p.defaultImg;
      resetBtn.style.display = 'none';
    }

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

  // 上传图片处理
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      handleImageFile(file);
    });
  }

  // 拖拽上传支持
  if (dropzone) {
    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const file = dt.files[0];
      if (file && file.type.startsWith('image/')) {
        handleImageFile(file);
      }
    });
  }

  function handleImageFile(file) {
    if (!currentProductId) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target.result;
      previewImg.src = dataUrl;
      resetBtn.style.display = 'inline-flex';

      try {
        localStorage.setItem('luck_custom_img_' + currentProductId, dataUrl);
      } catch (err) {
        console.warn('LocalStorage 空间不足，已在当前会话中显示', err);
      }

      // 同步更新页面卡片上的图片
      applyImageToCard(currentProductId, dataUrl);
    };
    reader.readAsDataURL(file);
  }

  // 恢复官方原图
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!currentProductId) return;
      const p = PRODUCTS_DATA[currentProductId];
      localStorage.removeItem('luck_custom_img_' + currentProductId);
      previewImg.src = p.defaultImg;
      resetBtn.style.display = 'none';
      applyImageToCard(currentProductId, p.defaultImg);
    });
  }

  // 绑定产品卡片触发器
  document.querySelectorAll('[data-open-detail]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pid = btn.getAttribute('data-open-detail') || 'lucky-mini';
      openModal(pid);
    });
  });

  // 支持 URL 参数自动打开详情 (例如 products.html?detail=lucky-mini)
  const urlParams = new URLSearchParams(window.location.search);
  const detailParam = urlParams.get('detail') || urlParams.get('product');
  if (detailParam && PRODUCTS_DATA[detailParam]) {
    setTimeout(() => openModal(detailParam), 60);
  }
}
