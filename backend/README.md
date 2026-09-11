# Linsy Risk Bill API

分层 Express API（H5 年度风险账单 + 管理后台）。

## Stack

- Node.js 20 + TypeScript + Express
- **MySQL 8+**
- JWT（管理端）+ API Key（导入集成）
- Zod 校验、Swagger、Winston

## Quick start（本地 MySQL）

1. 确认本机 MySQL 服务已启动（如 Windows 服务 `MySQL80`）
2. 配置 `.env`：

```bash
cd backend
cp .env.example .env
```

将 `DATABASE_URL` 改成你的账号密码，例如：

```env
DATABASE_URL=mysql://root:你的密码@127.0.0.1:3306/linsy_risk_bill
```

3. 安装依赖并初始化：

```bash
npm install
npm run migrate
npm run seed
npm run dev
```

- API: http://localhost:3000/api
- Swagger: http://localhost:3000/api/docs
- Health: http://localhost:3000/api/health

默认管理员（seed 后）：`admin` / `admin123456`

> `migrate` 会自动 `CREATE DATABASE IF NOT EXISTS`，无需手工建库。

## Docker（可选）

```bash
docker compose up -d mysql
# 然后把 DATABASE_URL 设为：
# mysql://bill:bill_secret@127.0.0.1:3306/linsy_risk_bill
npm run migrate && npm run seed && npm run dev
```

## Key endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/bill/data?token=` | — | H5 账单数据 |
| GET | `/api/bill/:year/:token/data` | — | 同上（带年份） |
| POST | `/api/auth/login` | — | 管理端登录 |
| GET/POST | `/api/admin/campaigns` | Admin JWT | 年度配置列表 / 创建 |
| GET/PUT/DELETE | `/api/admin/campaigns/:id` | Admin JWT | 配置详情 / 保存 / 删除 |
| POST | `/api/admin/campaigns/:id/publish` | Admin JWT | 按部门发布链接 |
| GET | `/api/admin/campaigns/templates/default` | Admin JWT | 默认全量模板 |
| POST | `/api/admin/import` | JWT / API Key | 导入单条账单 |
| POST | `/api/admin/import/bulk` | JWT / API Key | 批量导入 |
| GET | `/api/admin/links` | Admin JWT | 链接列表 |
| POST | `/api/admin/links` | Admin JWT | 生成链接 |
| GET | `/api/admin/stats` | Admin JWT | 访问统计 |

管理后台 UI 见仓库根目录 `admin/`（端口 5180）。

## Frontend integration

Set in `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

Open: `/bill/2025?token=<token>`

## Scripts

- `npm run dev` — development with hot reload
- `npm run build` / `npm start` — production
- `npm run migrate` — apply SQL migrations（MySQL）
- `npm run seed` — create default admin
