# LUCK WHEAT 幸运无限官网 · 服务器上传部署与后台同步指南

本官网支持 **两种服务器部署方式**，确保您在后台 `admin.html` 修改的文字、图片、商品详情长图、购买链接及 SEO 配置能够 **100% 实时同步到全网所有访客的前端页面**。

---

## 方案一：完整动态服务器部署（推荐 · 后台保存秒级全网生效）

只要您的服务器支持运行 Python 3（Linux 云服务器、ECS、VPS、Docker、宝塔面板 Python 项目均内置，无需安装任何第三方依赖），强烈建议启动自带服务端引擎 `server.py`：

### 1. 上传文件
将项目完整目录上传到服务器（例如 `/www/wwwroot/luckwheat`）。确保目录包含读写权限，以便服务端存放修改记录与上传的图片（`data/` 和 `images/uploads/`）。

### 2. 启动后台服务（守护进程后台常驻）
```bash
cd /www/wwwroot/luckwheat
nohup python3 server.py 5500 > server.log 2>&1 &
```

### 3. 配置 Nginx 反向代理与域名绑定（含 80 / 443 HTTPS）
在您的 Nginx 站点配置（或宝塔面板网站反向代理设置）中添加：
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    client_max_body_size 30M;

    location / {
        proxy_pass http://127.0.0.1:5500;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
> 提示：`client_max_body_size 30M;` 可确保后台一次性上传多张高清商品详情长图不会被 Nginx 拦截（413 错误）。

### 4. 后台登录与生效验证
1. 访问 `https://your-domain.com/admin.html`，右上角显示 **`🟢 服务器实时同步已连接`**；
2. 初始账号 `admin`，初始密码 `luck2026`（**上线后请立即在后台「全站系统设置」中修改为您自己的新密码**）；
3. 修改任意文字、上传图片或商品详情页，点击 **「一键保存全站变更」**，服务会自动同步保存至 `data/live_site_data.json` 与 `data/site_live_data.js`，全网所有新老访客刷新页面立即生效！
4. 客户在前台提交的预约与代理合作线索会自动入库服务器，在任何电脑登录后台均可查看与处理。

---

## 方案二：纯静态空间 / OSS 托管（无 Python 后台环境）

如果您购买的服务器空间完全不允许运行后台程序（如纯静态虚拟主机 / OSS / CDN）：
1. 本地打开后台页面 `admin.html`（或线上打开），完成全站内容与产品编辑；
2. 点击左侧导航「**全站系统设置**」➔ 点击蓝色/黑色按钮 **「🚀 导出纯静态发布包 (`site_live_data.js`)」**；
3. 将下载得到的 `site_live_data.js` 上传覆盖服务器中的 `data/site_live_data.js`（清理 CDN 缓存如开启了强缓存），所有访客即可同步看到您的最新官网内容。
