#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LUCK WHEAT 幸运无限官网与 CMS 后台服务引擎
功能特性：
1. 高并发 ThreadingHTTPServer 静态资源托管 + 防缓存精确控制
2. 全站图文 / 产品 / 详情长图 / SEO 服务端真持久化 (data/live_site_data.json + data/site_live_data.js)
3. 大图片自动压缩解码与独立落盘上传 (images/uploads/*)，彻底突破浏览器 5MB localStorage 限制
4. 前台预约与商务合作线索实时入库服务端 (data/live_leads.json, data/live_partnerships.json)
5. 基于盐值 SHA-256 哈希 + Token 的后台鉴权，敏感文件与客户隐私零暴露
6. 微信公众号与网页文章智能元数据解析 API (/api/fetch-article)
"""

import sys
import os
import json
import re
import html
import base64
import time
import hashlib
import secrets
import datetime
import ipaddress
import socket
import threading
import urllib.request
import urllib.parse
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5500
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
UPLOAD_DIR = os.path.join(BASE_DIR, 'images', 'uploads')

LIVE_DATA_JSON = os.path.join(DATA_DIR, 'live_site_data.json')
LIVE_DATA_JS = os.path.join(DATA_DIR, 'site_live_data.js')
LEADS_JSON = os.path.join(DATA_DIR, 'live_leads.json')
PARTNERS_JSON = os.path.join(DATA_DIR, 'live_partnerships.json')
ADMIN_CONFIG_JSON = os.path.join(DATA_DIR, 'admin_config.json')
SESSIONS_JSON = os.path.join(DATA_DIR, 'live_sessions.json')

SENSITIVE_DATA_FILES = {
    'admin_config.json',
    'live_leads.json',
    'live_partnerships.json',
    'live_sessions.json',
}

ALLOWED_IMAGE_EXTS = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
}

FILE_LOCK = threading.Lock()
SESSION_TTL_SECONDS = 7 * 24 * 3600  # 登录凭证 7 天有效
MAX_JSON_BODY_BYTES = 25 * 1024 * 1024  # 允许单次同步最多 25MB


def ensure_dirs():
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(UPLOAD_DIR, exist_ok=True)


def atomic_write_text(filepath, content):
    tmp_path = f"{filepath}.{os.getpid()}.{threading.get_ident()}.tmp"
    with open(tmp_path, 'w', encoding='utf-8') as f:
        f.write(content)
    os.replace(tmp_path, filepath)


def atomic_write_bytes(filepath, data_bytes):
    tmp_path = f"{filepath}.{os.getpid()}.{threading.get_ident()}.tmp"
    with open(tmp_path, 'wb') as f:
        f.write(data_bytes)
    os.replace(tmp_path, filepath)


def read_json_file(filepath, default=None):
    if not os.path.exists(filepath):
        return default
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return default


def hash_password(password, salt):
    return hashlib.sha256(f"{salt}:{password}".encode('utf-8')).hexdigest()


def get_or_init_admin_config():
    cfg = read_json_file(ADMIN_CONFIG_JSON)
    if cfg and 'salt' in cfg and 'hash' in cfg:
        return cfg
    salt = secrets.token_hex(16)
    cfg = {
        'username': 'admin',
        'salt': salt,
        'hash': hash_password('luck2026', salt),
        'updatedAt': datetime.datetime.now().isoformat(),
    }
    atomic_write_text(ADMIN_CONFIG_JSON, json.dumps(cfg, ensure_ascii=False, indent=2))
    return cfg


def verify_admin_credentials(username, password):
    cfg = get_or_init_admin_config()
    if username != cfg.get('username', 'admin'):
        return False
    expected = cfg.get('hash', '')
    actual = hash_password(password, cfg.get('salt', ''))
    return secrets.compare_digest(expected, actual)


def create_session_token():
    token = secrets.token_urlsafe(32)
    now = time.time()
    with FILE_LOCK:
        sessions = read_json_file(SESSIONS_JSON, {})
        if not isinstance(sessions, dict):
            sessions = {}
        # 清理过期 token
        sessions = {k: v for k, v in sessions.items() if isinstance(v, (int, float)) and v > now}
        sessions[token] = now + SESSION_TTL_SECONDS
        atomic_write_text(SESSIONS_JSON, json.dumps(sessions, indent=2))
    return token


def is_token_valid(token):
    if not token:
        return False
    now = time.time()
    with FILE_LOCK:
        sessions = read_json_file(SESSIONS_JSON, {})
        if not isinstance(sessions, dict):
            return False
        exp = sessions.get(token)
        return isinstance(exp, (int, float)) and exp > now


def save_data_url_image(data_url, prefix='img'):
    """如果是 data:image/... Base64 数据，转存为磁盘真文件并返回相对路径"""
    if not isinstance(data_url, str) or not data_url.startswith('data:image/'):
        return data_url

    m = re.match(r'^data:(image/[a-zA-Z0-9+.\-]+);base64,(.+)$', data_url, re.DOTALL)
    if not m:
        return data_url

    mime = m.group(1).lower()
    if mime == 'image/svg+xml':
        # 禁止 SVG 中潜在脚本攻击，不允许服务端落地 SVG 或跳过
        return data_url

    ext = ALLOWED_IMAGE_EXTS.get(mime)
    if not ext:
        return data_url

    try:
        raw_bytes = base64.b64decode(m.group(2))
    except Exception:
        return data_url

    if len(raw_bytes) > 10 * 1024 * 1024:
        return data_url

    ensure_dirs()
    digest = hashlib.sha256(raw_bytes).hexdigest()[:16]
    safe_prefix = re.sub(r'[^a-zA-Z0-9_\-]', '', prefix)[:24] or 'img'
    filename = f"{safe_prefix}_{digest}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(filepath):
        atomic_write_bytes(filepath, raw_bytes)
    return f"images/uploads/{filename}"


def extract_and_store_embedded_images(obj, path_hint='site'):
    """递归遍历 JSON，将残留内联 Base64 大图全部持久化落盘并替换为相对文件路径"""
    if isinstance(obj, dict):
        return {
            k: extract_and_store_embedded_images(v, f"{k}")
            for k, v in obj.items()
        }
    elif isinstance(obj, list):
        return [
            extract_and_store_embedded_images(item, path_hint)
            for item in obj
        ]
    elif isinstance(obj, str) and obj.startswith('data:image/'):
        return save_data_url_image(obj, path_hint)
    return obj


def write_live_site_data(site_data):
    ensure_dirs()
    clean_data = extract_and_store_embedded_images(site_data, 'cms')
    # 移除不宜放入公开站点 JSON 的线索数据，线索走单独受保护文件
    public_data = dict(clean_data)
    leads_data = public_data.pop('leads', None)
    partners_data = public_data.pop('partnerships', None)

    updated_at = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    payload = {
        'updatedAt': updated_at,
        'data': public_data,
    }
    js_content = (
        "/**\n"
        f" * LUCK WHEAT 幸运无限 - 服务器发布数据快照 (最后更新: {updated_at})\n"
        " */\n"
        f"window.LUCK_SITE_LIVE_DATA = {json.dumps(public_data, ensure_ascii=False)};\n"
    )
    with FILE_LOCK:
        atomic_write_text(LIVE_DATA_JSON, json.dumps(payload, ensure_ascii=False, indent=2))
        atomic_write_text(LIVE_DATA_JS, js_content)
        if isinstance(leads_data, list) and not os.path.exists(LEADS_JSON):
            atomic_write_text(LEADS_JSON, json.dumps(leads_data, ensure_ascii=False, indent=2))
        if isinstance(partners_data, list) and not os.path.exists(PARTNERS_JSON):
            atomic_write_text(PARTNERS_JSON, json.dumps(partners_data, ensure_ascii=False, indent=2))

    return payload


