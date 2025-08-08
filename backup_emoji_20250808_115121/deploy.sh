#!/bin/bash

echo "==========================================

==========================================
"

# Git
if [ ! -d ".git" ]; then
    echo "Git   ..."
    git init
    git add .
    git commit -m "Initial commit:     "
fi

# GitHub
echo "GitHub   ..."
REPO_NAME="manwon-generator"
GITHUB_USER="manwonyori"

#
if ! git remote | grep -q "origin"; then
    echo "GitHub    ..."
    git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git
else
    echo "   "
fi

#
echo "  ..."
git add .
git commit -m "feat:      Render

-     (AI   +  )
- Flask
- Render
-
- AI   "

# GitHub
echo "GitHub  ..."
git branch -M main
git push -u origin main

echo "
==========================================
 GitHub  !

 :
1. https://github.com/$GITHUB_USER/$REPO_NAME
2. 가 되지  GitHub서
3. Render.com
4. New > Web Service
5. GitHub
6.

 URL: https://manwon-generator.onrender.com
==========================================
"