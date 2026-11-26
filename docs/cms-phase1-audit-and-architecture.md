# LUCK WHEAT 幸运无限 · 官网升级真实 CMS 阶段 1 审计与架构方案报告

> 文档编号：LW-CMS-PHASE1-20261116  
> 状态：阶段 1 完成（等待用户确认决策）  
> 依据标准：`/Users/onegoogle/Downloads/luckwheat-cms-brief.md`

---

## 一、项目现状审计与复核

根据对代码库的逐行审计：
- **前台页面**：全站共 8 个正式 HTML 页面（`index.html`、`products.html`、`lucky-mini.html`、`support.html`、`channels.html`、`partners.html`、`about.html`、`contact.html`）；
- **样式资源**：`css/style.css` 包含完整的 Apple 极简与机能美学视觉体系，前台 DOM 树及交互必须 100% 保持；
- **旧方案痛点确认**：
  1. 内容仅存保在浏览器 `localStorage`，无法跨设备与访客同步；
  2. 登录凭证明文写在前端源码中；
  3. `cms-bridge.js` 采用客户端 DOM 选择器动态打补丁，改动结构易失效，且不利于搜索引擎服务端抓取；
  4. 轮播、产品、时间线、问答列表项均为写死的静态 HTML 结构，无法增删改排；
  5. 客户表单通过 `setTimeout` 假提交，商机线索无法真正入库。

---

## 二、全站《内容清单》表格 (8大正式页面 + 全站公共)

### 1. 全站公共信息 (Global Settings)
| 区块 | 字段名 (Field Key) | 字段类型 | 当前值示例 | 是否必填 | 可增删排序列表 | 说明 |
|---|---|---|---|---|---|---|
| 品牌资产 | `brandCn` | 文本 (Text) | `幸运无限` | 是 | 否 | 中文品牌名 |
| 品牌资产 | `brandEn` | 文本 (Text) | `LUCK WHEAT` | 是 | 否 | 英文品牌名 |
| 品牌资产 | `slogan` | 文本 (Text) | `拥有它，就拥有幸运` | 是 | 否 | 核心标语 |
| 品牌资产 | `logo` | 媒体图片 (Media) | `images/logo.png` 或 SVG | 是 | 否 | 网站主 Logo |
| 品牌资产 | `favicon` | 媒体图片 (Media) | `favicon.ico` | 是 | 否 | 浏览器标签图标 |
| 导航菜单 | `navItems` | 嵌套列表 (Array) | `[{label:"首页", link:"index.html"}, ...]` | 是 | 是 | 顶部导航链接列表 |
| 导航动作 | `headerCtaText` | 文本 (Text) | `预约 Lucky Mini` | 是 | 否 | 顶部高亮 CTA 按钮文字 |
| 导航动作 | `headerCtaLink` | 文本 (Text) | `lucky-mini.html` | 是 | 否 | 顶部高亮 CTA 跳转链接 |
| 页脚通用 | `footerDesc` | 文本 (Text) | `AI 时代的幸运数码品牌。国内「幸运无限」，海外「LUCK WHEAT」。` | 是 | 否 | 页脚品牌简介 |
| 页脚通用 | `serviceHours` | 文本 (Text) | `周一至周六 09:00 - 18:00` | 是 | 否 | 客服服务时间 |
| 页脚通用 | `contactEmail` | 邮箱 (Email) | `support@lucky-infinite.com` | 是 | 否 | 售后技术邮箱 |
| 页脚通用 | `b2bEmail` | 邮箱 (Email) | `sales@lucky-infinite.com` | 是 | 否 | 商务合作邮箱 |
| 页脚通用 | `footerNavCols` | 嵌套列表 (Array) | 4 个分类列及链接条目 | 是 | 是 | 产品中心/服务支持/商业合作/关于 |
| 资质备案 | `copyright` | 文本 (Text) | `© 2026 深圳市幸运无限科技有限公司 版权所有` | 是 | 否 | 版权归属 |
| 资质备案 | `icpNumber` | 文本 (Text) | `粤ICP备2026102601号-1` | 是 | 否 | 工信部 ICP 备案号 |
| 资质备案 | `icpLink` | 链接 (URL) | `http://beian.miit.gov.cn` | 是 | 否 | 工信部查验直链 |
| 站点域名 | `canonicalBase` | 链接 (URL) | `https://lucky-infinite.com` | 是 | 否 | 生产环境标准规范域名 |
| 站长验证 | `baiduVerify` | 文本 (Text) | `""` | 否 | 否 | 百度站长验证代码 |
| 站长验证 | `googleVerify`| 文本 (Text) | `""` | 否 | 否 | Google 搜索控制台验证码 |

---

