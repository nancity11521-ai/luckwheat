/**
 * LUCK WHEAT 幸运无限 - 全站页面模块动态编辑器 Schema
 */
window.LUCK_PAGE_MODULES_SCHEMA = {
  index: [
    {
      title: '首屏轮播 1-3 按钮链接与标签微调',
      fields: [
        { key: 'hero_btn1_href', label: '幻灯片 1 主按钮链接', type: 'text' },
        { key: 'hero_btn2_href', label: '幻灯片 1 次按钮链接', type: 'text' },
        { key: 'hero_slide2_btn1', label: '幻灯片 2 主按钮文案', type: 'text' },
        { key: 'hero_slide2_btn1_href', label: '幻灯片 2 主按钮链接', type: 'text' },
        { key: 'hero_slide2_btn2', label: '幻灯片 2 次按钮文案', type: 'text' },
        { key: 'hero_slide2_btn2_href', label: '幻灯片 2 次按钮链接', type: 'text' },
        { key: 'hero_slide2_badge_left', label: '幻灯片 2 左下角徽章', type: 'text' },
        { key: 'hero_slide2_badge_right', label: '幻灯片 2 右下角徽章', type: 'text' },
        { key: 'hero_slide3_badge', label: '幻灯片 3 顶部徽章', type: 'text' },
        { key: 'hero_slide3_btn1', label: '幻灯片 3 主按钮文案', type: 'text' },
        { key: 'hero_slide3_btn1_href', label: '幻灯片 3 主按钮链接', type: 'text' },
        { key: 'hero_slide3_btn2', label: '幻灯片 3 次按钮文案', type: 'text' },
        { key: 'hero_slide3_btn2_href', label: '幻灯片 3 次按钮链接', type: 'text' },
        { key: 'hero_slide3_badge_left', label: '幻灯片 3 左下角徽章', type: 'text' },
        { key: 'hero_slide3_badge_right', label: '幻灯片 3 右下角徽章', type: 'text' }
      ]
    },
    {
      title: '品牌理念导语 & 产品矩阵区块标题',
      fields: [
        { key: 'concept_eyebrow', label: '品牌理念小标题 (Eyebrow)', type: 'text' },
        { key: 'products_eyebrow', label: '产品矩阵小标题 (Eyebrow)', type: 'text' },
        { key: 'products_title', label: '产品矩阵主标题', type: 'text' },
        { key: 'products_desc', label: '产品矩阵描述', type: 'textarea' }
      ]
    },
    {
      title: '核心体验 & Lucky 键仿真器文案',
      fields: [
        { key: 'exp_eyebrow', label: '核心体验小标题', type: 'text' },
        { key: 'exp_title', label: '核心体验主标题', type: 'text' },
        { key: 'exp_desc', label: '核心体验描述', type: 'textarea' },
        { key: 'exp_cards', label: '四大核心体验卡片', type: 'list', itemLabel: '体验卡片', fields: [
          { key: 'title', label: '卡片标题', type: 'text' },
          { key: 'desc', label: '卡片说明', type: 'textarea' }
        ]},
        { key: 'sim_title', label: '仿真器标题', type: 'text' },
        { key: 'sim_desc', label: '仿真器说明', type: 'textarea' },
        { key: 'sim_steps', label: '仿真器操作步骤', type: 'list', itemLabel: '步骤', fields: [
          { key: 'title', label: '步骤标题', type: 'text' },
          { key: 'desc', label: '步骤说明', type: 'textarea' }
        ]},
        { key: 'sim_tip', label: '仿真器底部提示', type: 'text' }
      ]
    },
    {
      title: '品牌发展路径 & 历程里程碑',
      fields: [
        { key: 'path_eyebrow', label: '发展路径小标题', type: 'text' },
        { key: 'path_title', label: '发展路径主标题', type: 'text' },
        { key: 'path_desc', label: '发展路径描述', type: 'textarea' },
        { key: 'path_cards', label: '三阶段发展路径卡片', type: 'list', itemLabel: '阶段卡片', fields: [
          { key: 'num', label: '编号 (如 01)', type: 'text' },
          { key: 'title', label: '阶段标题', type: 'text' },
          { key: 'desc', label: '阶段说明', type: 'textarea' }
        ]},
        { key: 'history_eyebrow', label: '品牌历程小标题', type: 'text' },
        { key: 'history_title', label: '品牌历程主标题', type: 'text' },
        { key: 'history_desc', label: '品牌历程描述', type: 'textarea' },
        { key: 'history_timeline', label: '首页历程时间轴', type: 'list', itemLabel: '历程节点', fields: [
          { key: 'year', label: '年份 / 时间', type: 'text' },
          { key: 'content', label: '里程碑事件', type: 'textarea' }
        ]},
        { key: 'history_insist_title', label: '核心坚持清单标题', type: 'text' },
        { key: 'history_insist_list', label: '核心坚持清单', type: 'list', itemLabel: '坚持项', fields: [
          { key: 'title', label: '标题', type: 'text' },
          { key: 'desc', label: '说明', type: 'textarea' }
        ]}
      ]
    },
    {
      title: '品牌动态标题 & 创作者手记 & 底部 CTA 链接',
      fields: [
        { key: 'news_eyebrow', label: '品牌动态小标题', type: 'text' },
        { key: 'news_title', label: '品牌动态主标题', type: 'text' },
        { key: 'news_desc', label: '品牌动态描述', type: 'textarea' },
        { key: 'opinion_eyebrow', label: '创作者手记小标题', type: 'text' },
        { key: 'opinion_title', label: '创作者手记标题', type: 'text' },
        { key: 'opinion_quote', label: '手记引文内容', type: 'textarea' },
        { key: 'opinion_author', label: '署名信息', type: 'text' },
        { key: 'cta_btn1_href', label: '底部 CTA 按钮 1 链接', type: 'text' },
        { key: 'cta_btn2_href', label: '底部 CTA 按钮 2 链接', type: 'text' }
      ]
    }
  ],
  products: [
    {
      title: '产品中心 · 顶部横幅与三大系列标题',
      fields: [
        { key: 'page_eyebrow', label: '顶部小标签 (Eyebrow)', type: 'text' },
        { key: 'phone_tag', label: '手机系列标签', type: 'text' },
        { key: 'phone_series_title', label: '手机系列标题', type: 'text' },
        { key: 'phone_series_desc', label: '手机系列描述', type: 'textarea' },
        { key: 'tablet_tag', label: '平板系列标签', type: 'text' },
        { key: 'tablet_series_title', label: '平板系列标题', type: 'text' },
        { key: 'tablet_series_desc', label: '平板系列描述', type: 'textarea' },
        { key: 'acc_tag', label: '配件系列标签', type: 'text' },
        { key: 'acc_series_title', label: '配件系列标题', type: 'text' },
        { key: 'acc_series_desc', label: '配件系列描述', type: 'textarea' }
      ]
    },
    {
      title: '产品研发哲学模块',
      fields: [
        { key: 'philosophy_eyebrow', label: '哲学区块小标题', type: 'text' },
        { key: 'philosophy_title', label: '哲学区块主标题', type: 'text' },
        { key: 'philosophy_desc', label: '哲学区块描述', type: 'textarea' },
        { key: 'philosophy_cards', label: '研发哲学卡片', type: 'list', itemLabel: '哲学卡片', fields: [
          { key: 'title', label: '标题', type: 'text' },
          { key: 'desc', label: '说明', type: 'textarea' }
        ]},
        { key: 'philosophy_quote', label: '底部品牌金句', type: 'text' }
      ]
    }
  ],
  lucky_mini: [
    {
      title: '顶部 Banner & 定价卡片文案与按钮',
      fields: [
        { key: 'banner_eyebrow', label: '顶部 Banner 小标签', type: 'text' },
        { key: 'banner_title', label: '顶部 Banner 主标题', type: 'text' },
        { key: 'banner_desc', label: '顶部 Banner 描述', type: 'textarea' },
        { key: 'price_label', label: '价格标签文字', type: 'text' },
        { key: 'promo_badge', label: '首发优惠徽章', type: 'text' },
        { key: 'buy_btn_text', label: '主购买按钮文案', type: 'text' },
        { key: 'buy_btn_href', label: '主购买按钮链接', type: 'text' },
        { key: 'b2b_btn_text', label: '渠道合作按钮文案', type: 'text' },
        { key: 'b2b_btn_href', label: '渠道合作按钮链接', type: 'text' }
      ]
    },
    {
      title: '核心能力卡片 & 适用人群',
      fields: [
        { key: 'features_eyebrow', label: '核心能力小标题', type: 'text' },
        { key: 'features_list', label: '核心能力卡片列表', type: 'list', itemLabel: '能力卡片', fields: [
          { key: 'title', label: '标题', type: 'text' },
          { key: 'desc', label: '说明', type: 'textarea' }
        ]},
        { key: 'audience_eyebrow', label: '适用人群小标题', type: 'text' },
        { key: 'audience_title', label: '适用人群主标题', type: 'text' },
        { key: 'audience_desc', label: '适用人群描述', type: 'textarea' },
        { key: 'audience_list', label: '适用人群卡片列表', type: 'list', itemLabel: '人群卡片', fields: [
          { key: 'tag', label: '人群标签', type: 'text' },
          { key: 'title', label: '标题', type: 'text' },
          { key: 'desc', label: '说明', type: 'textarea' }
        ]}
      ]
    },
    {
      title: '规格参数表 & 配件生态 & 相关推荐',
      fields: [
        { key: 'specs_eyebrow', label: '规格表小标题', type: 'text' },
        { key: 'specs_title', label: '规格表主标题', type: 'text' },
        { key: 'specs_desc', label: '规格表描述', type: 'textarea' },
        { key: 'specs_caption', label: '规格表 Caption 说明', type: 'text' },
        { key: 'specs_rows', label: '硬件规格参数行', type: 'list', itemLabel: '参数行', fields: [
          { key: 'label', label: '参数项', type: 'text' },
          { key: 'val', label: '参数值', type: 'text' }
        ]},
        { key: 'acc_eyebrow', label: '配套生态小标题', type: 'text' },
        { key: 'acc_title', label: '配套生态主标题', type: 'text' },
        { key: 'acc_desc', label: '配套生态描述', type: 'textarea' },
        { key: 'acc_list', label: '配套生态卡片列表', type: 'list', itemLabel: '配件卡片', fields: [
          { key: 'title', label: '标题', type: 'text' },
          { key: 'desc', label: '说明', type: 'textarea' }
        ]},
        { key: 'related_title', label: '底部相关产品标题', type: 'text' },
        { key: 'related_desc', label: '底部相关产品描述', type: 'textarea' },
        { key: 'related_btn_text', label: '底部相关产品按钮文案', type: 'text' },
        { key: 'related_btn_href', label: '底部相关产品按钮链接', type: 'text' }
      ]
    }
  ],
  support: [
    {
      title: '顶部 Banner & Lucky OS 升级适配表',
      fields: [
        { key: 'banner_eyebrow', label: '顶部 Banner 小标签', type: 'text' },
        { key: 'os_desc', label: 'Lucky OS 模块说明', type: 'textarea' },
        { key: 'os_rows', label: '设备系统适配列表', type: 'list', itemLabel: '设备行', fields: [
          { key: 'name', label: '硬件名称', type: 'text' },
          { key: 'sys', label: '底层系统', type: 'text' },
          { key: 'status', label: '升级状态', type: 'text' },
          { key: 'statusType', label: '状态样式 (live / pending)', type: 'text' },
          { key: 'way', label: '获取方式', type: 'text' }
        ]},
        { key: 'os_note', label: 'Lucky OS 底部补充说明', type: 'textarea' }
      ]
    },
    {
      title: '保修政策 & 配件兼容性表 & 常见问题 FAQ',
      fields: [
        { key: 'warranty_desc', label: '保修政策描述', type: 'textarea' },
        { key: 'warranty_cards', label: '保修政策卡片', type: 'list', itemLabel: '政策卡片', fields: [
          { key: 'badge', label: '顶部徽章', type: 'text' },
          { key: 'badgeType', label: '徽章样式 (live / subtle / pending)', type: 'text' },
          { key: 'title', label: '政策标题', type: 'text' },
          { key: 'desc', label: '政策内容', type: 'textarea' }
        ]},
        { key: 'compat_heading', label: '配件兼容性标题', type: 'text' },
        { key: 'compat_desc', label: '配件兼容性描述', type: 'textarea' },
        { key: 'compat_rows', label: '配件兼容性行', type: 'list', itemLabel: '兼容行', fields: [
          { key: 'cat', label: '配件品类', type: 'text' },
          { key: 'level', label: '兼容级别', type: 'text' },
          { key: 'levelType', label: '样式 (live / pending)', type: 'text' },
          { key: 'tip', label: '说明与提示', type: 'textarea' }
        ]},
        { key: 'faq_eyebrow', label: 'FAQ 小标题', type: 'text' },
        { key: 'faq_desc', label: 'FAQ 模块描述', type: 'textarea' },
        { key: 'faq_list', label: '常见问题 FAQ 列表', type: 'list', itemLabel: '问答条目', fields: [
          { key: 'q', label: '问题 (Q)', type: 'text' },
          { key: 'a', label: '解答 (A)', type: 'textarea' }
        ]}
      ]
    }
  ],
  channels: [
    {
      title: '购买渠道卡片矩阵 & 政策说明 & 咨询表单文案',
      fields: [
        { key: 'banner_eyebrow', label: '顶部 Banner 小标签', type: 'text' },
        { key: 'channel_cards', label: '购买渠道矩阵卡片 (共 6 位，支持增删)', type: 'list', itemLabel: '渠道卡片', fields: [
          { key: 'badge', label: '渠道标签', type: 'text' },
          { key: 'badgeType', label: '样式 (live / subtle / pending)', type: 'text' },
          { key: 'title', label: '渠道标题', type: 'text' },
          { key: 'desc', label: '渠道说明', type: 'textarea' }
        ]},
        { key: 'policy_desc', label: '渠道政策描述', type: 'textarea' },
        { key: 'policy_rows', label: '渠道政策参数行', type: 'list', itemLabel: '政策行', fields: [
          { key: 'label', label: '政策条目', type: 'text' },
          { key: 'val', label: '政策详情', type: 'textarea' }
        ]},
        { key: 'form_eyebrow', label: '咨询表单小标题', type: 'text' },
        { key: 'form_desc', label: '咨询表单描述', type: 'textarea' }
      ]
    }
  ],
  partners: [
    {
      title: '合作方向 & 赋能支持 & 合作流程 & 申请文案',
      fields: [
        { key: 'banner_eyebrow', label: '顶部 Banner 小标签', type: 'text' },
        { key: 'partner_directions', label: '三大合作方向卡片', type: 'list', itemLabel: '合作方向', fields: [
          { key: 'title', label: '标题', type: 'text' },
          { key: 'desc', label: '说明', type: 'textarea' }
        ]},
        { key: 'support_eyebrow', label: '赋能支持小标题', type: 'text' },
        { key: 'support_desc', label: '赋能支持描述', type: 'textarea' },
        { key: 'support_cards', label: '赋能支持卡片', type: 'list', itemLabel: '支持卡片', fields: [
          { key: 'title', label: '标题', type: 'text' },
          { key: 'desc', label: '说明', type: 'textarea' }
        ]},
        { key: 'steps_eyebrow', label: '合作流程小标题', type: 'text' },
        { key: 'steps_desc', label: '合作流程描述', type: 'textarea' },
        { key: 'steps_list', label: '合作四阶段卡片', type: 'list', itemLabel: '阶段', fields: [
          { key: 'step', label: '阶段号 (如 STEP 01)', type: 'text' },
          { key: 'title', label: '阶段标题', type: 'text' },
          { key: 'desc', label: '阶段说明', type: 'textarea' }
        ]},
        { key: 'apply_eyebrow', label: '申请表单小标题', type: 'text' },
        { key: 'apply_desc', label: '申请表单描述', type: 'textarea' }
      ]
    }
  ],
  about: [
    {
      title: '品牌故事引言 & 全球化主体布局',
      fields: [
        { key: 'banner_eyebrow', label: '顶部 Banner 小标签', type: 'text' },
        { key: 'intro_badge', label: '品牌定位徽章', type: 'text' },
        { key: 'intro_quote', label: '核心品牌引语', type: 'text' },
        { key: 'intro_p1', label: '品牌简介第一段', type: 'textarea' },
        { key: 'intro_p2', label: '品牌简介第二段', type: 'textarea' },
        { key: 'global_title', label: '全球架构标题', type: 'text' },
        { key: 'global_domestic_tag', label: '国内主体标签', type: 'text' },
        { key: 'global_domestic_name', label: '国内主体名称', type: 'text' },
        { key: 'global_domestic_desc', label: '国内主体说明', type: 'textarea' },
        { key: 'global_overseas_tag', label: '海外主体标签', type: 'text' },
        { key: 'global_overseas_name', label: '海外主体名称', type: 'text' },
        { key: 'global_overseas_desc', label: '海外主体说明', type: 'textarea' }
      ]
    },
    {
      title: '成长历程时间轴 & 核心优势 & 企业文化',
      fields: [
        { key: 'timeline_eyebrow', label: '历程小标题', type: 'text' },
        { key: 'timeline_desc', label: '历程描述', type: 'textarea' },
        { key: 'timeline_list', label: '成长历程节点', type: 'list', itemLabel: '节点', fields: [
          { key: 'year', label: '时间', type: 'text' },
          { key: 'content', label: '事件内容', type: 'textarea' }
        ]},
        { key: 'strengths_eyebrow', label: '核心优势小标题', type: 'text' },
        { key: 'strengths_desc', label: '核心优势描述', type: 'textarea' },
        { key: 'strengths_list', label: '四大核心优势卡片', type: 'list', itemLabel: '优势卡片', fields: [
          { key: 'title', label: '标题', type: 'text' },
          { key: 'desc', label: '说明', type: 'textarea' }
        ]},
        { key: 'culture_eyebrow', label: '企业文化小标题', type: 'text' },
        { key: 'culture_desc', label: '企业文化描述', type: 'textarea' },
        { key: 'culture_list', label: '四大文化价值观卡片', type: 'list', itemLabel: '文化卡片', fields: [
          { key: 'tag', label: '价值观标签', type: 'text' },
          { key: 'title', label: '标题', type: 'text' },
          { key: 'desc', label: '说明', type: 'textarea' }
        ]}
      ]
    },
    {
      title: '行业角色 & 未来愿景 & 资质证照列表',
      fields: [
        { key: 'role_title', label: '行业定位标题', type: 'text' },
        { key: 'role_list', label: '行业定位列表', type: 'list', itemLabel: '定位项', fields: [
          { key: 'title', label: '标题', type: 'text' },
          { key: 'desc', label: '说明', type: 'textarea' }
        ]},
        { key: 'vision_title', label: '未来愿景标题', type: 'text' },
        { key: 'vision_list', label: '未来愿景列表', type: 'list', itemLabel: '愿景项', fields: [
          { key: 'title', label: '标题', type: 'text' },
          { key: 'desc', label: '说明', type: 'textarea' }
        ]},
        { key: 'certs_eyebrow', label: '资质证照小标题', type: 'text' },
        { key: 'certs_heading', label: '资质证照主标题', type: 'text' },
        { key: 'certs_desc', label: '资质证照描述', type: 'textarea' },
        { key: 'certs_list', label: '资质证照卡片清单', type: 'list', itemLabel: '证照卡片', fields: [
          { key: 'title', label: '证照名称', type: 'text' },
          { key: 'desc', label: '证照说明', type: 'text' },
          { key: 'imgKey', label: '关联CMS图Key', type: 'text' },
          { key: 'defaultSrc', label: '默认图片路径', type: 'text' }
        ]}
      ]
    }
  ],
  contact: [
    {
      title: '总部详情 & 在线表单文案 & 业务线邮箱表',
      fields: [
        { key: 'banner_eyebrow', label: '顶部 Banner 小标签', type: 'text' },
        { key: 'company_name', label: '公司主体全称', type: 'text' },
        { key: 'brand_naming', label: '品牌中英文名称标注', type: 'text' },
        { key: 'service_hours', label: '客服接待时间', type: 'text' },
        { key: 'quick_support_title', label: '快捷支持卡片标题', type: 'text' },
        { key: 'quick_support_desc', label: '快捷支持卡片说明', type: 'textarea' },
        { key: 'form_title', label: '留言表单标题', type: 'text' },
        { key: 'form_desc', label: '留言表单描述', type: 'textarea' },
        { key: 'dept_eyebrow', label: '业务线矩阵小标题', type: 'text' },
        { key: 'dept_table_desc', label: '业务线矩阵描述', type: 'textarea' },
        { key: 'dept_rows', label: '业务线官方邮箱列表', type: 'list', itemLabel: '业务线', fields: [
          { key: 'line', label: '业务线名称', type: 'text' },
          { key: 'dept', label: '负责部门', type: 'text' },
          { key: 'hours', label: '响应时间', type: 'text' },
          { key: 'email', label: '官方邮箱', type: 'text' }
        ]}
      ]
    }
  ],
  global: [
    {
      title: '全站页脚栏目与链接管理 (Footer Columns)',
      fields: [
        { key: 'footerColumns', label: '页脚分类导航栏目 (默认 4 栏，支持增删)', type: 'nested_list', itemLabel: '页脚栏目', subKey: 'links', subLabel: '栏目链接', fields: [
          { key: 'title', label: '栏目标题', type: 'text' }
        ], subFields: [
          { key: 'label', label: '链接文字', type: 'text' },
          { key: 'href', label: '跳转地址', type: 'text' }
        ]}
      ]
    }
  ]
};
