#!/bin/bash

# ibl1nk Project Cleanup Script
# ใช้สำหรับล้างไฟล์ที่สร้างจากการติดตั้ง dependencies และการ build เพื่อเริ่มใหม่แบบสะอาดๆ

echo "🧹 Preparing to clean the project..."

# รายการไฟล์และโฟลเดอร์ที่จะลบ
TARGETS=(
  "node_modules"
  "dist"
  "package-lock.json"
  "pnpm-lock.yaml"
  "yarn.lock"
  ".vite"
  ".vitest"
  "coverage"
)

# ถามเพื่อความแน่ใจ
read -p "⚠️ Are you sure you want to delete all dependencies and build artifacts? (y/N): " confirm

if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
  for target in "${TARGETS[@]}"; do
    if [ -e "$target" ] || [ -d "$target" ]; then
      echo "🗑️ Removing $target..."
      rm -rf "$target"
    fi
  done

  echo "✨ Cleaning npm cache..."
  npm cache clean --force

  echo "✅ Project cleaned successfully!"
  echo "🚀 To restart, run: npm install"
else
  echo "❌ Cleanup cancelled."
fi