### 2. 官方首页 (`index.html`)
| 区块 | 字段名 (Field Key) | 字段类型 | 当前值示例 | 是否必填 | 可增删排序列表 | 说明 |
|---|---|---|---|---|---|---|
| **首屏 Hero 轮播** | `heroSlides` | 集合列表 (Array) | 目前为 3 项 | 是 | **是 (可增删排序)** | 首页全景轮播项 |
| └ 轮播单项 | `heroSlides[i].badge` | 文本 (Text) | `AI 时代的旗舰小手机` | 否 | 否 | 顶部小标签 |
| └ 轮播单项 | `heroSlides[i].title` | 文本 (Text) | `Lucky Mini 3.7"` | 是 | 否 | 大标题（Apple 渐变） |
| └ 轮播单项 | `heroSlides[i].subtitle` | 文本 (Text) | `拥有它，就拥有幸运。` | 是 | 否 | 副标语 |
| └ 轮播单项 | `heroSlides[i].btn1Text` | 文本 (Text) | `进一步了解 Lucky Mini >` | 否 | 否 | 主按钮文案 |
| └ 轮播单项 | `heroSlides[i].btn1Link` | 链接 (Text) | `lucky-mini.html` | 否 | 否 | 主按钮链接 |
| └ 轮播单项 | `heroSlides[i].btn2Text` | 文本 (Text) | `立即预约首发 >` | 否 | 否 | 次按钮文案 |
| └ 轮播单项 | `heroSlides[i].btn2Link` | 链接 (Text) | `products.html` | 否 | 否 | 次按钮链接 |
| └ 轮播单项 | `heroSlides[i].badgeLeft` | 文本 (Text) | `0.2s 直达专属 AI · 实体微动 Lucky 键` | 否 | 否 | 左下浮动徽章文案 |
| └ 轮播单项 | `heroSlides[i].badgeRight` | 文本 (Text) | `CNC 钛金精工中框 · ￥1999 起` | 否 | 否 | 右下浮动徽章文案 |
| └ 轮播单项 | `heroSlides[i].bgImage` | 媒体图片 (Media) | `images/hero_banner_lucky_mini.jpg` | 是 | 否 | 1920×1080 轮播大图 |
| └ 轮播单项 | `heroSlides[i].isActive` | 开关 (Boolean) | `true` | 是 | 否 | 是否启用显示 |
| **核心数据条** | `statsBanner` | 列表 (Array) | 4 项 | 是 | **是 (可增删排序)** | 首页极简度量条 |
| └ 数据单项 | `statsBanner[i].number` | 文本 (Text) | `3.7 英寸` | 是 | 否 | 重点数值或特性 |
| └ 数据单项 | `statsBanner[i].label` | 文本 (Text) | `旗舰小手机尺寸 · 掌心可握` | 是 | 否 | 数值下方阐释 |
| **品牌理念** | `conceptEyebrow` | 文本 (Text) | `品牌理念` | 否 | 否 | 小标题 |
| **品牌理念** | `conceptTitle` | 文本 (Text) | `拥有它，就拥有幸运` | 是 | 否 | 渐变大标题 |
| **品牌理念** | `conceptDesc` | 多行文本 (Textarea) | `我们不是"别人有、我也有"的生产厂家...` | 是 | 否 | 核心长段落阐述 |
| **品牌理念** | `conceptCards` | 列表 (Array) | 3 项 | 是 | **是 (可增删排序)** | 理念三卡片 |
| └ 理念单项 | `conceptCards[i].icon` | 图标/SVG/图片 | SVG 矢量图 | 是 | 否 | 卡片图标 |
| └ 理念单项 | `conceptCards[i].title` | 文本 (Text) | `有趣的灵魂，百里挑一` | 是 | 否 | 卡片标题 |
| └ 理念单项 | `conceptCards[i].desc` | 多行文本 (Textarea) | `我们为用户带来更多幸运，也鼓励用户分享想法...` | 是 | 否 | 卡片内容 |
| **产品矩阵导言** | `prodEyebrow` | 文本 (Text) | `产品矩阵` | 否 | 否 | 小标题 |
| **产品矩阵导言** | `prodTitle` | 文本 (Text) | `每一款，都是幸运之选` | 是 | 否 | 大标题 |
| **产品矩阵导言** | `prodDesc` | 文本 (Text) | `以 Lucky Mini 为核心旗舰，平板与智能配件持续补充覆盖。` | 是 | 否 | 导言说明 |
| **底部合作 CTA** | `ctaTitle` | 文本 (Text) | `下一个幸运，也许由你带来` | 是 | 否 | 大卡片标题 |
| **底部合作 CTA** | `ctaDesc` | 多行文本 (Textarea) | `我们正在寻找电商分销、线下渠道、售后服务...` | 是 | 否 | 招募说明 |
| **底部合作 CTA** | `ctaBtn1Text` | 文本 (Text) | `查看合作方式` | 否 | 否 | 按钮 1 文案 |
| **底部合作 CTA** | `ctaBtn1Link` | 链接 (Text) | `partners.html` | 否 | 否 | 按钮 1 链接 |
| **底部合作 CTA** | `ctaBtn2Text` | 文本 (Text) | `直接联系我们` | 否 | 否 | 按钮 2 文案 |
| **底部合作 CTA** | `ctaBtn2Link` | 链接 (Text) | `contact.html` | 否 | 否 | 按钮 2 链接 |

---

