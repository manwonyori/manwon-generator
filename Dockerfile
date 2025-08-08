# Manwon Generator - SuperClaude Optimized Docker Configuration
# FORCE REBUILD: 2025-01-08-V10
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Update system packages and install curl for health checks
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Expose port (environment variable based)
EXPOSE ${PORT:-10000}

# Health check configuration - curl is installed so it works
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT:-10000}/health || exit 1

# Set environment variable defaults
ENV PORT=10000
ENV FLASK_ENV=production

# Start command - use environment variable based port
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT} --workers 1 --timeout 120 --access-logfile - --error-logfile - app:app"]