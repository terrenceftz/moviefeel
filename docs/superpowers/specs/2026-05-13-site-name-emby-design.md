# 站点名称 + Emby 服务器对接

## 目标

1. 设置页面增加站点名称修改功能，替换硬编码的 "Cinema.Archive"
2. 设置页面新增 Emby 服务器配置，首页新增 "最新入库" 模块展示 Emby 最新影视

---

## 1. 新增 configService.ts

### 文件：`src/services/configService.ts`

统一管理站点级配置，所有值持久化到 localStorage。

**存储键：**
| 键 | 默认值 | 说明 |
|----|--------|------|
| `cinema_site_name` | `"Cinema.Archive"` | 站点名称 |
| `cinema_emby_config` | `null` | Emby 服务器配置 JSON |

**导出函数：**
```typescript
getSiteName(): string
setSiteName(name: string): void

getEmbyConfig(): { serverUrl: string, apiToken: string } | null
setEmbyConfig(serverUrl: string, apiToken: string): void
clearEmbyConfig(): void
```

---

## 2. 新增 embyService.ts

### 文件：`src/services/embyService.ts`

通过服务器代理调用 Emby API。

**导出类型：**
```typescript
interface EmbyItem {
  id: string
  name: string
  type: 'Movie' | 'Series'
  year?: number
  imageUrl?: string
  backdropUrl?: string
  dateCreated: string
  overview?: string
}
```

**导出函数：**
```typescript
fetchRecentItems(): Promise<EmbyItem[]>
  // 从 configService 读取 Emby 配置，未配置返回 []
  // GET /api/emby-proxy?path=/emby/Items?...&api_token=xxx
  // 异常时返回 []

testEmbyConnection(serverUrl: string, apiToken: string): Promise<boolean>
  // 通过代理测试连接，返回 true/false
```

---

## 3. 新增 RecentImports.tsx

### 文件：`src/components/RecentImports.tsx`

首页水平滚动的最新入库卡片列表。

**Props:** `{ layoutStyle: 'swiss' | 'brutalist' | 'neo' }`

**行为：**
- `useEffect` 挂载时调用 `fetchRecentItems()`
- 无数据时返回 `null`（不渲染任何内容）
- 加载中显示骨架占位
- 有数据时渲染：标题区 "最新入库 / Recent Imports" + 水平滚动卡片列表

**每张卡片：**
- 海报图（无海报时显示占位图）
- 底部渐隐叠加层显示标题、年份
- 类型角标（电影/电视剧）
- 入库日期（格式化为相对时间如 "3天前"）
- 点击无操作（仅展示用途）

---

## 4. 修改 server.ts

新增 Emby 代理路由：

```
GET /api/emby-proxy?url=<urlencoded-full-url>
```

客户端构造完整 Emby API URL（含 serverUrl + path + api_key），通过 `url` query 参数传给代理。服务端直接请求该 URL，设置 Chrome User-Agent 请求头，返回 JSON。此设计避免服务端需要知道 Emby 地址，token 也不经过服务端存储。

---

## 5. 修改 SettingsPanel.tsx

### 新增 "站点设置" 卡片

在账号管理卡片上方插入：

- 站点名称输入框（默认值从 `getSiteName()` 读取）
- 保存按钮
- 保存成功后更新全局站点名称

### 新增 "Emby 服务器" 卡片

在 TMDB 配置卡片下方插入：

- 服务器地址输入框（placeholder: `https://emby.yourdomain.com`）
- API 令牌输入框（带显示/隐藏切换，type=password）
- 测试连接按钮（调用 `testEmbyConnection`）
- 保存按钮
- 状态信息行：已配置/未配置

---

## 6. 修改其他组件

### Navigation.tsx
- 品牌名 "Cinema.Archive" → `configService.getSiteName()`
- 使用 `useState` + 自定义事件 `site-name-changed` 实现响应式更新

### Footer.tsx
- 品牌名 "Cinema.Archive" → `configService.getSiteName()`
- 描述中的 "Cinema.Archive" → 动态读取

### App.tsx
- 新增 `useEffect`：`document.title = getSiteName()`
- 监听 `site-name-changed` 事件更新 title

### GridGallery.tsx
- 在 `CinemaHero` 之后、收藏区域之前，插入 `<RecentImports layoutStyle={layoutStyle} />`

---

## 7. 文件变更清单

| 操作 | 文件 | 说明 |
|------|------|------|
| 新增 | `src/services/configService.ts` | 站点名称 + Emby 配置 |
| 新增 | `src/services/embyService.ts` | Emby API 调用 |
| 新增 | `src/components/RecentImports.tsx` | 最新入库模块 |
| 修改 | `server.ts` | 新增 `/api/emby-proxy` |
| 修改 | `src/components/SettingsPanel.tsx` | 站点设置 + Emby 卡片 |
| 修改 | `src/components/Navigation.tsx` | 动态品牌名 |
| 修改 | `src/components/Footer.tsx` | 动态品牌名 |
| 修改 | `src/App.tsx` | 动态 title |
| 修改 | `src/components/GridGallery.tsx` | 嵌入 RecentImports |
