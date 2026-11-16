#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
幸运无限官网与 CMS 后台本地服务
提供静态文件服务 + 微信公众号与网页文章智能元数据解析 API
"""

import sys
import os
import json
import re
import html
import datetime
import urllib.request
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5500
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def parse_article_metadata(url):
    """抓取微信公众号推文或任意网页的标题、摘要与日期"""
    headers = {
        'User-Agent': (
            'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) '
            'AppleWebKit/605.1.15 (KHTML, like Gecko) '
            'Mobile/15E148 MicroMessenger/8.0.38(0x1800262c) NetType/WIFI Language/zh_CN'
        )
    }
    
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as res:
        raw_bytes = res.read()
        try:
            raw = raw_bytes.decode('utf-8')
        except UnicodeDecodeError:
            try:
                raw = raw_bytes.decode('gbk')
            except Exception:
                raw = raw_bytes.decode('utf-8', errors='ignore')

    # 1. 标题提取 (优先微信特有变量，其次 og 标签，最后 h1 / title)
    title = ''
    m = re.search(r'var\s+msg_title\s*=\s*[\'\"](.*?)[\'\"]', raw)
    if m: title = m.group(1)
    if not title:
        m = re.search(r'<meta\s+[^>]*property=[\"\']og:title[\"\'][^>]*content=[\"\'](.*?)[\"\']', raw, re.I)
        if m: title = m.group(1)
    if not title:
        m = re.search(r'<h1[^>]*id=[\"\']activity-name[\"\'][^>]*>(.*?)</h1>', raw, re.DOTALL | re.I)
        if m: title = re.sub(r'<[^>]+>', '', m.group(1))
    if not title:
        m = re.search(r'<title>(.*?)</title>', raw, re.I)
        if m: title = m.group(1)
    title = html.unescape(title).strip()

    # 2. 描述 / 摘要提取
    desc = ''
    m = re.search(r'var\s+msg_desc\s*=\s*[\'\"](.*?)[\'\"]', raw)
    if m: desc = m.group(1)
    if not desc:
        m = re.search(r'<meta\s+[^>]*property=[\"\']og:description[\"\'][^>]*content=[\"\'](.*?)[\"\']', raw, re.I)
        if m: desc = m.group(1)
    if not desc:
        m = re.search(r'<meta\s+[^>]*name=[\"\']description[\"\'][^>]*content=[\"\'](.*?)[\"\']', raw, re.I)
        if m: desc = m.group(1)
    desc = html.unescape(desc).strip()

    # 3. 日期提取 (转换为 YYYY-MM)
    date_str = ''
    m = re.search(r'var\s+ct\s*=\s*[\'\"]?(\d{10})[\'\"]?', raw)
    if m:
        try:
            ts = int(m.group(1))
            dt = datetime.datetime.fromtimestamp(ts)
            date_str = dt.strftime('%Y-%m')
        except Exception:
            pass
    if not date_str:
        m = re.search(r'publish_time\s*=\s*[\'\"](\d{4})-(0[1-9]|1[0-2])', raw)
        if m: date_str = f"{m.group(1)}-{m.group(2)}"
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
        'url': url
    }


class LuckWheatHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/fetch-article':
            query = urllib.parse.parse_qs(parsed.query)
            target_url = query.get('url', [''])[0].strip()
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            if not target_url:
                res = {'success': False, 'error': '未提供文章链接 URL'}
            else:
                try:
                    res = parse_article_metadata(target_url)
                except Exception as e:
                    res = {'success': False, 'error': f'抓取失败: {str(e)}'}

            self.wfile.write(json.dumps(res, ensure_ascii=False).encode('utf-8'))
            return

        # 默认静态文件处理
        super().do_GET()


if __name__ == '__main__':
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, LuckWheatHandler)
    print(f"🚀 [LuckWheat Server] 正在监听端口 {PORT} (根目录: {BASE_DIR})")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务停止。")
