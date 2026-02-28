#!/usr/bin/env sh

# 发生任何错误时终止
set -e

# 构建
pnpm run build

# 进入输出产物文件夹
cd dist

# 解决直接访问 domain/path 404 从而触发访问根目录的404.html导致寻址成功
cp index.html 404.html

git init
git checkout -B main
git add -A
git commit -m 'deploy'

# 部署到 GitHub Pages 的 gh-pages 分支
git push -f https://github.com/wizardpisces/demo-touch-end.git main:gh-pages

cd -