### 3. 产品中心 (`products.html`)
> 本页面核心为 **「产品集合 (Products Collection)」**，支持任意新增、删除、排序、上下架。

| 区块 | 字段名 (Field Key) | 字段类型 | 当前值示例 | 是否必填 | 可增删排序列表 | 说明 |
|---|---|---|---|---|---|---|
| 页头引言 | `headerTitle` | 文本 (Text) | `每一样，都是幸运之选` | 是 | 否 | 页面彩虹渐变大标题 |
| 页头引言 | `headerDesc` | 多行文本 (Textarea) | `探索幸运无限三大核心产品矩阵：按系列分层陈列...` | 是 | 否 | 引导语 |
| 产品系列类别 | `categories` | 列表 (Array) | `[智能手机系列, 随身平板系列, 精工配件系列]` | 是 | **是 (可增删排序)** | 顶部分类筛选标签 |
| **产品集合项** | `productItem` | 独立集合模型 (Collection) | `Lucky Mini 3.7"` 等 | 是 | **是 (核心集合)** | 每一个实体产品 |
| └ 产品属性 | `name` | 文本 (Text) | `Lucky Mini 3.7 英寸` | 是 | 否 | 产品名称 |
| └ 产品属性 | `category` | 关联/下拉 (Relation) | `智能手机系列` | 是 | 否 | 所属分类 |
| └ 产品属性 | `subtitle` | 文本 (Text) | `拥有它，就拥有幸运。` | 否 | 否 | 产品副标语 |
| └ 产品属性 | `badge` | 文本 (Text) | `核心旗舰 · AI` | 否 | 否 | 状态徽标 |
| └ 产品属性 | `status` | 下拉 (Select) | `在售 / 首发预约 / 即将上市 / 敬请期待` | 是 | 否 | 销售状态 |
| └ 产品属性 | `price` | 文本 (Text) | `$299` | 否 | 否 | 售价 |
| └ 产品属性 | `priceSub` | 文本 (Text) | `约 ¥1999 / 首发前1000名优惠` | 否 | 否 | 价格换算或优惠说明 |
| └ 产品属性 | `coverImage` | 媒体图片 (Media) | `images/showcase_lucky_mini.jpg` | 是 | 否 | 展台主实拍图 |
| └ 产品属性 | `gallery` | 媒体图片多选 (Array) | 多角度实拍图集 | 否 | 是 | 产品详情图集 |
| └ 产品属性 | `shortDesc` | 多行文本 (Textarea) | `掌心黄金尺寸的完整安卓智能小机。专属 Lucky 物理微动按键...` | 是 | 否 | 卡片简述 |
| └ 产品属性 | `featuresList` | 字符串列表 (Array) | `["尺寸比例与主流旗舰一致", "专属 Lucky 键"]` | 否 | 是 | 核心卖点勾选项列表 |
| └ 产品属性 | `detailSpecs` | 键值列表 (Array) | `[{key:"屏幕", val:"3.7寸 AMOLED"}, ...]` | 否 | 是 | 详情弹窗规格参数表 |
| └ 产品属性 | `ctaText` | 文本 (Text) | `查看详情 / 预约首发` | 否 | 否 | 按钮文案 |
| └ 产品属性 | `ctaLink` | 链接 (Text) | `lucky-mini.html` | 否 | 否 | 跳转链接 |
| └ 产品属性 | `sortOrder` | 数字 (Number) | `1` | 是 | 否 | 排序权重 |

---

### 4. Lucky Mini 旗舰页 (`lucky-mini.html`)
| 区块 | 字段名 (Field Key) | 字段类型 | 当前值示例 | 是否必填 | 可增删排序列表 | 说明 |
|---|---|---|---|---|---|---|
| 首屏展示 | `flagshipBadge` | 文本 (Text) | `核心旗舰品 · 首发亮相` | 否 | 否 | 顶部发光微标 |
| 首屏展示 | `flagshipTitle` | 文本 (Text) | `Lucky Mini 3.7 英寸` | 是 | 否 | 旗舰大标题 |
| 首屏展示 | `flagshipSub` | 文本 (Text) | `巴掌大小的完整安卓 AI 智能小机。尺寸比例与主流旗舰一致...` | 是 | 否 | 导言标语 |
| 首屏展示 | `flagshipDesc` | 多行文本 (Textarea) | `Lucky Mini 是幸运无限的第一款核心旗舰产品...` | 是 | 否 | 长篇设计哲学阐述 |
| 首屏展示 | `flagshipImage` | 媒体图片 (Media) | `images/showcase_lucky_mini.jpg` | 是 | 否 | 旗舰真机质感大图 |
| 定价卡片 | `priceUsd` | 文本 (Text) | `$299` | 是 | 否 | 海外官方定价 |
| 定价卡片 | `priceCnySub` | 文本 (Text) | `约 ¥1999 RMB / 约 4 万余日元` | 是 | 否 | 换算参考说明 |
| 定价卡片 | `promoBanner` | 文本 (Text) | `🔥 首发活动：前 1000 名下单用户可享限时优惠礼包与优先交付...` | 否 | 否 | 促销激励文案 |
| 定价卡片 | `btn1Text` | 文本 (Text) | `预约首发 / 购买渠道` | 否 | 否 | 主预约动作按钮 |
| 定价卡片 | `btn1Link` | 链接 (Text) | `channels.html` | 否 | 否 | 跳转渠道 |
| 定价卡片 | `btn2Text` | 文本 (Text) | `联系商务合作` | 否 | 否 | 商务对接按钮 |
| 核心亮点 | `featuresTitle` | 文本 (Text) | `五大核心能力，为日常而生` | 是 | 否 | 亮点区大标题 |
| 核心亮点 | `featuresDesc` | 文本 (Text) | `不止于小巧，更拥有完整智慧与全能生态体验。` | 否 | 否 | 亮点区导言 |
| 核心亮点 | `featureList` | 列表 (Array) | 5 项 | 是 | **是 (可增删排序)** | 五大亮点特性 |
| └ 亮点单项 | `featureList[i].title` | 文本 (Text) | `1. AI 拍照 / AI 拍学` | 是 | 否 | 亮点标题 |
| └ 亮点单项 | `featureList[i].desc` | 多行文本 (Textarea) | `搭载高清微距与广角模组，一键拍照识别问答...` | 是 | 否 | 亮点阐释 |
| 硬件规格表 | `specsTable` | 键值分类列表 (Array) | 处理器/屏幕/内存/相机/电池/重量等 | 是 | **是 (可增删排序)** | 工业级参数表 |

