#!/usr/bin/env python3
"""
   -
    Flask
SuperClaude
"""
from flask import Flask, send_from_directory, jsonify, abort
import os
import logging

app = Flask(__name__)

#
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/')
def index():
    """  -    """
    try:
        #
        if os.path.exists('mode-selection.html'):
            logger.info("Serving mode-selection.html")
            return send_from_directory('.', 'mode-selection.html')
        elif os.path.exists('home.html'):
            logger.info("Serving home.html")
            return send_from_directory('.', 'home.html')
        elif os.path.exists('index.html'):
            logger.info("Serving index.html")
            return send_from_directory('.', 'index.html')
        else:
            logger.error("No HTML files found")
            return jsonify({"error": "No index file found", "status": "error"}), 404
    except Exception as e:
        logger.error(f"Error serving index: {e}")
        return jsonify({"error": "Internal server error", "status": "error"}), 500

@app.route('/health')
def health():
    """  - Render """
    try:
        return jsonify({
            "status": "ok",
            "message": "    ",
            "port": os.environ.get('PORT', '5000'),
            "files_available": {
                "mode-selection.html": os.path.exists('mode-selection.html'),
                "home.html": os.path.exists('home.html'),
                "index.html": os.path.exists('index.html')
            }
        }), 200
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/<path:filename>')
def serve_files(filename):
    """   -  """
    try:
        # :
        if '..' in filename or filename.startswith('/'):
            logger.warning(f"Suspicious file access attempt: {filename}")
            abort(404)

        #
        if not os.path.exists(filename):
            logger.warning(f"File not found: {filename}")
            abort(404)

        logger.info(f"Serving file: {filename}")
        return send_from_directory('.', filename)
    except Exception as e:
        logger.error(f"Error serving file {filename}: {e}")
        abort(500)

if __name__ == '__main__':
    # Render  PORT
    port = int(os.environ.get('PORT', 5000))
    print(f"""
========================================
     -
========================================
: {port}
  :
URL: http://0.0.0.0:{port}
========================================
    """)
    app.run(host='0.0.0.0', port=port, debug=False)