def is_safe_public_url(target_url):
    """防止 SSRF 探测内网地址"""
    try:
        parsed = urllib.parse.urlparse(target_url)
        if parsed.scheme not in ('http', 'https'):
            return False
        host = parsed.hostname
        if not host or host.lower() in ('localhost', '127.0.0.1', '0.0.0.0', '::1'):
            return False
        infos = socket.getaddrinfo(host, None)
        for info in infos:
            ip_str = info[4][0]
            ip_obj = ipaddress.ip_address(ip_str)
            if ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_link_local or ip_obj.is_reserved:
                return False
        return True
    except Exception:
        return False


def parse_article_metadata(url):
    """抓取微信公众号推文或任意公网网页的标题、摘要与日期"""
    if not is_safe_public_url(url):
        raise ValueError('仅支持访问合法的公网 http/https 文章链接')

    headers = {
        'User-Agent': (
            'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) '
            'AppleWebKit/605.1.15 (KHTML, like Gecko) '
            'Mobile/15E148 MicroMessenger/8.0.38(0x1800262c) NetType/WIFI Language/zh_CN'
        )
    }

    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as res:
        raw_bytes = res.read(2 * 1024 * 1024)
        try:
            raw = raw_bytes.decode('utf-8')
        except UnicodeDecodeError:
            try:
                raw = raw_bytes.decode('gbk')
            except Exception:
                raw = raw_bytes.decode('utf-8', errors='ignore')

    title = ''
    m = re.search(r'var\s+msg_title\s*=\s*[\'\"](.*?)[\'\"]', raw)
    if m:
        title = m.group(1)
    if not title:
        m = re.search(r'<meta\s+[^>]*property=[\"\']og:title[\"\'][^>]*content=[\"\'](.*?)[\"\']', raw, re.I)
        if m:
            title = m.group(1)
    if not title:
        m = re.search(r'<h1[^>]*id=[\"\']activity-name[\"\'][^>]*>(.*?)</h1>', raw, re.DOTALL | re.I)
        if m:
            title = re.sub(r'<[^>]+>', '', m.group(1))
    if not title:
        m = re.search(r'<title>(.*?)</title>', raw, re.I | re.DOTALL)
        if m:
            title = m.group(1)
    title = html.unescape(title).strip()

    desc = ''
    m = re.search(r'var\s+msg_desc\s*=\s*[\'\"](.*?)[\'\"]', raw)
    if m:
        desc = m.group(1)
    if not desc:
        m = re.search(r'<meta\s+[^>]*property=[\"\']og:description[\"\'][^>]*content=[\"\'](.*?)[\"\']', raw, re.I)
        if m:
            desc = m.group(1)
    if not desc:
        m = re.search(r'<meta\s+[^>]*name=[\"\']description[\"\'][^>]*content=[\"\'](.*?)[\"\']', raw, re.I)
        if m:
            desc = m.group(1)
    desc = html.unescape(desc).strip()

    date_str = ''
    m = re.search(r'var\s+ct\s*=\s*[\'\"]?(\d{10})[\'\"]?', raw)
    if m:
        try:
            ts = int(m.group(1))
            date_str = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m')
        except Exception:
            pass
    if not date_str:
        m = re.search(r'publish_time\s*=\s*[\'\"](\d{4})-(0[1-9]|1[0-2])', raw)
        if m:
            date_str = f"{m.group(1)}-{m.group(2)}"
    if not date_str:
        m = re.search(r'(\d{4})[年/-](0[1-9]|1[0-2]|[1-9])(?:[月/-]|\b)', raw)
        if m:
            m_val = int(m.group(2))
            if 1 <= m_val <= 12:
                date_str = f'{m.group(1)}-{m_val:02d}'
    if not date_str:
        date_str = datetime.datetime.now().strftime('%Y-%m')

    return {
        'success': True,
        'title': title,
        'desc': desc,
        'date': date_str,
        'url': url,
    }


class LuckWheatHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        # 对 HTML、数据快照 JS 及 API 响应禁用缓存，确保后台修改刷新即生效
        path = urllib.parse.urlparse(self.path).path.lower()
        if (
            path == '/'
            or path.endswith('.html')
            or '/data/' in path
            or path.startswith('/api/')
            or path.endswith('.js')
            or path.endswith('.css')
        ):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

    def send_json(self, status_code, payload):
        body = json.dumps(payload, ensure_ascii=False).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_json_body(self):
        try:
            length = int(self.headers.get('Content-Length', '0'))
        except ValueError:
            raise ValueError('无效的 Content-Length')
        if length <= 0 or length > MAX_JSON_BODY_BYTES:
            raise ValueError('请求体大小超出限制')
        raw = self.rfile.read(length)
        return json.loads(raw.decode('utf-8'))

    def get_bearer_token(self):
        auth_header = self.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            return auth_header[7:].strip()
        return ''

    def require_auth(self):
        token = self.get_bearer_token()
        if not is_token_valid(token):
            self.send_json(401, {'success': False, 'error': '未登录或登录状态已过期，请重新登录后台'})
            return False
        return True

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # 拦截敏感运维/隐私静态文件直接下载
        norm_parts = [p for p in path.split('/') if p and p != '.']
        if len(norm_parts) >= 2 and norm_parts[0] == 'data' and norm_parts[1] in SENSITIVE_DATA_FILES:
            self.send_json(403, {'success': False, 'error': 'Access Denied'})
            return
        if path.endswith('.py') or path.startswith('/.'):
            self.send_json(403, {'success': False, 'error': 'Access Denied'})
            return

        if path == '/api/health':
            self.send_json(200, {'ok': True, 'mode': 'server', 'version': '2.1'})
            return

        if path == '/api/admin/verify':
            token = self.get_bearer_token()
            self.send_json(200, {'authenticated': is_token_valid(token)})
            return

        if path == '/api/site-data':
            with FILE_LOCK:
                payload = read_json_file(LIVE_DATA_JSON)
            if payload and isinstance(payload, dict) and 'data' in payload:
                self.send_json(200, {
                    'success': True,
                    'exists': True,
                    'updatedAt': payload.get('updatedAt', ''),
                    'data': payload['data'],
                })
            else:
                self.send_json(200, {'success': True, 'exists': False, 'data': None})
            return

        if path == '/api/leads':
            if not self.require_auth():
                return
            with FILE_LOCK:
                leads = read_json_file(LEADS_JSON, None)
            self.send_json(200, {'success': True, 'items': leads})
            return

        if path == '/api/partners':
            if not self.require_auth():
                return
            with FILE_LOCK:
                partners = read_json_file(PARTNERS_JSON, None)
            self.send_json(200, {'success': True, 'items': partners})
            return

        if path == '/api/fetch-article':
            query = urllib.parse.parse_qs(parsed.query)
            target_url = query.get('url', [''])[0].strip()
            if not target_url:
                self.send_json(200, {'success': False, 'error': '未提供文章链接 URL'})
                return
            try:
                res = parse_article_metadata(target_url)
                self.send_json(200, res)
            except Exception as e:
                self.send_json(200, {'success': False, 'error': f'抓取失败: {str(e)}'})
            return

        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        try:
            body = self.read_json_body()
        except Exception as e:
            self.send_json(400, {'success': False, 'error': f'请求数据无效: {str(e)}'})
            return

        if path == '/api/admin/login':
            username = str(body.get('username', '')).strip()
            password = str(body.get('password', '')).strip()
            if verify_admin_credentials(username, password):
                token = create_session_token()
                self.send_json(200, {'success': True, 'token': token})
            else:
                self.send_json(401, {'success': False, 'error': '管理员账号或密码不正确'})
            return

        if path == '/api/admin/password':
            if not self.require_auth():
                return
            old_pwd = str(body.get('oldPassword', '')).strip()
            new_pwd = str(body.get('newPassword', '')).strip()
            if len(new_pwd) < 6:
                self.send_json(400, {'success': False, 'error': '新密码长度至少 6 位'})
                return
            if not verify_admin_credentials('admin', old_pwd):
                self.send_json(403, {'success': False, 'error': '当前密码不正确'})
                return
            new_salt = secrets.token_hex(16)
            cfg = {
                'username': 'admin',
                'salt': new_salt,
                'hash': hash_password(new_pwd, new_salt),
                'updatedAt': datetime.datetime.now().isoformat(),
            }
            with FILE_LOCK:
                atomic_write_text(ADMIN_CONFIG_JSON, json.dumps(cfg, ensure_ascii=False, indent=2))
            self.send_json(200, {'success': True, 'message': '管理员密码已安全更新至服务器'})
            return

        if path == '/api/site-data':
            if not self.require_auth():
                return
            site_data = body.get('data') if isinstance(body, dict) and 'data' in body else body
            if not isinstance(site_data, dict):
                self.send_json(400, {'success': False, 'error': '提交的数据结构无效'})
                return
            saved_payload = write_live_site_data(site_data)
            self.send_json(200, {
                'success': True,
                'updatedAt': saved_payload['updatedAt'],
                'data': saved_payload['data'],
            })
            return

        if path == '/api/upload-image':
            if not self.require_auth():
                return
            data_url = body.get('dataUrl', '')
            prefix = body.get('prefix', 'upload')
            if not isinstance(data_url, str) or not data_url.startswith('data:image/'):
                self.send_json(400, {'success': False, 'error': '仅支持标准图片格式上传'})
                return
            saved_url = save_data_url_image(data_url, prefix)
            if saved_url == data_url:
                self.send_json(400, {'success': False, 'error': '不支持的图片编码或文件过大'})
                return
            self.send_json(200, {'success': True, 'url': saved_url})
            return

        # 前台客户线索提交（公开接口）
        if path == '/api/leads':
            new_item = body if isinstance(body, dict) else {}
            record = {
                'id': str(new_item.get('id') or f"LEAD-{int(time.time() * 1000) % 1000000}")[:32],
                'name': str(new_item.get('name', '官网访客'))[:80],
                'phone': str(new_item.get('phone', '-'))[:40],
                'email': str(new_item.get('email', '-'))[:80],
                'product': str(new_item.get('product', '官网咨询'))[:80],
                'date': str(new_item.get('date') or datetime.datetime.now().strftime('%Y/%m/%d %H:%M:%S'))[:40],
                'status': '待联系',
                'notes': str(new_item.get('notes', ''))[:500],
            }
            with FILE_LOCK:
                leads = read_json_file(LEADS_JSON)
                if not isinstance(leads, list):
                    leads = []
                leads.insert(0, record)
                leads = leads[:2000]
                atomic_write_text(LEADS_JSON, json.dumps(leads, ensure_ascii=False, indent=2))
            self.send_json(200, {'success': True, 'item': record})
            return

        if path == '/api/leads/save':
            if not self.require_auth():
                return
            items = body.get('items')
            if not isinstance(items, list):
                self.send_json(400, {'success': False, 'error': '无效的列表数据'})
                return
            with FILE_LOCK:
                atomic_write_text(LEADS_JSON, json.dumps(items[:2000], ensure_ascii=False, indent=2))
            self.send_json(200, {'success': True})
            return

        # 前台商业合作申请提交（公开接口）
        if path == '/api/partners':
            new_item = body if isinstance(body, dict) else {}
            record = {
                'id': str(new_item.get('id') or f"BIZ-{int(time.time() * 1000) % 1000000}")[:32],
                'company': str(new_item.get('company', '合作意向单位'))[:100],
                'contact': str(new_item.get('contact', '负责人'))[:80],
                'phone': str(new_item.get('phone', '-'))[:40],
                'email': str(new_item.get('email', '-'))[:80],
                'channelType': str(new_item.get('channelType', '商业合作'))[:80],
                'region': str(new_item.get('region', '-'))[:80],
                'expectedVolume': str(new_item.get('expectedVolume', '待商务沟通'))[:60],
                'date': str(new_item.get('date') or datetime.datetime.now().strftime('%Y/%m/%d %H:%M:%S'))[:40],
                'status': '待跟进',
                'notes': str(new_item.get('notes', ''))[:500],
            }
            with FILE_LOCK:
                partners = read_json_file(PARTNERS_JSON)
                if not isinstance(partners, list):
                    partners = []
                partners.insert(0, record)
                partners = partners[:2000]
                atomic_write_text(PARTNERS_JSON, json.dumps(partners, ensure_ascii=False, indent=2))
            self.send_json(200, {'success': True, 'item': record})
            return

        if path == '/api/partners/save':
            if not self.require_auth():
                return
            items = body.get('items')
            if not isinstance(items, list):
                self.send_json(400, {'success': False, 'error': '无效的列表数据'})
                return
            with FILE_LOCK:
                atomic_write_text(PARTNERS_JSON, json.dumps(items[:2000], ensure_ascii=False, indent=2))
            self.send_json(200, {'success': True})
            return

        self.send_json(404, {'success': False, 'error': '未知接口路由'})


if __name__ == '__main__':
    ensure_dirs()
    get_or_init_admin_config()
    server_address = ('', PORT)
    httpd = ThreadingHTTPServer(server_address, LuckWheatHandler)
    print(f"🚀 [LuckWheat Server] 高并发官网服务端启动，监听端口 {PORT} (根目录: {BASE_DIR})")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务停止。")
