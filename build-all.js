const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始构建前端、后端和后台...');

// 1. 后端：安装依赖、生成 Prisma Client 并编译
console.log('\n📦 生成 Prisma Client 并编译后端...');
execSync('cd backend && npm install --include=dev && npx prisma generate && npm run build', { stdio: 'inherit' });

// 1b. 供 Vercel Serverless 打包：把编译后的路由放进 api/ 下（避免仅依赖 ../backend/dist 被 NFT 漏打）
console.log('\n📦 复制后端 dist 到 api/.server-dist（Vercel 函数可追踪）...');
const serverDistSrc = path.join(__dirname, 'backend', 'dist');
const serverDistDest = path.join(__dirname, 'api', '.server-dist');
fs.rmSync(serverDistDest, { recursive: true, force: true });
fs.mkdirSync(serverDistDest, { recursive: true });
copyRecursiveSync(serverDistSrc, serverDistDest);

// 1c. 在 api/.server-dist 安装与 backend 相同的生产依赖（含 multer 等），并在此目录生成 Prisma Client，供 Serverless 解析
console.log('\n📦 在 api/.server-dist 安装运行时依赖并同步 Prisma Client...');
const backendPkgPath = path.join(__dirname, 'backend', 'package.json');
const backendPkg = JSON.parse(fs.readFileSync(backendPkgPath, 'utf8'));
const bundlePkg = {
  name: 'shop-api-serverless',
  private: true,
  version: '1.0.0',
  dependencies: { ...backendPkg.dependencies },
};
fs.writeFileSync(
  path.join(serverDistDest, 'package.json'),
  JSON.stringify(bundlePkg, null, 2),
  'utf8'
);
execSync('npm install --omit=dev --no-audit --no-fund', { stdio: 'inherit', cwd: serverDistDest });
// Prisma CLI 在子目录执行时仍可能写回 backend/node_modules，这里直接复制 backend 已生成的客户端
console.log('   → 同步 Prisma 生成物到 api/.server-dist/node_modules');
const backendNm = path.join(__dirname, 'backend', 'node_modules');
const serverNm = path.join(serverDistDest, 'node_modules');
for (const rel of ['.prisma', path.join('@prisma', 'client')]) {
  const src = path.join(backendNm, rel);
  const dest = path.join(serverNm, rel);
  if (!fs.existsSync(src)) {
    throw new Error('缺少 Prisma 生成物，请先确认 backend 下 prisma generate 成功: ' + src);
  }
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  copyRecursiveSync(src, dest);
}

// 2. 前端：构建用户端
console.log('\n🎨 构建用户前端...');
execSync('cd frontend && npm install --include=dev && npm run build', { stdio: 'inherit' });

// 3. 后台：构建管理端
console.log('\n🔧 构建后台管理...');
execSync('cd admin && npm install --include=dev && npm run build', { stdio: 'inherit' });

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
