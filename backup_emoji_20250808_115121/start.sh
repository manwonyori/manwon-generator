#!/bin/bash
# Render

echo "Starting manwon-generator server..."
echo "Python version:"
python --version
echo "Installed packages:"
pip list
echo "Current directory:"
pwd
echo "Files in directory:"
ls -la
echo "Starting gunicorn..."
gunicorn app:app --bind 0.0.0.0:$PORT --workers 1 --threads 2 --timeout 120