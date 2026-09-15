# 林氏风险账单 · 管理后台

独立于 H5 账单客户端（`frontend/`）的运营配置端。

## 能力

1. 管理员登录 / 修改密码 / 账号管理（创建、停用、重置密码、删除）  
2. 创建年度配置，载入全量默认模板（与 H5 Mock 对齐）  
3. **Excel 主路径填报**：下载多 Sheet 模板 → 上传预览变更 → 写入表单  
4. **按 H5 分屏侧边导航微调**：封面 / 风险分类 / 整改概况 / 合规数读 / 阻击战 / 重大风险 / 分类宣导…  
5. 维护部门列表，一键发布：按部门生成独立浏览链接  

## 启动

先确保后端 API 已启动（默认 `http://localhost:3000`），并完成数据库迁移：

```bash
cd backend
npm run migrate
npm run seed
npm run dev
```

再启动管理后台：

```bash
cd admin
npm install
npm run dev
```

访问：http://localhost:5180  

默认账号（seed 后）：`admin` / `admin123456`

## 环境变量

| 变量 | 说明 | 默认 |
|------|------|------|
| `VITE_API_BASE_URL` | API 根路径 | `/api`（开发态走 Vite 代理到 3000） |

## 推荐配置流程

1. 打开年度配置 → **下载 Excel 模板**  
2. 按 Sheet 填报（公司公共、风险分类、整改概况、合规数读、部门列表、部门聚焦等）  
3. **上传表格** → 确认导入预览 → 写入表单  
4. 左侧按分屏微调文案（高亮用 `[[数字]]`）  
5. **保存并发布部门链接** → 复制发给各部门主管  

## 发布逻辑

- 统一内容保存在 `bill_campaigns.base_payload`  
- 各部门可有 `overrides` 差异字段  
- 发布时：`deepMerge(base, overrides)` → 写入 `bill_data`，并生成/更新 `bill_links`  
- 链接员工号约定：`DEPT_{YEAR}_{DEPT_CODE}`  
- H5 打开：`{BASE_URL}/bill/{year}?token=...`