---

### 5. 服务支持 (`support.html`)
| 区块 | 字段名 (Field Key) | 字段类型 | 当前值示例 | 是否必填 | 可增删排序列表 | 说明 |
|---|---|---|---|---|---|---|
| 页头引言 | `pageTitle` | 文本 (Text) | `用得顺手，才算服务到位` | 是 | 否 | 页面大标题 |
| 页头引言 | `pageDesc` | 多行文本 (Textarea) | `LUCK WHEAT 幸运无限官方服务支持中心...` | 是 | 否 | 引言描述 |
| 软件生态 | `osHeading` | 文本 (Text) | `Lucky OS 系统与软件生态` | 是 | 否 | 系统板块标题 |
| 软件生态 | `osDesc` | 富文本 (RichText) | 纯净极简端侧大模型系统特点介绍 | 否 | 否 | 详细介绍 |
| 售后政策 | `warrantyHeading` | 文本 (Text) | `官方保修与售后政策` | 是 | 否 | 政策大标题 |
| 售后政策 | `warrantyCards` | 列表 (Array) | 6 项 | 是 | **是 (可增删排序)** | 12个月质保/免费维修/换新等 |
| └ 政策单项 | `warrantyCards[i].title` | 文本 (Text) | `12 个月主机质保` | 是 | 否 | 政策项名称 |
| └ 政策单项 | `warrantyCards[i].desc` | 多行文本 (Textarea) | 细则说明 | 是 | 否 | 政策项条款内容 |
| 适配查询 | `compatHeading` | 文本 (Text) | `配件适配查询` | 是 | 否 | 板块标题 |
| 适配查询 | `compatItems` | 列表 (Array) | 手机壳/膜/伞绳兼容性条目 | 否 | **是 (可增删排序)** | 适配列表 |
| **常见问答 FAQ** | `faqHeading` | 文本 (Text) | `常见问题（FAQ）` | 是 | 否 | FAQ 标题 |
| **常见问答 FAQ** | `faqItems` | 集合列表 (Array) | 5 项 | 是 | **是 (可增删排序)** | 折叠问答列表 |
| └ FAQ 单项 | `faqItems[i].question` | 文本 (Text) | `Lucky Mini 配件与保护壳好买吗？` | 是 | 否 | 用户痛点问题 |
| └ FAQ 单项 | `faqItems[i].answer` | 富文本 (RichText) | `尺寸比例与主流旗舰一致，配件通用...` | 是 | 否 | 官方权威解答 |
| 客户热线通道 | `hotline` | 文本 (Text) | `400-888-2026` | 否 | 否 | 400 服务电话 |

---

