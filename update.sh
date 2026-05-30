#!/bin/bash
# 自动构建、提交、打标签并推送

VERSION=$1
if [ -z "$VERSION" ]; then
  echo "请提供版本号，例如: ./update.sh v0.5.0"
  exit 1
fi

echo "🔨 构建 APK..."
npm run build && npx cap sync && cd android && ./gradlew assembleRelease --no-daemon
cd ..

echo "📦 复制 APK..."
cp android/app/build/outputs/apk/release/app-release.apk ./DailyTech-$VERSION.apk

echo "📝 提交代码..."
git add .
git commit -m "release: $VERSION"

echo "🏷️ 创建标签..."
git tag $VERSION

echo "🚀 推送..."
git push origin main
git push origin $VERSION

echo "✅ 完成! 版本: $VERSION"
