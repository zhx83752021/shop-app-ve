# Supabase 数据库初始化步骤

## 📌 问题说明

你遇到的错误：`relation "categories" does not exist`

**原因**：数据库中还没有创建表结构，需要先建表再插入数据。

## ✅ 解决方案：在 Supabase 控制台执行完整初始化脚本

### 步骤 1：打开 Supabase SQL 编辑器

1. **访问 Supabase Dashboard**

   ```
   https://supabase.com/dashboard
   ```

2. **选择你的项目**

   - 找到数据库项目（应该显示连接信息）

3. **打开 SQL Editor**
   - 点击左侧菜单的 **SQL Editor**（或者直接点击 SQL 图标）
   - 点击右上角 **New query** 按钮

### 步骤 2：复制并执行初始化脚本

1. **打开文件**

   - 在项目中找到文件：**`完整建表脚本.sql`** ⚠️ 注意：使用这个文件！

2. **复制全部内容**

   - 打开文件，按 `Ctrl + A` 全选
   - 按 `Ctrl + C` 复制

3. **粘贴到 SQL 编辑器**

   - 在 Supabase SQL Editor 中粘贴（`Ctrl + V`）

4. **执行脚本**

   - 点击右下角绿色的 **Run** 按钮
   - 或按 `Ctrl + Enter`

5. **等待执行完成**
   - 脚本会自动：
     - ✅ 删除旧表（如果存在）
     - ✅ 创建枚举类型
     - ✅ 创建所有表结构
     - ✅ 插入初始数据
   - 大约需要 5-10 秒

### 步骤 3：验证结果

执行完成后，应该看到创建了 **21 个表**：

**所有表列表**：

1. addresses - 收货地址
2. admins - 管理员
3. banners - 轮播图
4. browse_history - 浏览历史
5. cart_items - 购物车
6. categories - 商品分类
7. comments - 评论
8. coupons - 优惠券
9. favorites - 收藏
10. follows - 关注关系
11. order_items - 订单项
12. orders - 订单
13. post_likes - 帖子点赞
14. post_products - 帖子商品关联
15. posts - 帖子
16. products - 商品
17. rankings - 排行榜
18. refunds - 退款
19. skus - 商品 SKU
20. user_coupons - 用户优惠券
21. users - 用户

**初始数据统计**：

```
数据类型   | 数量
-----------|-----
分类       | 5
轮播图     | 3
商品       | 12
优惠券     | 2
```

## 🚀 完成后的操作

### 选项 A：直接测试线上环境

如果你的代码已经部署到 Vercel，直接访问：

```
https://shop.hybergy.cn/home
```

应该看到：

- ✅ 轮播图正常显示
- ✅ 商品列表有数据
- ✅ 所有模块正常工作

### 选项 B：本地测试

如果想在本地测试：

1. **启动后端**

   ```bash
   cd backend
   npm run dev
   ```

2. **启动前端**

   ```bash
   cd frontend
   npm run dev
   ```

3. **访问本地页面**
   ```
   http://localhost:5173/home
   ```

## 🔍 故障排查

### 问题 1：执行失败，提示权限错误

**解决方案**：确保使用的是 Supabase 项目的超级管理员账号

### 问题 2：某些表创建失败

**解决方案**：

1. 先执行脚本开头的 DROP 语句，清理旧数据
2. 再完整执行整个脚本

### 问题 3：页面仍显示"加载中..."

**检查步骤**：

1. 确认 SQL 执行成功，数据已插入
2. 检查浏览器控制台（F12）的 Network 标签
3. 查看 API 请求是否返回数据
4. 如果 API 返回空，可能是 Vercel 部署问题，需要重新部署

## 📝 重要提示

1. ✅ **只需执行一次**：数据库初始化只需要做一次
2. ✅ **不影响部署**：初始化数据与代码部署无关
3. ✅ **数据持久化**：插入的数据会永久保存，除非手动删除
4. ✅ **可重复执行**：脚本包含 DROP 语句，可以重复执行重置数据

## 🎯 下一步

数据库初始化完成后：

1. **部署代码到 GitHub**

   - 运行 `一键部署.bat`
   - 或手动执行 git 命令

2. **等待 Vercel 自动部署**

   - 访问 https://vercel.com/dashboard 查看状态

3. **访问线上地址验证**
   - https://shop.hybergy.cn/home
   - 应该看到完整的商品数据

---

**需要帮助？** 查看 `部署指南.md` 获取完整的部署流程说明。