### 6. 购买渠道 (`channels.html`)
| 区块 | 字段名 (Field Key) | 字段类型 | 当前值示例 | 是否必填 | 可增删排序列表 | 说明 |
|---|---|---|---|---|---|---|
| 页头引言 | `pageTitle` | 文本 (Text) | `去有幸运的地方` | 是 | 否 | 页面大标题 |
| 页头引言 | `pageDesc` | 多行文本 (Textarea) | `探索 LUCK WHEAT 幸运无限线上官方直营独立站...` | 是 | 否 | 引言描述 |
| 渠道列表 | `channelCards` | 集合列表 (Array) | 6 个渠道 | 是 | **是 (可增删排序)** | 线上与线下渠道卡片 |
| └ 渠道单项 | `channelCards[i].title` | 文本 (Text) | `官方独立站（海外首发）` | 是 | 否 | 渠道名称 |
| └ 渠道单项 | `channelCards[i].desc` | 多行文本 (Textarea) | `全球直邮，首发早鸟优惠...` | 是 | 否 | 渠道优势与特点 |
| └ 渠道单项 | `channelCards[i].badge` | 文本 (Text) | `海外首发 / 正品保障` | 否 | 否 | 标签 |
| └ 渠道单项 | `channelCards[i].link` | 链接 (Text) | 直达购买链接或预约链接 | 否 | 否 | 链接 |
| 渠道政策 | `policyHeading` | 文本 (Text) | `批发与分销渠道政策` | 是 | 否 | 政策大标题 |
| 渠道政策 | `policyPoints` | 列表 (Array) | 阶梯价格/物料支持/售后退换 | 是 | **是 (可增删排序)** | 政策要点列表 |
| 意向咨询表单 | `formHeading` | 文本 (Text) | `渠道与批量采购意向咨询` | 是 | 否 | 表单引导标题 |
| 意向咨询表单 | `formDesc` | 文本 (Text) | 表单填写提示文案 | 否 | 否 | 提示信息 |

---

### 7. 合作代理 (`partners.html`)
| 区块 | 字段名 (Field Key) | 字段类型 | 当前值示例 | 是否必填 | 可增删排序列表 | 说明 |
|---|---|---|---|---|---|---|
| 页头引言 | `pageTitle` | 文本 (Text) | `一起做点有幸运的事` | 是 | 否 | 页面大标题 |
| 页头引言 | `pageDesc` | 多行文本 (Textarea) | `面向全球招募电商分销、海外跨境、线下数码数码专柜...` | 是 | 否 | 引言描述 |
| 合作模式 | `partnerModels` | 列表 (Array) | 6 种合作模式 | 是 | **是 (可增删排序)** | 电商分销/跨境/线下专柜等 |
| 赋能支持 | `supportHeading`| 文本 (Text) | `我们给伙伴带来什么？` | 是 | 否 | 板块标题 |
| 赋能支持 | `supportCards` | 列表 (Array) | 5 项 | 是 | **是 (可增删排序)** | 卓越产品力/丰富内容力/稳健供应链等 |
| 发展阶段 | `stepsHeading` | 文本 (Text) | `成为伙伴的四个阶段` | 是 | 否 | 流程标题 |
| 发展阶段 | `stepsList` | 列表 (Array) | 4 步 | 是 | **是 (可增删排序)** | 提交意向 → 商务沟通 → 物料下发 → 正式开展 |
| 代理申请表单 | `applyHeading` | 文本 (Text) | `代理合作申请表单` | 是 | 否 | 表单标题 |
| 代理申请表单 | `applyTypes` | 下拉选项列表 (Array)| `[线下专柜加盟, 跨境分销合作, 企业采购定制, 其他]` | 是 | 是 | 申请表单合作类型下拉选项 |

---

### 8. 关于我们 (`about.html`)
| 区块 | 字段名 (Field Key) | 字段类型 | 当前值示例 | 是否必填 | 可增删排序列表 | 说明 |
|---|---|---|---|---|---|---|
| 页头引言 | `pageTitle` | 文本 (Text) | `我们的由来，和我们的方向` | 是 | 否 | 页面大标题 |
| 页头引言 | `pageDesc` | 多行文本 (Textarea) | `了解 LUCK WHEAT 幸运无限的品牌初心...` | 是 | 否 | 引言描述 |
| 品牌初心故事 | `storyTitle` | 文本 (Text) | `工厂背景与十余年行业积淀` | 是 | 否 | 初心标题 |
| 品牌初心故事 | `storyContent` | 富文本 (RichText) | 品牌创始初心长文 | 是 | 否 | 包含工厂自产自销优势长篇阐述 |
| **成长历程** | `timelineHeading`| 文本 (Text) | `公司成长历程` | 是 | 否 | 时间线标题 |
| **成长历程** | `timelineEvents` | 集合列表 (Array) | 历年里程碑 | 是 | **是 (可增删排序)** | 时间线列表项 |
| └ 里程碑单项 | `timelineEvents[i].year` | 文本 (Text) | `2015 / 2020 / 2026` | 是 | 否 | 年份或时间节点 |
| └ 里程碑单项 | `timelineEvents[i].title` | 文本 (Text) | `自有模具精密注塑工厂投产` | 是 | 否 | 里程碑标题 |
| └ 里程碑单项 | `timelineEvents[i].desc` | 多行文本 (Textarea) | 详细经历 | 是 | 否 | 里程碑描述 |
| 四大核心优势 | `strengthsHeading`| 文本 (Text) | `我们的四大核心优势` | 是 | 否 | 标题 |
| 四大核心优势 | `strengthsList` | 列表 (Array) | 4 项 | 是 | **是 (可增删排序)** | 全链路/原创设计/稳健合规/AI先行 |
| 企业文化 | `cultureHeading` | 文本 (Text) | `企业文化与价值观` | 是 | 否 | 标题 |
| 企业文化 | `cultureCards` | 列表 (Array) | 4 项 | 是 | **是 (可增删排序)** | 触手可及/分享想法/平等凝聚/开创者 |
| **主体合规资质** | `certsHeading` | 文本 (Text) | `企业主体与合规资质` | 是 | 否 | 资质板块标题 |
| **主体合规资质** | `certificates` | 媒体列表 (Array) | 4 张官方资质原件 | 是 | **是 (可增删替换)** | 执照与中美商标证高清图 |
| └ 证书单项 | `certificates[i].name` | 文本 (Text) | `中华人民共和国营业执照` | 是 | 否 | 资质名称 |
| └ 证书单项 | `certificates[i].authority`| 文本 (Text) | `深圳市市场监督管理局` | 否 | 否 | 颁发机构 |
| └ 证书单项 | `certificates[i].image` | 媒体图片 (Media) | `images/business-license.png` | 是 | 否 | 高清扫描大图 |
| └ 证书单项 | `certificates[i].desc` | 文本 (Text) | `统一社会信用代码：91440300MAELRYPQ8T` | 否 | 否 | 图注或说明 |

