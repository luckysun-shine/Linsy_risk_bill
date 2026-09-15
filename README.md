# 林氏年度风险账单（Linsy Risk Bill）

沉浸式 H5 年度风险合规账单 + 运营管理后台 + Express API。  
视觉语言：**深空追光**（深空午夜蓝底 + 极光青强调 + 追光原画底图）。

## 仓库结构

```text
Linsy_risk_bill/
├── frontend/          # H5 账单浏览（Vue 3 + Vite，默认端口 5173）
├── admin/             # 管理后台（Vue 3 + Element Plus，默认端口 5180）
├── backend/           # API（Express + MySQL，默认端口 3000）
├── assets_source/     # 设计素材源文件
├── 需求说明书.md
├── 项目开发规划.md
└── 页面视觉规范.md
```

## 快速启动

### 1. 后端

```bash
cd backend
cp .env.example .env   # 配置 DATABASE_URL / JWT_SECRET / BASE_URL
npm install
npm run migrate
npm run seed
npm run dev
```

- API：http://localhost:3000/api  
- Swagger：http://localhost:3000/api/docs  
- 默认管理员：`admin` / `admin123456`

### 2. 管理后台

```bash
cd admin
npm install
npm run dev
```

访问：http://localhost:5180  

推荐流程：下载 Excel 模板 → 填报 → 上传预览写入 → 分屏微调 → 保存并发布部门链接。

### 3. H5 前端

```bash
cd frontend
npm install
npm run dev
```

访问：http://localhost:5173/bill/2025?token=\<token\>  
无 Token 时使用本地 Mock 数据。

## 核心能力（现行）

| 模块 | 能力 |
|------|------|
| H5 | 竖向翻页 + 页内滚动；Loading → 封面 → 风险分类 / 整改 / 合规数读 / 阻击战 / 部门聚焦 / 重大风险 / 分类宣导 |
| Admin | 年度配置、Excel 主路径导入、按 H5 分屏侧边导航微调、部门发布链接、账号 CRUD / 改密 |
| API | 账单 Token 拉取、Campaign 发布、导入 / 链接 / 统计、管理员用户管理 |

## 环境变量摘要

| 工程 | 变量 | 说明 |
|------|------|------|
| backend | `DATABASE_URL` | MySQL 连接串 |
| backend | `BASE_URL` | 生成部门外链时的 H5 根地址 |
| frontend / admin | `VITE_API_BASE_URL` | 默认 `/api`（开发态 Vite 代理到 3000） |

## 文档

- [需求说明书.md](./需求说明书.md) — 业务与功能需求  
- [项目开发规划.md](./项目开发规划.md) — 架构、完成度、阶段计划  
- [页面视觉规范.md](./页面视觉规范.md) — 深空追光视觉与分屏规范  
- [admin/README.md](./admin/README.md) — 管理后台操作说明  
- [backend/README.md](./backend/README.md) — API 启动与接口摘要  
