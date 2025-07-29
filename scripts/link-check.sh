#!/usr/bin/env python3
import sys, os, re
root = sys.argv[1] if len(sys.argv)>1 else '.'
status = 0
for dirpath, _, files in os.walk(root):
    for name in files:
        if not name.endswith('.html'):
            continue
        path = os.path.join(dirpath, name)
        with open(path, 'r', encoding='utf-8') as f:
            data = f.read()
        for link in re.findall(r'href="([^"]+)"', data):
            if link.startswith(('http', 'mailto:', '#')):
                continue
            link_path = link.lstrip('/')
            if link_path.startswith('nogaslabs-site/'):
                link_path = link_path[len('nogaslabs-site/'):]  # site root prefix
            base = root if link.startswith('/') else dirpath
            target = os.path.normpath(os.path.join(base, link_path))
            if not os.path.exists(target):
                print(f"{path} -> missing {link}")
                status = 1
sys.exit(status)