---

### 9. 联系我们 (`contact.html`)
| 区块 | 字段名 (Field Key) | 字段类型 | 当前值示例 | 是否必填 | 可增删排序列表 | 说明 |
|---|---|---|---|---|---|---|
| 页头引言 | `pageTitle` | 文本 (Text) | `说句话，我们听着` | 是 | 否 | 页面大标题 |
| 页头引言 | `pageDesc` | 多行文本 (Textarea) | `LUCK WHEAT 幸运无限各业务部门直达通道...` | 是 | 否 | 引言描述 |
| 总部信息 | `hqTitle` | 文本 (Text) | `公司信息与总部地址` | 是 | 否 | 总部板块标题 |
| 总部信息 | `companyName` | 文本 (Text) | `深圳市幸运无限科技有限公司` | 是 | 否 | 企业全称 |
| 总部信息 | `hqAddress` | 多行文本 (Textarea) | `广东省深圳市龙岗区坂田街道马安堂社区环城南路5号坂田国际中心E栋八层` | 是 | 否 | 物理真实地址 |
| 部门直达邮箱 | `deptHeading` | 文本 (Text) | `各业务线官方直达邮箱` | 是 | 否 | 板块标题 |
| 部门直达邮箱 | `deptList` | 列表 (Array) | 5 个部门 | 是 | **是 (可增删排序)** | 直达邮箱列表 |
| └ 部门单项 | `deptList[i].name` | 文本 (Text) | `品牌与线下渠道商务合作` | 是 | 否 | 业务线名称 |
| └ 部门单项 | `deptList[i].email` | 邮箱 (Email) | `sales@lucky-infinite.com` | 是 | 否 | 责任邮箱 |
| └ 部门单项 | `deptList[i].eta` | 文本 (Text) | `1 个工作日内响应` | 否 | 否 | 承诺响应时效 |
| 在线留言表单 | `formHeading` | 文本 (Text) | `发送在线留言` | 是 | 否 | 留言区标题 |
| 在线留言表单 | `formDesc` | 文本 (Text) | `留下你的想法或合作意向，我们会尽快与你联系。` | 否 | 否 | 引导语 |

---

### 10. SEO 独立配置 (按 8 个页面分别配置)
| 字段名 (Field Key) | 字段类型 | 验证规则 / 建议 | 说明 |
|---|---|---|---|
| `pageTitle` | 单行文本 (Text) | 25 ~ 65 字符，含健康度实时检测 | 浏览器标头与搜索引擎首行蓝字 |
| `metaDescription` | 多行文本 (Textarea) | 80 ~ 160 字符，防截断提示 | 搜索引擎摘要介绍 |
| `metaKeywords` | 单行文本 (Text) | 英文逗号分隔核心关键词 | 关键词索引 |
| `ogTitle` | 单行文本 (Text) | 默认继承 pageTitle | 微信/社交大图卡片分享主标题 |
| `ogDescription` | 多行文本 (Textarea) | 默认继承 metaDescription | 社交大图卡片摘要描述 |
| `ogImage` | 媒体图片 (Media) | 建议尺寸 1200×630px | 社交分享专属高清大图 |
| `robots` | 下拉 (Select) | `index, follow` / `noindex` | 搜索引擎爬虫索引控制 |

---

## 三、技术方案深入对比与推荐决策

基于用户 brief 第 3 条的技术路线要求，我们对目前业界成熟可靠的方案进行多维度横向测评：

### 1. 方案横向对比分析

