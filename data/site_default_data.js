/**
 * LUCK WHEAT 幸运无限 - 全站基础内容与 SEO 默认元数据表
 * 可通过后台 admin.html 任意可视化编辑、实时生效与导出备份
 * 覆盖全站 8 大页面所有可见模块，实现 100% 后台可控
 */
window.LUCK_SITE_DEFAULT_DATA = {
  // 1. SEO 默认配置 (按页面划分)
  seo: {
    global: {
      siteName: "LUCK WHEAT 幸运无限",
      titleSuffix: " | LUCK WHEAT 幸运无限官方网站",
      defaultKeywords: "LUCK WHEAT, 幸运无限, Lucky Mini, AI小手机, 智能硬件, 安卓小手机, 消费电子",
      defaultDescription: "LUCK WHEAT 幸运无限专注「AI + 精致化数码」，为不同需求的用户带来有灵魂、有趣味的产品。拥有专属 Lucky 物理键一键唤醒 AI，主流旗舰配件通用。",
      baiduVerify: "",
      googleVerify: "",
      bingVerify: "",
      canonicalBase: "http://localhost:5500"
    },
    pages: {
      index: {
        pageName: "官方首页",
        file: "index.html",
        title: "LUCK WHEAT 幸运无限官方网站 - 拥有它，就拥有幸运 | AI时代的幸运数码品牌",
        keywords: "LUCK WHEAT, 幸运无限, Lucky Mini, AI小手机, 智能硬件, 消费电子, 拥有它就拥有幸运",
        description: "LUCK WHEAT 幸运无限专注「AI + 精致化数码」，为不同需求、不同想法的用户，带来有灵魂、有趣味的产品。拥有专属 Lucky 键一键唤醒 AI，主流旗舰配件通用。",
        ogTitle: "LUCK WHEAT 幸运无限 - 拥有它，就拥有幸运",
        ogDescription: "巴掌大小的完整安卓 AI 智能小机，0.2 秒直达端侧大模型，重新定义精致掌心智能小机。",
        ogImage: "images/hero_banner_lucky_mini.jpg"
      },
      products: {
        pageName: "产品中心",
        file: "products.html",
        title: "产品中心 - 每一样，都是幸运之选 | LUCK WHEAT 幸运无限官方网站",
        keywords: "LUCK WHEAT产品, Lucky Mini 3.7寸, LUCKY Tab平板, Lucky Charge充电器, 机能工装伞绳",
        description: "LUCK WHEAT 幸运无限产品矩阵：以 Lucky Mini 3.7 英寸核心旗舰小机为先导，覆盖 8.68 与 10.1 英寸 LUCKY Tab 平板、Lucky Charge 智能充电器及 AI 创新硬件。",
        ogTitle: "产品中心 - 每一样，都是幸运之选 | 幸运无限",
        ogDescription: "探索幸运无限三大核心产品矩阵：按系列分层陈列，黄金比例展现，全系标配端侧 AI 与专属 Lucky 键。",
        ogImage: "images/showcase_lucky_mini.jpg"
      },
      lucky_mini: {
        pageName: "Lucky Mini 旗舰页",
        file: "lucky-mini.html",
        title: "Lucky Mini 3.7 英寸 - 拥有它，就拥有幸运 | 核心旗舰产品详情",
        keywords: "Lucky Mini, 3.7寸手机, AI智能小机, 实体Lucky键, CNC钛金中框, 安卓小手机",
        description: "掌心黄金尺寸的完整安卓智能小机。专属 Lucky 物理微动按键，0.2 秒一键唤醒端侧大模型。航空级 CNC 钛金精工中框，配件随手可买，单手操作从容自如。",
        ogTitle: "Lucky Mini 3.7 英寸 - 掌心里的 AI 旗舰小手机",
        ogDescription: "0.2 秒专属微动 Lucky 键，单手轻松握持，主流配件即买即用，官方首发预约中。",
        ogImage: "images/showcase_lucky_mini.jpg"
      },
      support: {
        pageName: "服务支持",
        file: "support.html",
        title: "服务支持 - 用得顺手，才算服务到位 | LUCK WHEAT 幸运无限",
        keywords: "Lucky OS下载, 幸运无限保修, 配件适配, 常见问题, 售后服务",
        description: "LUCK WHEAT 幸运无限官方服务支持中心：提供 Lucky OS 固件更新下载、保修换新政策、配件兼容查询与常见使用疑问答疑。",
        ogTitle: "服务支持 - 幸运无限官方服务支持中心",
        ogDescription: "固件升级、保修换新与技术答疑，随时为您服务。",
        ogImage: "images/hero_banner_lucky_mini.jpg"
      },
      channels: {
        pageName: "购买渠道",
        file: "channels.html",
        title: "购买渠道 - 去有幸运的地方 | LUCK WHEAT 幸运无限",
        keywords: "购买渠道, 幸运无限专卖, 官方商城, 跨境电商, 线下体验店",
        description: "探索 LUCK WHEAT 幸运无限线上官方直营独立站、天猫、京东、TikTok 跨境电商与线下体验专柜购买渠道。",
        ogTitle: "购买渠道 - 探索幸运无限全渠道购买网络",
        ogDescription: "正品保障，全球直达，线上官方商城与线下授权专柜一览。",
        ogImage: "images/hero_banner_lucky_mini.jpg"
      },
      partners: {
        pageName: "合作代理",
        file: "partners.html",
        title: "合作代理 - 一起做点有幸运的事 | 招募全球分销与代理伙伴",
        keywords: "招商加盟, 渠道代理, 跨境分销, 区域合伙人, 企业采购定制",
        description: "面向全球招募电商分销、海外跨境、线下数码专柜与 B2B 企业礼品定制合作伙伴，共同开拓精致 AI 硬件市场。",
        ogTitle: "合作代理 - 携手幸运无限，开拓 AI 硬件新生态",
        ogDescription: "清晰的利润空间与全套宣发物料支持，欢迎全球伙伴加盟合作。",
        ogImage: "images/hero_banner_accessories.jpg"
      },
      about: {
        pageName: "关于我们",
        file: "about.html",
        title: "关于我们 - 我们的由来，和我们的方向 | LUCK WHEAT 幸运无限",
        keywords: "关于幸运无限, 品牌故事, 自研供应链, 团队理念, 企业资质",
        description: "了解 LUCK WHEAT 幸运无限的品牌初心：拥有十余年数码消费电子自研自产积淀，用独立自由的姿态打造有温度、有灵魂的消费科技产品。",
        ogTitle: "关于我们 - 我们的由来，和我们的方向",
        ogDescription: "十余年行业积淀，一次品牌出发，了解幸运无限背后的故事与理念。",
        ogImage: "images/hero_banner_lucky_mini.jpg"
      },
      contact: {
        pageName: "联系我们",
        file: "contact.html",
        title: "联系我们 - 说句话，我们听着 | 幸运无限各业务线直达对接",
        keywords: "联系幸运无限, 业务合作邮箱, 商务对接, 客服咨询, 媒体联络",
        description: "LUCK WHEAT 幸运无限各业务部门直达通道：品牌合作、国内电商、跨境出海、售后技术支持与媒体公关专线。",
        ogTitle: "联系我们 - 随时聆听，专职团队快速响应",
        ogDescription: "无论是合作洽谈还是产品建议，欢迎随时与我们取得联系。",
        ogImage: "images/hero_banner_lucky_mini.jpg"
      }
    }
  },

  // 2. 全站所有核心图片资产库 (支持集中或单独更换)
  images: {
    "images/hero_banner_lucky_mini.jpg": "images/hero_banner_lucky_mini.jpg",
    "images/hero_banner_lucky_tab.jpg": "images/hero_banner_lucky_tab.jpg",
    "images/hero_banner_accessories.jpg": "images/hero_banner_accessories.jpg",
    "images/banner_subpage_products.jpg": "images/banner_subpage_products.jpg",
    "images/banner_subpage_lucky_mini.jpg": "images/banner_subpage_lucky_mini.jpg",
    "images/banner_subpage_support.jpg": "images/banner_subpage_support.jpg",
    "images/banner_subpage_channels.jpg": "images/banner_subpage_channels.jpg",
    "images/banner_subpage_partners.jpg": "images/banner_subpage_partners.jpg",
    "images/banner_subpage_about.jpg": "images/banner_subpage_about.jpg",
    "images/banner_subpage_contact.jpg": "images/banner_subpage_contact.jpg",
    "images/showcase_lucky_mini.jpg": "images/showcase_lucky_mini.jpg",
    "images/showcase_lucky_tab.jpg": "images/showcase_lucky_tab.jpg",
    "images/showcase_accessories.jpg": "images/showcase_accessories.jpg",
    "images/business-license.png": "images/business-license.png",
    "images/trademark-cn.jpg": "images/trademark-cn.jpg",
    "images/trademark-uspto.jpg": "images/trademark-uspto.jpg",
    "images/trademark-transfer.png": "images/trademark-transfer.png"
  },

  // 3. 全局文字搜索与批量替换记录
  textReplacements: {},

  // 4. 全站各页面主要文本与图片内容
  content: {
    // 全局通用内容 (Header & Footer)
    global: {
      brandCn: "幸运无限",
      brandEn: "LUCK WHEAT",
      logoImage: "",
      slogan: "拥有它，就拥有幸运",
      headerCtaText: "预约 Lucky Mini",
      headerCtaLink: "lucky-mini.html",
      navItems: [
        { label: "首页", href: "index.html" },
        { label: "产品中心", href: "products.html" },
        { label: "Lucky Mini 旗舰", href: "lucky-mini.html" },
        { label: "服务支持", href: "support.html" },
        { label: "购买渠道", href: "channels.html" },
        { label: "合作代理", href: "partners.html" },
        { label: "关于我们", href: "about.html" },
        { label: "联系我们", href: "contact.html" }
      ],
      footerColumns: [
        {
          title: "产品中心",
          links: [
            { label: "Lucky Mini 旗舰", href: "lucky-mini.html" },
            { label: "LUCKY Tab 平板", href: "products.html#series-tablet" },
            { label: "精工配件系列", href: "products.html#series-accessories" }
          ]
        },
        {
          title: "服务支持",
          links: [
            { label: "Lucky OS 下载", href: "support.html#lucky-os" },
            { label: "保修政策", href: "support.html#warranty" },
            { label: "常见问题", href: "support.html#faq" }
          ]
        },
        {
          title: "商业合作",
          links: [
            { label: "购买渠道", href: "channels.html" },
            { label: "代理合作", href: "partners.html" },
            { label: "企业定制", href: "partners.html#partner-form" }
          ]
        },
        {
          title: "关于与联系",
          links: [
            { label: "关于我们", href: "about.html" },
            { label: "联系我们", href: "contact.html" }
          ]
        }
      ],
      serviceHours: "服务时间：周一至周六 09:00 - 18:00",
      contactEmail: "support@lucky-infinite.com",
      b2bEmail: "sales@lucky-infinite.com",
      footerDesc: "AI 时代的幸运数码品牌。国内「幸运无限」，海外「LUCK WHEAT」。",
      copyright: "© 2026 深圳市幸运无限科技有限公司 版权所有",
      icpNumber: "粤ICP备2026102601号-1",
      icpLink: "http://beian.miit.gov.cn"
    },

    // 1. 官方首页 (index.html)
    index: {
      hero_badge: "AI 时代的旗舰小手机",
      hero_title: "Lucky Mini 3.7\"",
      hero_subtitle: "拥有它，就拥有幸运。",
      hero_btn_primary: "进一步了解 Lucky Mini >",
      hero_btn1_href: "lucky-mini.html",
      hero_btn_secondary: "立即预约首发 >",
      hero_btn2_href: "products.html",
      hero_badge_left: "0.2s 直达专属 AI · 实体微动 Lucky 键",
      hero_badge_right: "CNC 钛金精工中框 · ￥1999 起",
      hero_image_mini: "images/hero_banner_lucky_mini.jpg",

      hero_slide2_badge: "即将发布 · 智能硬件矩阵",
      hero_slide2_title: "LUCKY Tab 8.68\"",
      hero_slide2_sub: "轻薄在握，灵感无限。",
      hero_slide2_btn1: "探索平板详情 >",
      hero_slide2_btn1_href: "products.html?product=lucky-tab-8",
      hero_slide2_btn2: "加入预约清单 >",
      hero_slide2_btn2_href: "channels.html?product=lucky-tab-8",
      hero_slide2_badge_left: "单手黄金握持比例 · 钛银 Frost Silver",
      hero_slide2_badge_right: "全铝一体化机身 · 生产力流转",
      hero_image_tab: "images/hero_banner_lucky_tab.jpg",

      hero_slide3_badge: "生态与周边创新",
      hero_slide3_title: "配件全系通用，随手可买",
      hero_slide3_sub: "街头机能挂绳，让科技成为佩戴饰物。",
      hero_slide3_btn1: "探索配件生态 >",
      hero_slide3_btn1_href: "products.html#series-accessories",
      hero_slide3_btn2: "挑选个性挂绳 >",
      hero_slide3_btn2_href: "products.html?product=lucky-paracord",
      hero_slide3_badge_left: "50KG 抗拉工装伞绳 · 钛金快拆搭扣",
      hero_slide3_badge_right: "标准磁吸壳膜生态 · 即买即用",
      hero_image_acc: "images/hero_banner_accessories.jpg",

      stat_1_val: "3.7 英寸",
      stat_1_lbl: "旗舰小手机尺寸 · 掌心可握",
      stat_2_val: "0.2s",
      stat_2_lbl: "专属 Lucky 键 · 硬件唤醒 AI",
      stat_3_val: "全系通用",
      stat_3_lbl: "配件生态 · 降低选购门槛",
      stat_4_val: "自研工厂",
      stat_4_lbl: "品质保障 · 直达全球",

      concept_eyebrow: "品牌理念",
      concept_title: "拥有它，就拥有幸运",
      concept_desc: "我们不是\"别人有、我也有\"的生产厂家，而是消费者的朋友：洞察你的需求，搜罗你的心意，把有灵魂、有温度的产品交到你手上。",
      concept_card1_title: "拥有它，就拥有幸运",
      concept_card1_desc: "无论触摸还是使用，都能获得无穷的愉悦感。幸运不是玄学，是每一次顺手的操作、每一次被理解的需求。",
      concept_card2_title: "有趣的灵魂，百里挑一",
      concept_card2_desc: "我们为用户带来更多幸运，也鼓励用户分享想法、分享快乐与喜悦。在千篇一律的数码市场中坚持独特格调。",
      concept_card3_title: "工厂 + 品牌方",
      concept_card3_desc: "自产自销、有灵魂、有趣味。以「LUCK WHEAT 幸运无限」品牌稳步服务全球用户，确保品质从源头到手中始终如一。",

      // 首页产品矩阵区
      products_eyebrow: "产品矩阵",
      products_title: "每一款，都是幸运之选",
      products_desc: "以 Lucky Mini 为核心旗舰，平板与智能配件持续补充覆盖。每一样产品都围绕「AI + 幸运感」打造。",

      // 首页核心体验区与 Lucky 键仿真器
      exp_eyebrow: "核心体验",
      exp_title: "配件通用，AI 一键唤醒",
      exp_desc: "打破传统小众硬件生态壁垒。尺寸比例与主流旗舰一致，配件处处通用；专属硬件快捷键，触手即达 AI 世界。",
      exp_cards: [
        { title: "主流旗舰配件通用", desc: "机身尺寸比例与主流旗舰机型保持一致，保护膜、保护壳、充电器等配件随手可买，无需额外定制。" },
        { title: "专属 Lucky 键", desc: "机身侧面配备硬件级实体快捷键，一键直达 AI 对话，免解锁、免翻找应用，随时捕捉生活灵感。" },
        { title: "原创外观设计", desc: "坚持自主设计语言，高辨识度精致工业机身，提供双配色方案，颜值与握持感双在线。" },
        { title: "设计中的文化点缀", desc: "将东方美学元素作为设计语言点缀，年轻、精致、不落俗套，赋予硬件温润的人文质感。" }
      ],
      sim_title: "Lucky 键极简工作流",
      sim_desc: "无需繁琐解锁与翻找 App，硬件实体键让 AI 如同呼吸般自然。",
      sim_tip: "▲ 点击机身左侧橙色 Lucky 实体键体验",
      sim_steps: [
        { title: "按下 · 实体触发", desc: "机身侧键实体触发，无论息屏还是待机，单手盲操按下即可直达。" },
        { title: "唤醒 · 大模型对话", desc: "一键开启 AI 交互，国内外服务按地区接入主流 AI 大模型。" },
        { title: "记录 · 视觉与提醒", desc: "AI 拍照、AI 拍学、忘物识别等专属视觉与生活能力随按随用。" },
        { title: "分享 · 传递快乐", desc: "把好用的、好玩的、幸运的瞬间即时沉淀并分享给家人与朋友。" }
      ],

      // 首页品牌发展路径区
      path_eyebrow: "品牌发展路径",
      path_title: "从一款好产品，到一个好品牌",
      path_desc: "我们不追求急功近利的扩张，而是立足用户真实心智，踏实走出一条健康长期的数码品牌之路。",
      path_cards: [
        { num: "01", title: "专注细分", desc: "从细分需求出发，以掌心小尺寸、高质感、高颜值为突破口，打造让人一眼记住的代表作。" },
        { num: "02", title: "持续创新", desc: "以 AI 技术与 Lucky 智能生态为核心，不断推出平板、智能配件等有特色、有温度的新品。" },
        { num: "03", title: "走向全球", desc: "依托「LUCK WHEAT 幸运无限」品牌与健全的分销体系，打通全球营销与跨境渠道，把幸运带给全球用户。" }
      ],

      // 首页品牌历程区
      history_eyebrow: "积淀与坚持",
      history_title: "十余年行业积淀，一次品牌出发",
      history_desc: "深耕数码消费电子供应链多年，今天我们用更独立、更自由的姿态，构建属于自己的智能品牌。",
      history_timeline: [
        { year: "2010 年代 · 根基积淀", content: "团队深耕消费电子行业，打通电商、系统集成、生产制造全链路，经营平板、手机、智能穿戴等全线品类。" },
        { year: "2024 · 渠道跃迁", content: "完成从传统电商到内容电商的全面转型，直播与短视频多维度布局成熟，深度掌握终端用户第一线真实诉求。" },
        { year: "2026 · 品牌启航", content: "正式确立「LUCK WHEAT 幸运无限」品牌，发布 AI 智能硬件产品线，全面启动全球市场布局。" }
      ],
      history_insist_title: "我们的坚持",
      history_insist_list: [
        { title: "自有研发、生产与销售体系", desc: "品质由我们自己严格把关，杜绝粗制滥造。" },
        { title: "坚持原创设计", desc: "拒绝盲目跟风，做有鲜明辨识度、有独立审美的硬件。" },
        { title: "以用户需求为先", desc: "从日常真实场景出发，持续打磨软硬件顺手体验。" },
        { title: "无负债经营、现金流稳健", desc: "企业底盘扎实，值得渠道伙伴与终端用户长期信赖。" }
      ],

      // 首页品牌动态区
      news_eyebrow: "品牌动态",
      news_title: "幸运无限正在发生",
      news_desc: "每一步脚印，都向着更有趣的数码世界前行。",
      opinion_eyebrow: "观点 · 创作者手记",
      opinion_title: "我们相信的事",
      opinion_quote: "“品牌是一项长期的工作。比起产品数量，我们更在意是否被用户记住、被用户喜欢。所以第一款产品，我们选择做得足够特别。”",
      opinion_author: "—— 幸运无限团队 品牌初心理念",

      // 底部 CTA
      cta_title: "下一个幸运，也许由你带来",
      cta_desc: "我们正在寻找电商分销、线下渠道、售后服务与内容创作的合作伙伴。让我们携手，为用户带来有温度的科技生活。",
      cta_btn1_text: "查看合作方式",
      cta_btn1_href: "partners.html",
      cta_btn2_text: "直接联系我们",
      cta_btn2_href: "contact.html",

      // 品牌动态 (支持微信公众号推文直达)
      brand_news: [
        {
          date: "2026-10",
          title: "Lucky Mini 3.7 英寸旗舰小手机设计定稿",
          desc: "原创外观设计完成、专属 Lucky 键硬件级确认、主流旗舰配件通用比例敲定。",
          link: "https://mp.weixin.qq.com"
        },
        {
          date: "2026-09",
          title: "AI 能力进入系统实测阶段",
          desc: "Lucky 键一键唤醒 AI 对话交互完成联调，国内外按地区接入主流优质大模型能力。",
          link: "https://mp.weixin.qq.com"
        },
        {
          date: "2026-08",
          title: "「幸运之选」品牌标签正式发布",
          desc: "品牌定位、核心价值观与软硬件产品线对外全面统一步调。",
          link: "https://mp.weixin.qq.com"
        },
        {
          date: "2026-07",
          title: "全球化服务网络启动筹备",
          desc: "以「LUCK WHEAT 幸运无限」品牌为核心，全球化分销网络与多区域服务中心全面启动。",
          link: "https://mp.weixin.qq.com"
        }
      ]
    },

    // 2. 产品中心 (products.html)
    products: {
      page_eyebrow: "Product Matrix · 全线硬件",
      page_title: "每一样，都是幸运之选",
      page_desc: "探索幸运无限三大核心产品矩阵：按系列分层陈列，黄金比例展现。所有设备均配备专属 Lucky 键与端侧大模型深度协同能力。",
      
      phone_tag: "旗舰小机系列 · 01",
      phone_series_title: "智能手机系列",
      phone_series_desc: "黄金单手握持手感，专属物理微动 Lucky 键，0.2 秒直达端侧大模型，重新定义精致掌心智能小机。",

      tablet_tag: "便携平板系列 · 02",
      tablet_series_title: "随身平板系列",
      tablet_series_desc: "全铝一体化机身，单手黄金便携比例，随身生产力与大模型协同双屏互联流转。",

      acc_tag: "生态配件系列 · 03",
      acc_series_title: "精工配件系列",
      acc_series_desc: "先锋街头机能工业美学，标配 50KG 工装伞绳与钛金快拆卡扣，主流标准壳膜即买即用。",

      // 研发哲学区
      philosophy_eyebrow: "研发哲学",
      philosophy_title: "我们的产品观",
      philosophy_desc: "在同质化严重的数码时代，幸运无限坚持走自己的路。",
      philosophy_cards: [
        { title: "不做平庸的产品", desc: "竞争激烈、千篇一律的品类，无法给用户带来惊喜。我们宁可花更多时间打磨，也不推出无趣的平庸之作。" },
        { title: "要有记忆点", desc: "好产品应该让人一眼记住、用过忘不掉。从 3.7 英寸的黄金握感，到实体 Lucky 键的干脆反馈，处处有回响。" },
        { title: "要有辨识度", desc: "从外观到体验，都要有幸运无限自己的味道。将东方审美与现代工学生态结合，自成一派。" }
      ],
      philosophy_quote: "“我们相信，产品的核心竞争力是情绪价值、差异化设计与独特体验，而不只是‘便宜好用’。”",

      // 结构化产品中心列表
      items: [
        {
          id: "lucky-mini",
          series: "phone",
          seriesLabel: "旗舰小机系列 · 01",
          badge: "核心旗舰 · AI",
          badgeType: "live",
          title: "Lucky Mini 3.7 英寸",
          subtitle: "拥有它，就拥有幸运。",
          desc: "掌心黄金尺寸的完整安卓智能小机。专属 Lucky 物理微动按键，0.2 秒一键唤醒端侧大模型。航空级 CNC 钛金精工中框，配件随手可买，单手操作从容自如。",
          image: "images/showcase_lucky_mini.jpg",
          specs: [
            { label: "3.7\"", val: "视网膜单手小屏" },
            { label: "0.2s", val: "专属微动 Lucky 键" },
            { label: "CNC", val: "钛金精工中框" },
            { label: "通用", val: "标准化壳膜生态" }
          ],
          price: "$299",
          priceSub: "约 ¥1999 / 首发前1000名优惠",
          detailUrl: "lucky-mini.html",
          buyUrl: "channels.html?product=lucky-mini",
          buyText: "立即购买",
          detailImages: [
            "images/showcase_lucky_mini.jpg",
            "images/hero_banner_lucky_mini.jpg",
            "images/banner_subpage_lucky_mini.jpg"
          ],
          detailDesc: "Lucky Mini 3.7 英寸核心旗舰小机：掌心黄金尺寸的完整安卓智能小机，配备专属 0.2s 物理微动 Lucky 键，一键唤醒端侧 AI 大模型。采用航空级 CNC 钛金精工中框与标准通用配件生态。"
        },
        {
          id: "lucky-tab-8",
          series: "tablet",
          seriesLabel: "随身平板系列 · 02",
          badge: "即将上市",
          badgeType: "pending",
          title: "LUCKY Tab 8.68 英寸",
          subtitle: "轻便随身，大模型伴读与轻量办公利器。",
          desc: "8.68 英寸随身智能平板，单手黄金阅读比例与广阔视野兼得。全铝 CNC 一体成型，轻量办公与灵感利器。",
          image: "images/showcase_lucky_tab.jpg",
          specs: [
            { label: "便携屏幕", val: "8.68\" 黄金阅读比例" },
            { label: "AI 系统", val: "Lucky OS 多端流转协同" },
            { label: "机身工艺", val: "全铝 CNC 一体成型" },
            { label: "交互按键", val: "专属物理 Lucky 键" }
          ],
          price: "敬请期待",
          priceSub: "筹备推进中",
          detailUrl: "contact.html?type=consult#leave-message",
          buyUrl: "channels.html?product=lucky-tab-8",
          buyText: "立即购买",
          detailImages: [
            "images/showcase_lucky_tab.jpg",
            "images/hero_banner_lucky_tab.jpg"
          ],
          detailDesc: "8.68 英寸黄金阅读比例随身智能平板，全铝 CNC 一体成型，单手从容舒适托持，深度适配端侧 AI 助手，阅读、批注、即时问答流畅无缝。"
        },
        {
          id: "lucky-tab-10",
          series: "tablet",
          seriesLabel: "随身平板系列 · 02",
          badge: "即将上市",
          badgeType: "pending",
          title: "LUCKY Tab 10.1 英寸",
          subtitle: "高清大屏，全家人身边的 AI 智慧中心。",
          desc: "10.1 英寸全视高清大屏平板，学习辅导、远程办公、家庭娱乐全场景覆盖，融入 AI 互动伴学新体验。",
          image: "images/hero_banner_lucky_tab.jpg",
          specs: [
            { label: "视网膜屏", val: "10.1\" 全贴合视网膜屏" },
            { label: "健康护眼", val: "硬件级防蓝光认证" },
            { label: "全场景生态", val: "家庭伴读与远程协同" },
            { label: "续航能力", val: "超长待机大容量电池" }
          ],
          price: "敬请期待",
          priceSub: "即将亮相",
          detailUrl: "contact.html?type=consult#leave-message",
          buyUrl: "channels.html?product=lucky-tab-10",
          buyText: "立即购买",
          detailImages: [
            "images/hero_banner_lucky_tab.jpg",
            "images/showcase_lucky_tab.jpg"
          ],
          detailDesc: "10.1 英寸全视高清大屏平板，专为家庭、远程学习与生产力打造，硬件级防蓝光护眼认证，全场景生态智能协同。"
        },
        {
          id: "lucky-paracord",
          series: "accessories",
          seriesLabel: "精工配件系列 · 03",
          badge: "精工生态",
          badgeType: "live",
          title: "Lucky Paracord 机能工装挂绳",
          subtitle: "50KG 承重伞绳，钛金快拆卡扣。",
          desc: "标配 50KG 抗拉高分子工装伞绳与钛合金快拆扣，让硬件成为随身佩戴饰物，街头与机能随行。",
          image: "images/showcase_accessories.jpg",
          specs: [
            { label: "极限承重", val: "50KG 户外抗拉伞绳" },
            { label: "卡扣材质", val: "钛合金秒级快拆扣" },
            { label: "风格设计", val: "机能工装街头美学" },
            { label: "色彩系列", val: "多色个性编织可选" }
          ],
          price: "¥129 起",
          priceSub: "多色个性编织",
          detailUrl: "contact.html?type=purchase",
          buyUrl: "channels.html?product=lucky-paracord",
          buyText: "立即购买",
          detailImages: [
            "images/showcase_accessories.jpg",
            "images/banner_subpage_lucky_mini.jpg"
          ],
          detailDesc: "Lucky Paracord 先锋机能工装伞绳，标配 50KG 承重抗拉高分子伞绳与钛合金快拆扣，户外机能风格，让科技成为佩戴饰物。"
        },
        {
          id: "lucky-charge",
          series: "accessories",
          seriesLabel: "精工配件系列 · 03",
          badge: "即将上市",
          badgeType: "pending",
          title: "Lucky Charge 45W 氮化镓双口闪充",
          subtitle: "双口快充，差旅极简能量方块。",
          desc: "围绕桌面与出行充电场景设计，兼容多协议极速快充，以精致小巧的工业设计与 Lucky 设备无缝联动。",
          image: "images/hero_banner_accessories.jpg",
          specs: [
            { label: "输出功率", val: "45W GaN 双口快充" },
            { label: "快充协议", val: "PD 3.0 / QC 4+ 全兼容" },
            { label: "结构设计", val: "90° 折叠插脚极简方块" },
            { label: "安全防护", val: "智能温控低温涓流" }
          ],
          price: "敬请期待",
          priceSub: "生态硬件",
          detailUrl: "contact.html?type=consult",
          buyUrl: "channels.html?product=lucky-charge",
          buyText: "立即购买",
          detailImages: [
            "images/hero_banner_accessories.jpg"
          ],
          detailDesc: "Lucky Charge 45W 氮化镓双口闪充：高效温控芯片，折叠插脚便携方块，全面兼容 PD/QC 多协议设备极速快充。"
        },
        {
          id: "lucky-mag",
          series: "accessories",
          seriesLabel: "精工配件系列 · 03",
          badge: "标准通用",
          badgeType: "live",
          title: "Lucky Mag 磁吸壳膜生态",
          subtitle: "主流标准开模，配件随手可买。",
          desc: "采用行业通用标准模具尺寸设计，告别小众保护壳难买痛点，全面兼容主流磁吸车载与桌面配件。",
          image: "images/hero_banner_accessories.jpg",
          specs: [
            { label: "模具标准", val: "主流旗舰通用标准化" },
            { label: "材质工艺", val: "微磨砂亲肤防滑手感" },
            { label: "磁吸生态", val: "强磁吸阵列无缝吸附" },
            { label: "屏幕保护", val: "9H 高铝硅防爆钢化膜" }
          ],
          price: "¥69 起",
          priceSub: "标准化即买即用",
          detailUrl: "contact.html?type=purchase",
          buyUrl: "channels.html?product=lucky-mag",
          buyText: "立即购买",
          detailImages: [
            "images/hero_banner_accessories.jpg"
          ],
          detailDesc: "Lucky Mag 磁吸生态壳膜：标准通用开模尺寸，强力磁吸阵列，微磨砂亲肤防滑，9H 高铝硅防爆钢化，主流配件随手可买。"
        }
      ]
    },

    // 3. Lucky Mini 旗舰页 (lucky-mini.html)
    lucky_mini: {
      banner_eyebrow: "Flagship · 旗舰小机",
      banner_title: "Lucky Mini 3.7\"",
      banner_desc: "拥有它，就拥有幸运。3.7 英寸掌心黄金比例机身，实体微动 Lucky 键一键唤醒端侧大模型，主流旗舰配件无缝通用。",
      badge: "核心旗舰品 · 首发亮相",
      title: "Lucky Mini 3.7 英寸",
      sub: "巴掌大小的完整安卓 AI 智能小机。尺寸比例与主流旗舰一致，配件通用；专属 Lucky 键，一键唤醒 AI。",
      desc: "Lucky Mini 是幸运无限的第一款核心旗舰产品，也是「幸运之选」的第一个具象载体。它不追求堆料，而是把“幸运感”做实：拿起来顺手、按键即用、配件随处可买、外观一眼与众不同。",
      price_label: "海外官方定价",
      price: "$299",
      price_sub: "约 ¥1999 RMB / 约 4 万余日元",
      promo_badge: "限时首发特权",
      promo_tip: "🔥 首发活动：前 1000 名下单用户可享限时优惠礼包与优先交付，详情以官方独立站为准。",
      buy_btn_text: "🛒 立即购买 / 前往官方渠道 ↗",
      buy_btn_href: "channels.html?product=lucky-mini",
      b2b_btn_text: "联系商务合作",
      b2b_btn_href: "contact.html?type=b2b",
      showcase_img: "images/showcase_lucky_mini.jpg",

      features_eyebrow: "核心亮点",
      features_title: "五大核心能力，为日常而生",
      features_desc: "不止于小巧，更拥有完整智慧与全能生态体验。",
      features_list: [
        { title: "1. AI 拍照 / AI 拍学", desc: "抬手即拍，AI 同步完成记录与学习辅助。遇到不懂的英文、动植物、数学题目，轻按 Lucky 键立刻解析。" },
        { title: "2. AI 忘物识别", desc: "贴心提醒随身物品。外出时通过视觉轻量扫描，自动核对钥匙、证件、背包，重要物件绝不落下。" },
        { title: "3. AI 编程教学", desc: "面向儿童与初学者的编程启蒙教育。通过语音交互与逐步启发式引导，把生涩的逻辑变得如同做游戏。" },
        { title: "4. 完整安卓系统", desc: "拒绝功能阉割。支持安装微信、主流地图、通讯应用、学习软件与影音工具，满足日常全功能通信与社交需求。" },
        { title: "5. 配件随处通用", desc: "机身尺寸比例与主流旗舰完全一致。保护膜、保护壳、挂绳、充电器均可在任何街头数码店或电商平台随手买到。" },
        { title: "专属 Lucky 硬件键", desc: "不仅是一个按键，更是开启未来智能生活的实体旋律。免解锁即刻直达大模型交互。" }
      ],

      audience_eyebrow: "用户画像",
      audience_title: "适合谁用？掌心里的陪伴",
      audience_desc: "为不同年龄与场景的用户带来更轻盈、专注的生活方式。",
      audience_list: [
        { tag: "学龄优选", title: "5-10 岁儿童", desc: "安全通讯、无过度游戏打扰，更有 AI 启蒙与拍学答疑，让家长更安心放心。" },
        { tag: "个性态度", title: "追求个性的年轻人", desc: "拒绝笨重大砖头。3.7 英寸小众尺寸本身就是态度，搭配潮流挂绳与美学壳套，回头率拉满。" },
        { tag: "长辈关怀", title: "长辈与家人", desc: "轻便随身无负担，大音量清晰通话，一键 AI 语音问询天气与生活琐事，随时便捷沟通。" },
        { tag: "双机极简", title: "双机商务用户", desc: "作为工作/出行的第二台轻便备用机。跑步遛弯不占手，替代手表实现完整通讯功能。" }
      ],

      specs_eyebrow: "规格参数",
      specs_title: "Lucky Mini 详细规格",
      specs_desc: "每一处设计与软硬件融合均经过严谨推敲。",
      specs_caption: "Lucky Mini 3.7 英寸官方公开规格表",
      specs_rows: [
        { label: "屏幕尺寸", val: "3.7 英寸，比例与主流旗舰机型保持一致" },
        { label: "机身形态", val: "掌心可握，极致轻盈，舒适单手握持操作" },
        { label: "操作系统", val: "完整安卓（Android）系统，支持主流应用无阻安装" },
        { label: "特色按键", val: "专属 Lucky 键，硬件级快速唤醒 AI 对话交互" },
        { label: "AI 核心能力", val: "AI 拍照、AI 拍学、AI 忘物识别、AI 编程教学" },
        { label: "AI 模型服务", val: "接入主流 AI 大模型，国内外服务按地区网络环境提供" },
        { label: "配件兼容性", val: "保护膜、保护壳、充电器等主流旗舰配件通用" },
        { label: "外观设计", val: "原创设计语言，双配色方案（科技暗夜 / 陶瓷白霜）" },
        { label: "周边生态", val: "便携挂绳、定制保护套、Lucky OS 软硬件智能联动" }
      ],

      acc_eyebrow: "配套周边",
      acc_title: "搭配使用，幸运翻倍",
      acc_desc: "为 Lucky Mini 量身定制的精致配件生态。",
      acc_list: [
        { title: "潮流挂绳", desc: "轻盈抗拉纤维打造，随手一挂即走。运动、通勤、差旅、遛娃解放双手，好看又好带。" },
        { title: "美学保护套", desc: "含有东方美学点缀的专属设计款，抗摔缓冲边角，细腻亲肤触感与高级微透质感。" },
        { title: "Lucky OS 系统套件", desc: "桌面专属 AI 入口与快捷小组件，一键直达对话与智能记录，随时同步云端。" }
      ],

      related_title: "探索更多 LUCK WHEAT 幸运无限硬件",
      related_desc: "LUCKY Tab 8.68 英寸 / Lucky Charge 智能充电器 / AI 创新硬件系列即将陆续推出。",
      related_btn_text: "查看全部产品矩阵",
      related_btn_href: "products.html"
    },

    // 4. 服务支持 (support.html)
    support: {
      banner_eyebrow: "Service & Support · 全周期守护",
      page_title: "用得顺手，才算服务到位",
      page_desc: "从配件适配查询到 Lucky OS 固件下载，从全流程保修换新到售后网点服务，幸运无限守护每一次体验。",
      os_heading: "Lucky OS 系统与软件生态",
      os_desc: "Lucky OS 是幸运无限硬件的灵魂：桌面 AI 入口、幸运随记、配件适配查询与售后工单，都在一个系统应用里优雅完成。",
      os_rows: [
        { name: "Lucky OS for Lucky Mini", sys: "Android 10 及以上", status: "内测版", statusType: "live", way: "出厂内置 / 随固件空中升级（OTA）" },
        { name: "Lucky OS for LUCKY Tab", sys: "Android 11 及以上", status: "规划中", statusType: "pending", way: "随平板上市同步正式推出" },
        { name: "Lucky Companion 家长/伴侣端", sys: "iOS / Android 跨平台", status: "规划中", statusType: "pending", way: "即将上线苹果 App Store 与主流应用市场" }
      ],
      os_note: "* 正式发布后可在官网与官方应用商店直接下载；如果您希望提前参与内测体验，欢迎通过联系我们页面申请内测资格。",

      warranty_heading: "官方保修与售后政策",
      warranty_desc: "我们为所有官方渠道售出的产品提供完善的全国联保与跨境保障承诺。",
      warranty_cards: [
        { badge: "整机保修", badgeType: "live", title: "12 个月主机质保", desc: "主机整机享受自签收之日起 12 个月的保修服务；电池及随机标配充电器享受 6 个月质保。" },
        { badge: "质量无忧", badgeType: "live", title: "免费维修或换新", desc: "在正常使用情况下出现的非人为硬件故障，享受官方免费寄送检修或直接更换新机。" },
        { badge: "配件保障", badgeType: "live", title: "配件 3 个月换新", desc: "官方正品配件自购买之日起 3 个月内，因品质原因出现功能异常可凭购机凭证换新。" },
        { badge: "跨境同步", badgeType: "live", title: "订单与序列号追溯", desc: "凭订单号与机身 SN 序列号即可在线一键发起售后，海外跨境订单同步享受跨国质保协调。" },
        { badge: "公开透明", badgeType: "subtle", title: "超保付费透明维修", desc: "超出保修期或人为损坏情况，提供原厂零配件付费维修服务，价格明码公示，绝无隐形加价。" },
        { badge: "专属客服", badgeType: "live", title: "售后支持直达通道", desc: "售后专职邮箱：support@lucky-infinite.com，工作日 24 小时内响应。" }
      ],

      compat_heading: "配件适配查询",
      compat_desc: "幸运无限全系产品的尺寸比例与主流旗舰机型保持一致，市面绝大多数配件可直接使用。仍不确定？您可在下方快速筛选或联系客服人工核对。",
      compat_rows: [
        { cat: "保护膜", level: "全系通用", levelType: "live", tip: "尺寸比例与主流旗舰机型一致，可直接选用对应比例的高清钢化膜或水凝膜。" },
        { cat: "保护壳 / 保护套", level: "全系通用", levelType: "live", tip: "机身轮廓标准匹配，同时推荐选用官方出品的东方美学点缀定制款保护壳。" },
        { cat: "充电器 / 数据线", level: "标准协议兼容", levelType: "live", tip: "采用通用 Type-C 接口，兼容行业主流标准快充协议，原装或第三方大牌充电器均可使用。" },
        { cat: "指环支架 / 车载支架", level: "通用", levelType: "live", tip: "支持通用背贴式磁吸环、指环扣以及各类标准尺寸车载出风口夹持支架。" },
        { cat: "第三方定制特定模具", level: "需核对模具版本", levelType: "pending", tip: "特殊卡扣或包覆式特种外壳请向客服核对具体模具工程图尺寸版本后确认。" }
      ],

      faq_eyebrow: "常见问题解答",
      faq_heading: "常见问题（FAQ）",
      faq_desc: "快速解答关于硬件、AI 交互与渠道的常见疑惑。",
      faq_list: [
        { q: "Q1：Lucky 键和普通语音助手有什么区别？", a: "答：Lucky 键是硬件级实体快捷键，无需点亮屏幕解锁、无需划动屏幕翻找应用，盲操一按即可直达 AI 对话与服务，响应速度更快、覆盖拍照识别与随手问答等全天候场景。" },
        { q: "Q2：产品的外观设计是原创的吗？", a: "答：是的。幸运无限全系产品均为团队原创设计，拥有完整的自主设计语言与外观专利布局，同时在机身三围比例上巧妙保持与主流旗舰配件的通用性，极大方便用户购买壳膜等日常配件。" },
        { q: "Q3：AI 服务国内外一样吗？", a: "答：AI 服务因地制宜按地区网络合规提供。国内与海外版本均接入主流领先的 AI 大模型引擎，系统算法与模型交互能力将伴随版本 OTA 持续升级迭代。" },
        { q: "Q4：8.68 英寸和 10.1 英寸平板什么时候正式上市？", a: "答：两款平板目前均处于工程推进阶段，最新发布时间表将第一时间在官网“品牌动态”同步，您也可以在产品中心点击“获取发布通知”登记您的邮箱。" },
        { q: "Q5：怎么购买幸运无限的产品？", a: "答：您可以关注官网“购买渠道”页面。海外用户可直接通过官方独立站订购，国内主流平台品牌旗舰店与线下快闪体验店也正在筹备中，具体以各渠道官方公告为准。" },
        { q: "Q6：怎么成为幸运无限的合作伙伴？", a: "答：欢迎前往“合作代理”页面提交您的合作意向或填写在线申请表单。我们的品牌与渠道部会在 1 个工作日内与您取得联系并沟通详细对接方案。" }
      ],

      service_hotline: "400-888-2026",
      service_email: "support@lucky-infinite.com"
    },

    // 5. 购买渠道 (channels.html)
    channels: {
      banner_eyebrow: "Retail & Channels · 全球销售网络",
      page_title: "去有幸运的地方",
      page_desc: "幸运无限正在搭建覆盖国内与海外的购买网络，所有授权渠道售卖的产品均为官方正品，享受同等优质的质保与软件服务。",
      channel_cards: [
        { badge: "即将上线 · 首发通道", badgeType: "live", title: "官方独立站（海外首发）", desc: "海外官方站点直营，首发支持全球多币种结算与直邮。官网官方标价 299 美元，首发期前 1000 名用户享专属优惠补贴。" },
        { badge: "即将上线", badgeType: "pending", title: "官方商城 APP", desc: "深度与 Lucky OS 系统打通，实现设备端一键下单、专属领券、智能查验配件与在线售后工单全流程一站式闭环。" },
        { badge: "筹备中", badgeType: "pending", title: "平台电商旗舰店（国内）", desc: "天猫、京东、抖音等国内主流电商平台官方品牌旗舰店正在火热筹备入驻中，上线后可直接享受国内极速物流直达。" },
        { badge: "招商推进中", badgeType: "live", title: "跨境分销网络", desc: "面向东南亚、日本、北美、欧洲等海外重点区域市场的授权分销伙伴网络，由官方统一赋能定价体系与售后物料。" },
        { badge: "规划中", badgeType: "subtle", title: "线下快闪与体验店", desc: "重点城市核心潮流商圈的品牌快闪巡展活动陆续展开，为消费者带来零距离上手把玩 3.7 英寸小机与体验 Lucky 键的真实质感。" },
        { badge: "长期开放", badgeType: "live", title: "企业批量采购与礼品定制", desc: "面向政企客户、教育机构、礼品定制及企业员工伴手礼的批量集采需求，支持软硬件定制化 LOGO 与系统引导预装。" }
      ],
      policy_heading: "批发与分销渠道政策",
      policy_desc: "我们秉持共生共赢理念，为各层级分销渠道构建健康透明的商业生态。",
      policy_rows: [
        { label: "合作模式", val: "区域授权独家/首发分销、企业批量直采、新媒体内容联合推广" },
        { label: "价格管理体系", val: "官方统一指导控价管理，严格杜绝恶意破价，切实保障渠道伙伴合理利润与市场秩序" },
        { label: "供货与交付保障", val: "自有全资研发生产制造体系，产能弹性可控，供货稳定可靠" },
        { label: "售后技术支持", val: "品牌方集中提供售后备件、工程师培训、快速返修及在线工单追溯系统支持" },
        { label: "品牌物料支持", val: "提供电商高清详情页、线下陈列物料、视频演示 Demo 与宣发素材全套输出" }
      ],
      form_eyebrow: "渠道咨询",
      form_heading: "渠道与批量采购意向咨询",
      form_desc: "留下您的采购或合作意向，品牌渠道专员将在 24 小时内与您深度对接。"
    },

    // 6. 合作代理 (partners.html)
    partners: {
      banner_eyebrow: "Partnership · 生态共赢",
      page_title: "一起做点有幸运的事",
      page_desc: "幸运无限长期开放电商分销、线下渠道、售后服务与创作者合作，提供产品、内容与服务的全链路支持，共享品牌成长红利。",
      partner_directions: [
        { title: "1. 电商分销（国内）", desc: "承接天猫、京东、抖音等国内主流电商平台分销，深度共享官方品牌营销红利与流量扶持。" },
        { title: "2. 跨境分销（海外）", desc: "面向东南亚、欧美、日本等海外重点市场，官方提供统一合规外销指导、素材库及海外仓配保障。" },
        { title: "3. 线下渠道合作", desc: "核心商圈潮流快闪、数码连锁专柜、精品潮玩集合店陈列合作，官方输出高档展示展架与样品。" },
        { title: "4. 区域售后服务网点", desc: "承接区域性售后检修与备件服务。品牌方提供原厂配件包、专业技术工程师培训与工单补贴。" },
        { title: "5. 内容与红人创作者", desc: "诚邀科技数码测评博主、潮流生活家、亲子育儿博主联合创作，提供抢先工程样机与专属分成激励。" },
        { title: "6. 企业定制与集采", desc: "针对企业伴手礼、行业教育应用、专属品牌定制，提供外观丝印、软件桌面引导页等个性化定制服务。" }
      ],
      support_eyebrow: "赋能体系",
      support_offerings: "我们给伙伴带来什么？",
      support_desc: "全方位、深层次的品牌支持体系，让您的每一份拓展都底气十足。",
      support_cards: [
        { title: "1. 卓越产品力", desc: "旗舰与平价产品线梯队完整，自主工业设计团队把关，品质自控，差异化极强，告别价格内卷。" },
        { title: "2. 丰富内容力", desc: "提供全套高清详情页、高精度 3D 渲染图、线下陈列物料、视频演示 Demo 与社交媒体种草素材。" },
        { title: "3. 稳健供应链", desc: "自有研发、贴片与总装生产体系，生产排期透明，交付周期准时，无资金链与断货隐患。" },
        { title: "4. 聚焦营销力", desc: "聚焦核心旗舰产品的全网曝光与市场公关投入，线上线下同频共振，渠道直接共享品牌溢出流量。" },
        { title: "5. 极简服务力", desc: "AI 系统端直接集成售后入口，配件全系通用极大降低库存管理与售后换配件的复杂度。" },
        { title: "长期伙伴关系", desc: "我们视渠道为并肩作战的战友，严格保护区域授权与价格秩序，携手共筑品牌长青基业。" }
      ],
      steps_eyebrow: "加盟流程",
      steps_title: "成为伙伴的四个阶段",
      steps_desc: "清晰高效的对接机制，最快 3 个工作日完成授信与物料发放。",
      steps_list: [
        { step: "STEP 1", title: "提交意向", desc: "在下方填写申请表单，说明您的拟合作类型、主营业务及覆盖区域。" },
        { step: "STEP 2", title: "商务沟通", desc: "品牌渠道总监 1 对 1 对接，评估合作方案并确认授权政策与供货细则。" },
        { step: "STEP 3", title: "物料下发", desc: "正式签署协议，官方即刻下发全套宣传素材、陈列方案及系统培训手册。" },
        { step: "STEP 4", title: "正式开展", desc: "样机进场、上架销售，联合品牌宣发节点开展线上线下联合推广。" }
      ],
      apply_eyebrow: "在线申请",
      apply_heading: "代理合作申请表单",
      apply_desc: "诚邀志同道合的商业伙伴加盟。请详尽填写下方信息，我们将在 24 小时内回复。"
    },

    // 7. 关于我们 (about.html)
    about: {
      banner_eyebrow: "Brand Story · 工业底蕴与品牌初心",
      page_title: "我们的由来，和我们的方向",
      page_desc: "把十余年的工业沉淀，装进一个真正属于用户的品牌里。做有灵魂的硬件，做消费者的贴心朋友。",
      intro_badge: "初心与定位",
      intro_quote: "“千篇一律的产品不值得做，我们相信美的力量与趣味的价值。”",
      intro_p1: "幸运无限隶属于深耕消费电子十余年的一体化团队，业务覆盖研发、生产、销售全链路。我们始终认为，千篇一律的产品不值得做——团队相信美的力量、趣味的价值，因此确立「幸运之选」的品牌定位，希望用产品为用户带来更多快乐与幸福。",
      intro_p2: "现在，我们把这份积累，装进一个真正属于用户的品牌里：AI 时代的幸运数码品牌——LUCK WHEAT 幸运无限。",
      global_title: "品牌全球化布局",
      global_domestic_tag: "DOMESTIC BRAND",
      global_domestic_name: "幸运无限（LUCK WHEAT）",
      global_domestic_desc: "面向大中华区市场，深耕内容电商、品牌旗舰店与线下精品零售。",
      global_overseas_tag: "GLOBAL BRAND",
      global_overseas_name: "LUCK WHEAT",
      global_overseas_desc: "面向全球重点国家和地区，以官方独立站与跨境经销商网络出海。",

      timeline_eyebrow: "品牌征程",
      timeline_title: "公司成长历程",
      timeline_desc: "扎实深耕，循序渐进构建企业核心护城河。",
      timeline_list: [
        { year: "2010 年代 · 制造与链路打通", content: "团队深耕消费电子行业，全面打通研发设计、元器件集采、工厂自动化生产、渠道销售的全链路一体化能力，积累了深厚的数码硬件调优与质量控制底蕴。" },
        { year: "2024 · 拥抱内容电商", content: "顺应零售时代变迁，迅速完成向新媒体内容电商的全面转型。在直播矩阵与短视频渠道深度触达数以百万计的终端消费者，积累了敏锐的市场需求洞察。" },
        { year: "2026 · 确立自主品牌", content: "正式确立「幸运无限」品牌，发布首款 Lucky Mini 3.7 英寸 AI 旗舰小手机与全新 Lucky OS 操作系统，启动全球出海战略，步入品牌化发展新纪元。" }
      ],

      strengths_eyebrow: "核心壁垒",
      strengths_title: "我们的四大核心优势",
      strengths_desc: "自研自造、务实经营，构筑长期可持续竞争力。",
      strengths_list: [
        { title: "1. 全链路能力", desc: "研发、生产、销售一体化，从工业设计到整机下线全程自主自控，品质自己把关，杜绝外包脱节。" },
        { title: "2. 坚持原创设计", desc: "拒绝流水线公模。坚持自主设计语言与东方美学点缀，做有鲜明辨识度与个性态度的科技潮品。" },
        { title: "3. 稳健合规经营", desc: "无负债经营、现金流稳健充沛。不盲目烧钱跟风，底盘健康扎实，值得渠道伙伴与消费者长期信赖。" },
        { title: "4. AI 技术先行", desc: "以端侧与云端大模型深度融合为核心引擎，首创实体 Lucky 快捷键硬件体验，持续打造智能化硬件新品。" }
      ],

      culture_eyebrow: "文化基石",
      culture_title: "企业文化与价值观",
      culture_desc: "以真诚与善意，凝聚每一位追求卓越的同行者。",
      culture_list: [
        { tag: "企业使命", title: "让幸运触手可及", desc: "围绕 AI 技术打造精致智能硬件产品，让尖端科技不再高冷复杂，让每一次交互都充满幸运与温度。" },
        { tag: "品牌价值观", title: "分享想法与喜悦", desc: "为用户带来更多幸运，也由衷鼓励用户分享独特的奇思妙想，共同探索并传递日常快乐与欣喜。" },
        { tag: "团队价值观", title: "平等、乐观与凝聚", desc: "倡导平等包容的工作氛围，以“为用户带来更多快乐、更多幸福”为团队最高凝聚力与评判准则。" },
        { tag: "品牌定位", title: "幸运数码开创者", desc: "AI 时代的幸运数码品牌。不仅交付硬件功能，更交付长久陪伴的情绪价值与生活幸福感。" }
      ],

      role_title: "我们的品牌角色",
      role_list: [
        { title: "消费者的朋友", desc: "以朋友的真诚身份分享好产品，拒绝冷冰冰的教导者与厂家姿态。" },
        { title: "敏锐的需求搜罗者", desc: "细致洞察现代人琐碎而真实的痛点，为你精挑细选“幸运之选”。" },
        { title: "品类认知塑造者", desc: "在用户心智中扎根「幸运数码」这一独树一帜的创新品类。" }
      ],
      vision_title: "我们的发展愿景",
      vision_list: [
        { title: "短期规划", desc: "专注打磨 Lucky Mini 核心旗舰小机，建立深刻差异化品牌认知。" },
        { title: "中期跃升", desc: "稳健拓展 8.68/10.1 英寸平板及智能快充配件，构建全场景硬件矩阵。" },
        { title: "长期布局", desc: "深耕海外广阔市场，依托 LUCK WHEAT 与独立站体系完成全球化品牌出海。" }
      ],

      certs_eyebrow: "合规与知识产权",
      certs_heading: "企业主体与合规资质",
      certs_desc: "合法合规经营，拥有中、美等全球核心市场商标与企业主体资质保障。",
      cert_license_img: "images/business-license.png",
      cert_cn_img: "images/trademark-cn.jpg",
      cert_us_img: "images/trademark-uspto.jpg",
      cert_trans_img: "images/trademark-transfer.png",
      certs_list: [
        { title: "企业营业执照", desc: "深圳市幸运无限科技有限公司", imgKey: "cert_license_img", defaultSrc: "images/business-license.png" },
        { title: "中国商标注册证", desc: "国家知识产权局核准注册", imgKey: "cert_cn_img", defaultSrc: "images/trademark-cn.jpg" },
        { title: "美国 USPTO 商标证", desc: "美国联邦专利商标局注册", imgKey: "cert_us_img", defaultSrc: "images/trademark-uspto.jpg" },
        { title: "商标转让核准证明", desc: "官方合规权属转移公告", imgKey: "cert_trans_img", defaultSrc: "images/trademark-transfer.png" }
      ]
    },

    // 8. 联系我们 (contact.html)
    contact: {
      banner_eyebrow: "Connect & Contact · 随时聆听",
      page_title: "说句话，我们听着",
      page_desc: "无论是产品体验建议、渠道分销合作、媒体深度采访还是售后工单，都可以直接找到对应的专职部门，享受敏捷高效的沟通回应。",
      hq_title: "公司信息与总部地址",
      company_name: "深圳市幸运无限科技有限公司",
      brand_naming: "LUCK WHEAT 幸运无限",
      hq_address: "广东省深圳市龙岗区坂田街道马安堂社区环城南路5号坂田国际中心E栋八层",
      service_hours: "周一至周六 09:00 - 18:00（法定节假日除外）",
      quick_support_title: "需要快速了解产品与售后？",
      quick_support_desc: "关于机型配件适配、保修退换货政策、Lucky OS 下载等常见问题，您可在服务支持页面获得即时解答。",
      form_title: "发送在线留言",
      form_desc: "填写您的联系方式与诉求，信息将直接分发给负责专员。",
      dept_eyebrow: "对接部门",
      dept_table_heading: "各业务线官方直达邮箱",
      dept_table_desc: "为确保沟通效率与信息安全，各业务线已设立专门对接部门与官方企业邮箱：",
      dept_rows: [
        { line: "品牌与市场合作", dept: "品牌部 (Brand Dept.)", hours: "周一至周五 09:00-18:00", email: "brand@lucky-infinite.com" },
        { line: "国内电商分销", dept: "渠道部 (Domestic Sales)", hours: "周一至周六 09:00-18:00", email: "sales@lucky-infinite.com" },
        { line: "跨境电商与海外出海", dept: "海外事业部 (Global Business)", hours: "全天候接收", email: "global@lucky-infinite.com" },
        { line: "线下数码渠道与专柜", dept: "零售渠道部 (Retail Dept.)", hours: "周一至周六 09:00-18:00", email: "retail@lucky-infinite.com" },
        { line: "售后技术支持与网点", dept: "售后部 (Support Dept.)", hours: "周一至周六 09:00-18:00", email: "support@lucky-infinite.com" },
        { line: "媒体推广与博主联合", dept: "品牌公关部 (PR & Media)", hours: "周一至周五 09:00-18:00", email: "press@lucky-infinite.com" }
      ]
    }
  },

  // 5. 客户线索 (首发预约与意向留言) 初始数据
  leads: [
    {
      id: "LEAD-20261116-01",
      name: "林晓峰",
      phone: "13800138000",
      email: "lin.xf@techoutlook.com",
      product: "Lucky Mini 3.7 英寸 (曜石黑)",
      date: "2026-11-16 14:32",
      status: "已确认",
      notes: "首发前1000名早鸟用户，咨询跨境发货事宜"
    },
    {
      id: "LEAD-20261116-02",
      name: "Sarah Jenkins",
      phone: "+1 415-555-2671",
      email: "sarah.j@siliconpulse.io",
      product: "Lucky Mini 3.7 英寸 + 机能伞绳",
      date: "2026-11-16 15:10",
      status: "待联系",
      notes: "海外北美独立站订单意向，希望优先体验 Lucky 键 AI 功能"
    },
    {
      id: "LEAD-20261116-03",
      name: "张诚",
      phone: "18612345678",
      email: "zc_digital@163.com",
      product: "LUCKY Tab 8.68 英寸平板",
      date: "2026-11-16 16:45",
      status: "待联系",
      notes: "数码博主测评样机意向申请"
    }
  ],

  // 6. 商业合作与代理申请数据
  partnerships: [
    {
      id: "BIZ-20261116-01",
      company: "深圳极客潮流数码商贸有限公司",
      contact: "王经理",
      phone: "13911223344",
      email: "b2b@geektrend.cn",
      channelType: "线下潮流专柜 / 潮玩集合店",
      region: "华南地区 (深圳/广州)",
      expectedVolume: "首批 200-500 台",
      date: "2026-11-16 11:20",
      status: "初审通过",
      notes: "已发送招商加盟画册及首批拿货阶梯价格表"
    },
    {
      id: "BIZ-20261116-02",
      company: "Apex Global Direct LLC",
      contact: "Marcus Vance",
      phone: "+1 650-322-8899",
      email: "procure@apex-direct.com",
      channelType: "跨境电商海外分销 (Amazon / 独立站)",
      region: "北美与欧洲市场",
      expectedVolume: "首批 1000 台起",
      date: "2026-11-16 13:05",
      status: "待跟进",
      notes: "需要 FCC / CE 认证证书与英文包装渲染物料"
    }
  ]
};
