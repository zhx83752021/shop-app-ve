const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始构建前端、后端和后台...');

// 1. 后端：安装依赖、执行数据库迁移、生成 Prisma Client 并编译
console.log('\n📦 执行数据库迁移、生成 Prisma Client 并编译后端...');
execSync('cd backend && npm install --include=dev && npx prisma migrate deploy && npx prisma generate && npm run build', { stdio: 'inherit' });

// 2. 前端：构建用户端
console.log('\n🎨 构建用户前端...');
execSync('cd frontend && npm install && npm run build', { stdio: 'inherit' });

// 3. 后台：构建管理端
console.log('\n🔧 构建后台管理...');
execSync('cd admin && npm install && npm run build', { stdio: 'inherit' });

// 4. 创建公共输出目录
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 5. 复制前端到 public/
console.log('\n📋 复制前端文件...');
const frontendDist = path.join(__dirname, 'frontend', 'dist');
copyRecursiveSync(frontendDist, publicDir);

// 6. 复制后台到 public/admin/
console.log('\n📋 复制后台文件...');
const adminDist = path.join(__dirname, 'admin', 'dist');
const adminTarget = path.join(publicDir, 'admin');
if (!fs.existsSync(adminTarget)) {
  fs.mkdirSync(adminTarget, { recursive: true });
}
copyRecursiveSync(adminDist, adminTarget);

console.log('\n✅ 构建完成！');
console.log('📁 输出目录: public/');
console.log('   - 用户前端: public/');
console.log('   - 后台管理: public/admin/');

// 递归复制函数
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}
