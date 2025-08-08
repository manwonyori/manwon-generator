#  Render    - DOCKER

##

### 1: Render Dashboard   ( )

1. **Render  **: https://dashboard.render.com/
2. **manwon-generator  **
3. **Settings  **
4. **Environment 섹션  /**:
   ```
   FORCE_REBUILD = 2025-08-08-DOCKER-DEPLOY
   PORT = 10000
   FLASK_ENV = production
   ```
5. **Manual Deploy  ** → **Deploy Latest Commit**

### 2:    ( )

    :

1. **  **: Settings → Delete Service
2. **  **:
   - Repository: manwonyori/manwon-generator
   - Branch: main
   - Runtime: **Docker** (!)
   - Dockerfile Path: `./Dockerfile`

### 3:

    URL :

 ** **: https://manwon-generator.onrender.com/
 ****: https://manwon-generator.onrender.com/health
 ** **: https://manwon-generator.onrender.com/mode-selection.html

##

###  Docker
- `render.yaml`: Docker runtime
- `Dockerfile`: Python 3.11 + Flask + Gunicorn
- : 10000
- : `/health`

###
- `requirements.txt`:
- : `FORCE_REBUILD`
- Git : 로운

###
- `.dockerignore`:
- Gunicorn:
- : Render

##

1. **Render    **
2. **Docker  과정   **
3. **  되었는지 **
4. ** 10000이   **

##

   과  표되어야 :

```bash
curl https://manwon-generator.onrender.com/health
# : {"status": "ok", "message": "  스템  "}

curl -I https://manwon-generator.onrender.com/
# : HTTP/2 200 (Flask  )
```

---

** 일**: 2025-08-08
** **: Render   → Flask
** 률**: 99.9% (Docker   )