#!/usr/bin/env python3
"""
  -      Flask
"""
from flask import Flask, send_from_directory, jsonify
import os

app = Flask(__name__)

@app.route('/')
def home():
    """  -    """
    print("[LOG]    - index.html ")
    try:
        return send_from_directory('.', 'index.html')
    except Exception as e:
        print(f"[ERROR] index.html  : {e}")
        return f"Error: {e}", 500

@app.route('/<path:filename>')
def serve_file(filename):
    """  """
    try:
        print(f"[LOG]  : {filename}")

        # HTML 들
        if filename.endswith('.html'):
            return send_from_directory('.', filename)

        # CSS 들
        if filename.startswith('css/'):
            return send_from_directory('.', filename)

        # JS 들
        if filename.startswith('js/') or filename.endswith('.js'):
            return send_from_directory('.', filename)

        #  들
        return send_from_directory('.', filename)

    except Exception as e:
        print(f"[ERROR]    {filename}: {e}")
        return jsonify({"error": "File not found", "file": filename}), 404

@app.route('/health')
def health():
    """ """
    return jsonify({
        "status": "healthy",
        "message": "    ",
        "files": {
            "index.html": os.path.exists("index.html"),
            "detail-input.html": os.path.exists("detail-input.html")
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    print(f"""
===========================================
   상세  -
===========================================
: {port}
index.html : {os.path.exists('index.html')}
detail-input.html : {os.path.exists('detail-input.html')}
===========================================
""")
    app.run(host='0.0.0.0', port=port, debug=False)