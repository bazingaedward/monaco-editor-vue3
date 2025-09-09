#!/bin/bash

# 构建文档的脚本
set -e

echo "🚀 开始构建文档..."

# 构建文档
npm run docs:build

echo "✅ 文档构建完成！"
echo "📁 构建产物位置: docs/.vitepress/dist"
echo ""
echo "要部署到 GitHub Pages，请执行以下步骤："
echo "1. 提交所有更改到 main 分支"
echo "2. 推送到 GitHub"
echo "3. GitHub Actions 会自动部署到 GitHub Pages"
echo ""
echo "或者使用手动部署脚本: npm run deploy"
