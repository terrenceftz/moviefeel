# 移除 Gemini AI + 新增 TMDB 设置管理页面

## 目标

1. 移除 Google Gemini AI 依赖，用本地规则从 TMDB 数据推导电影元数据
2. 新增独立全屏管理页面，允许管理员填写 TMDB API Read Access Token
3. tmdbService.ts 改为优先读取 localStorage，fallback 到环境变量

---

## 1. AI 替代：本地规则推导模块

### 新增文件：`src/services/metadataService.ts`

替代 `geminiService.ts` 的 `enhanceMovieMetadata()`，输出相同结构但由本地规则计算。

### 映射逻辑

#### 情绪标签 (moodTags)

类型到标签的硬映射表，每部电影取匹配 genres 的最多 3 个标签：

| Genre | 标签 |
|-------|------|
| Drama | #深刻 |
| Sci-Fi | #未来 |
| Action | #激烈 |
| Romance | #浪漫 |
| Thriller | #紧张 |
| Mystery | #悬疑 |
| Comedy | #轻松 |
| Horror | #惊悚 |
| Fantasy | #奇幻 |
| Documentary | #真实 |
| Animation | #梦幻 |
| History | #史诗 |
| War | #沉重 |
| Crime | #黑暗 |
| Adventure | #探索 |
| Music | #韵律 |

#### 情感五维图 (emotionalProfile)

5 个维度，每个维度每种类型有基础权重，取电影 genres 中贡献最高值，再用 `voteAverage/10` 做 ±10% 系数微调：

| 维度 | 主要贡献类型 |
|------|-------------|
| 情感深度 | Drama(+40), Romance(+30) |
| 视觉冲击 | Action(+40), Sci-Fi(+35), Fantasy(+30) |
| 叙事张力 | Thriller(+40), Mystery(+35), Crime(+35) |
| 人文关怀 | Documentary(+40), History(+35), War(+30) |
| 想象力 | Sci-Fi(+40), Fantasy(+40), Animation(+35) |

每维度基础值 15，取 genres 中该维度最高权重相加（上限 100）。

#### 主色调 (primaryColor)

类型到 Hex 颜色映射，取第一个匹配 genre 的颜色：

| Genre | Color |
|-------|-------|
| Drama | #4A4A6A |
| Sci-Fi | #00B4D8 |
| Action | #E63946 |
| Romance | #E07A9E |
| Thriller | #2D2D3F |
| Mystery | #3D405B |
| Comedy | #F4A261 |
| Horror | #1A1A1A |
| Fantasy | #9B5DE5 |
| Documentary | #606C38 |
| Animation | #F77F00 |
| 默认 | #6C63FF |

#### 经典台词 (quote)

TMDB 无法提供，保留为空字符串。用户在 MovieForm 中手动输入。

---

## 2. 管理页面

### 新增文件：`src/components/SettingsPanel.tsx`

- **入口**：导航栏最右侧齿轮图标（仅登录后可见）
- **类型**：全屏独立页面，与 SummaryParallaxView 布局风格一致
- **排版**：顶部 Hero 标题区 + 中间表单卡片区 + 底部状态区

### 功能

| 功能 | 说明 |
|------|------|
| Token 输入 | 带 mask 的输入框，显示/隐藏切换按钮 |
| 保存 | 写入 `localStorage('cinema_tmdb_token')` |
| 连接测试 | 调用 TMDB `/authentication` 端点，显示通过/失败状态 |
| 状态展示 | 当前是否已配置 Token、连接状态 |

### 状态管理

- `ViewMode` 新增 `'settings'`
- 条件渲染：`viewMode === 'settings'` → `<SettingsPanel>`（与其他视图模式一致）
- Navigation 新增 settings 按钮，调用 `setView('settings')`

---

## 3. tmdbService.ts 改造

### Token 读取优先级

```
localStorage('cinema_tmdb_token')  →  import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN
```

新增 `getAccessToken()` 函数，集中处理读取逻辑。`getHeaders()` 调用此函数。

---

## 4. 清理工作

### 删除
- `src/services/geminiService.ts`
- `package.json` 中 `@google/genai` 依赖
- `vite.config.ts` 中 `process.env.GEMINI_API_KEY` 注入

### 修改
- `MovieForm.tsx`：`enhanceMovieMetadata` 导入改为 `metadataService.ts`，quote 字段改为可手动输入
- `Footer.tsx`："Built with Antigravity AI Engine" → "Built with TMDB & Cinema Archive"
- `metadata.json`：移除 AI 相关 capabilities
- `index.html`：title 改为 "Cinema Archive"

---

## 5. 文件变更清单

| 操作 | 文件 |
|------|------|
| 新增 | `src/services/metadataService.ts` |
| 新增 | `src/components/SettingsPanel.tsx` |
| 删除 | `src/services/geminiService.ts` |
| 修改 | `src/types.ts` — ViewMode 加 `'settings'` |
| 修改 | `src/services/tmdbService.ts` — getAccessToken() |
| 修改 | `src/components/MovieForm.tsx` — 替换 AI 调用 |
| 修改 | `src/components/Navigation.tsx` — 加 settings 入口 |
| 修改 | `src/App.tsx` — 加 settings 视图路由 + 状态 |
| 修改 | `src/components/Footer.tsx` — 改文案 |
| 修改 | `package.json` — 删 @google/genai |
| 修改 | `vite.config.ts` — 删 GEMINI_API_KEY |
| 修改 | `index.html` — 改 title |
| 修改 | `metadata.json` — 删 AI capabilities |
