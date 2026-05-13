# 账号管理 — 设置页面增加用户名密码修改

## 目标

在设置页面增加账号管理功能，支持修改管理员用户名和密码，认证逻辑从硬编码迁移到 localStorage 持久化存储。

---

## 1. 新增 authService.ts

### 文件：`src/services/authService.ts`

封装管理员凭证的读写和验证。

**存储键：** `localStorage('cinema_admin_credentials')`
**默认值：** `{ username: "Terrence", password: "admin123" }`
**安全级别：** 明文存储（本地个人应用）

**导出函数：**

```typescript
// 获取当前凭证，首次使用时写入默认值
getCredentials(): { username: string, password: string }

// 验证用户名密码是否匹配
validateCredentials(username: string, password: string): boolean

// 修改用户名（需验证当前密码）
updateUsername(currentPassword: string, newUsername: string): { success: boolean, error?: string }

// 修改密码（需验证当前密码）
updatePassword(currentPassword: string, newPassword: string): { success: boolean, error?: string }
```

**业务规则：**
- `updateUsername`: 当前密码必须匹配，新用户名不能为空，不能与旧用户名相同
- `updatePassword`: 当前密码必须匹配，新密码不能为空

---

## 2. 修改 LoginForm.tsx

将硬编码验证 `username === 'Terrence' && password === 'admin123'` 替换为：

```typescript
import { validateCredentials } from '../services/authService';

// 在 handleSubmit 中:
if (validateCredentials(username, password)) {
  onLogin();
} else {
  setError('凭据不正确。身份验证失败。');
}
```

---

## 3. 修改 SettingsPanel.tsx

### Hero 描述更新

`"管理 TMDB API 连接与系统配置"` → `"管理 TMDB API 连接、账号与系统配置"`

### 新增"账号管理"卡片

在 TMDB API 配置卡片与 Attributions 之间插入第二个卡片，结构如下：

**卡片标题：** 账号管理（带图标 UserCog）

**修改用户名区域：**
- 当前密码输入框（type=password，带 Lock 图标）
- 新用户名输入框（带 User 图标）
- 保存按钮（带状态反馈：保存中 → 已保存/错误提示）

**修改密码区域：**
- 分隔线
- 当前密码输入框
- 新密码输入框
- 确认新密码输入框
- 保存按钮

**交互规则：**
- 修改用户名/密码前必须验证当前密码
- 新密码需与确认密码一致
- 成功显示 "已保存"（2秒），失败显示红色错误信息
- 卡片风格与 TMDB 卡片完全一致（style-adaptive）

---

## 4. 文件变更清单

| 操作 | 文件 | 说明 |
|------|------|------|
| 新增 | `src/services/authService.ts` | 凭证管理服务 |
| 修改 | `src/components/LoginForm.tsx` | 使用 authService 验证 |
| 修改 | `src/components/SettingsPanel.tsx` | 新增账号管理卡片 |