| 维度 | 方案 A-1: Strapi 5 + Astro/Next.js | 方案 A-2 (强烈推荐): Payload CMS 3.0 + Next.js 全栈一体 | 方案 B: 自建 Node.js (Express) + SQLite + EJS 模板 |
|---|---|---|---|
| **系统架构** | 前后台物理分离：Strapi 独立后台服务（端口 1337）+ Astro/Next 前台服务（端口 3000） | **前后台一体化现代架构**：同一个 Next.js 应用下，`/admin` 是 CMS 控制台，`/` 是前台页面，统一服务与进程 | 自制微型服务：手工编写 Express 路由，EJS 服务端渲染前台，手写 HTML 后台界面 |
| **草稿与发布机制** | 原生支持（Draft & Publish） | **原生支持（Drafts & Versions）**，支持版本对比、一键回滚、定时发布 | **无原生支持**，必须手工设计草稿表、版本历史表与比较回滚算法，工作量巨大 |
| **媒体库处理** | 媒体库成熟，支持自动裁剪 | **原生超强媒体库**：自动 WebP 转换、多尺寸缩略图生成、原引用安全删除警告 | 需手工编写 `multer` 上传、`sharp` 压缩及图片重命名逻辑，极易漏删孤儿文件 |
| **权限与安全鉴权** | 健全 RBAC，JWT / API Token | **企业级安全**：Argon2 密码哈希、HttpOnly 安全 Cookie、会话防暴力破解、字段级权限过滤 | 需手工编写鉴权中间件、CSRF 保护、Session 状态管理与防暴力破解逻辑 |
| **多语言扩展能力** | 官方 i18n 插件 | **原生字段级 Localization**（完美支持中/英随时切换，无需重构数据库） | 需手工设计多语言多对多或 JSON 存储结构 |
| **部署与运维成本** | 需维护两个 Node 进程，至少 2GB 内存服务器 | **仅需 1 个 Node 进程，1GB 内存（腾讯云/阿里云轻量服务器）即可极速运行**，零跨域开销 | 单进程，但代码完全为特化自研，后续交接和维护成本极高 |

### 2. 为什么强烈推荐「方案 A-2：Payload CMS 3.0 + Next.js」？
1. **单进程一体化架构，完美契合国内云主机与 ICP 备案**：
   国内备案域名必须绑定固定国内服务器。Payload CMS 3.0 深度融合在 Next.js 体系内，无需管理 Strapi 的端口隔离、反向代理跨域以及 Webhook 重新编译通知，单个 PM2 进程直接托管前后台，稳定可靠，重启快。
2. **彻底消灭现有问题**：
   - 数据库使用 SQLite（轻量零维护单文件存储）或 PostgreSQL（高并发企业级），数据 100% 入库，告别 `localStorage`；
   - 密码 Argon2 服务端加密，登录防暴力锁定，会话自动过期；
   - 前台采用 Next.js 服务端组件（RSC）直出纯静态 HTML，SEO 爬虫秒抓取，彻底移除客户端打补丁的 `cms-bridge.js`；
   - 原生自带**草稿 / 发布分离**与**多版本历史一键回滚**，完全满足第七节验收标准。
3. **前台视觉 100% 无损对齐**：
   直接引入当前精雕细琢的 `css/style.css`，保持所有的类名和 DOM 层级，像素级复刻当前所有视觉质感（包含苹果渐变文字、按钮微动、弹窗动效等）。

---

## 四、项目目录与架构设计规划

```text
luckwheat-cms/
├── .env.example             # 环境变量模版 (数据库路径、JWT密钥、端口等，不含敏感密码)
├── .env.local               # 实际环境变量文件 (严格加入 .gitignore，不入代码仓库)
├── .gitignore
├── package.json
├── next.config.mjs          # Next.js 与 Payload 整合配置
├── tsconfig.json
│
├── src/
│   ├── app/                 # Next.js App Router 前台与后台路由
│   │   ├── (app)/           # 前台前置路由组 (纯净输出，无后台冗余代码)
│   │   │   ├── layout.tsx   # 全局母版 (含公共 Header、Footer、全局数据加载)
│   │   │   ├── page.tsx     # 官方首页 (index)
│   │   │   ├── products/    # 产品中心 (带详情与分类筛选)
│   │   │   ├── lucky-mini/  # Lucky Mini 旗舰页
│   │   │   ├── support/     # 服务支持
│   │   │   ├── channels/    # 购买渠道
│   │   │   ├── partners/    # 合作代理
│   │   │   ├── about/       # 关于我们
│   │   │   ├── contact/     # 联系我们
│   │   │   ├── sitemap.xml/ # 动态生成标准 XML 网站地图
│   │   │   └── robots.txt/  # 动态生成搜索引擎爬虫规则
│   │   │
│   │   ├── (payload)/       # Payload CMS 后台专有路由
│   │   │   ├── admin/       # 工业级后台管理面板 (/admin)
│   │   │   └── api/         # 内部 REST 与 GraphQL 接口 (/api/...)
│   │   │
│   │   └── api/
│   │       └── forms/       # 商业线索与表单提交真接口 (带限流与防刷校验)
│   │           ├── leads/route.ts
│   │           └── contact/route.ts
│   │
│   ├── collections/         # CMS 独立核心数据集合
│   │   ├── Users.ts         # 用户与管理员权限 (超管 / 编辑)
│   │   ├── Media.ts         # 媒体资源库 (支持裁切/自动生成 WebP/alt 文本)
│   │   ├── Products.ts      # 产品中心集合 (支持增删排序、多图集、规格表)
│   │   ├── Leads.ts         # 预约与客户商机线索 (真入库、状态流转、导出 CSV)
│   │   └── Partnerships.ts  # 渠道合作意向申请库 (真入库、导出 CSV)
│   │
│   ├── globals/             # 单一页面与全站公共配置
│   │   ├── SiteConfig.ts    # 全站品牌、导航菜单、页脚、SEO 默认项
│   │   ├── PageIndex.ts     # 官方首页 (Hero 轮播列表、度量条、理念、CTA)
│   │   ├── PageLuckyMini.ts # Lucky Mini 旗舰页详情
│   │   ├── PageSupport.ts   # 服务支持 (Lucky OS、保修卡片、FAQ 列表)
│   │   ├── PageChannels.ts  # 购买渠道 (渠道卡片列表、政策)
│   │   ├── PagePartners.ts  # 合作代理 (模式、阶段、支持)
│   │   ├── PageAbout.ts     # 关于我们 (历程时间线、资质证书原件图)
│   │   └── PageContact.ts   # 联系我们 (总部信息、各业务线邮箱列表)
│   │
│   └── public/              # 静态静态资源 (现有 images/ 目录无缝接入)
│       └── images/
│
└── scripts/
    └── migrate-existing-data.ts  # 阶段 2 自动化数据迁移脚本 (将现有文字/图片100%入库)
```

