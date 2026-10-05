#!/usr/bin/env python3
"""
serve.py
Servidor local simples em Python para o AnimValue
"""
import http.server
import socketserver
import os
import sys

PORT = 3000

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("=" * 50)
        print(f"🚀 AnimValue rodando em: http://localhost:{PORT}")
        print("=" * 50)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor encerrado.")

if __name__ == '__main__':
    main()