---

## 五、阶段 1 关键决策项清单（请用户审阅确认）

在进入阶段 2 代码开发前，需要您确认以下 4 个关键决策问题：

1. **技术方案选型**：
   - 【推荐选项】：**方案 A-2：Payload CMS 3.0 + Next.js 全栈一体**（草稿发布、版本回滚、媒体库自动压缩均原生具备，单进程极适合国内云主机）；
   - 【备选选项】：方案 A-1（Strapi + Astro，双进程独立）；方案 B（自建 Express + EJS 全手写后台）。
2. **多语言支持策略**：
   - 【推荐选项】：**底层数据模型设计为原生支持中/英双语（Localization Enabled）**。第一阶段上线时仅录入现有官方中文内容，前台只展示中文，后续翻译就绪时后台直接录入英文，无需二次修改底层数据库。
3. **服务器与国内备案部署环境**：
   - 【推荐选项】：由于已有真实备案号 `粤ICP备2026102601号-1`，推荐采用 **阿里云 / 腾讯云 中国大陆境内轻量服务器（2核2G 或 2核4G，Ubuntu 22.04）**，配合 Nginx 反代与 PM2 守护，单台服务器成本数百元/年，合规合法、极速响应。
4. **历史临时文件处理**：
   - 根目录下有 `stitch_apple_light_website.html`、`stitch_apple_style_website.html`、`stitch_official_website.html` 等设计实验文件。
   - 【处理原则】：**严格遵守规则，在您确认前绝不删除或改动任何现有文件**。建议阶段 2 启动后将它们完整移入 `_archive/` 备份归档目录妥善保留。

---

## 六、工作量估算与推进排期

| 阶段 | 核心任务 | 交付标志 | 预计工作周期 |
|---|---|---|---|
| **阶段 1 (已就绪)** | 逐页扫描审计、全站《内容清单》输出、架构方案设计、决策项确认 | 输出本审计报告，等待用户确认决策 | 0.5 天 |
| **阶段 2** | 初始化 Payload CMS 3.0，定义全部 Collections 与 Globals 数据模型，编写迁移脚本将现有官网内容一字不差导入数据库 | 数据库填充完毕，输出《迁移前后逐页对比报告》 | 1 ~ 1.5 天 |
| **阶段 3** | 配置后台中文管理界面、媒体库处理、草稿与发布、版本历史回滚与权限管理 | 后台可独立登录运行，非技术人员可修改保存与发布 | 1 天 |
| **阶段 4** | 前台 Next.js 页面渲染改造，对齐 `css/style.css`，彻底移除旧版 `cms-bridge.js` 与 `admin.html` | 前台与后台数据完全贯通，双设备刷新即时生效 | 1.5 天 |
| **阶段 5** | 真实表单提交入库与防刷限流、线索导出、全量功能测试、撰写《后台使用手册》与交付文档 | 通过第七节 10 条全部验收标准，完整交付 | 1 天 |

---

## 七、阶段 1 总结汇报

- **已完成**：
  1. 完成 8 个正式页面及全站公共区块的逐行审计，输出了包含上百个细粒度字段的完整《内容清单》表格；
  2. 完成技术架构横向对比，给出了最佳的一体化全栈 CMS 推荐方案（Payload CMS 3.0 + Next.js）；
  3. 完成数据库 Collections 与 Globals 模型设计及项目目录规划；
  4. 梳理并列出了 4 项关键决策问题。
- **未完成**：等待用户对技术方案、多语言策略与部署环境做出决策确认。
- **风险提示**：
  - 严禁在未经确认的情况下删除现有静态文件，所有历史文件均完整保留；
  - 严禁将数据库密钥或管理员密码硬编码入库，需统一纳入 `.env` 环境变量；
  - 方案切换过程必须保证前台当前 `http://localhost:5500` 预览完全不受干扰，待新工程独立完成后平滑切换。
