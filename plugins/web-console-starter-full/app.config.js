// ============================================================
// web-console-starter · 全站单点配置（模板占位版）
// ------------------------------------------------------------
// 使用方式：复制为项目根目录 `app.config.js` 并修改以下字段。
// init-app.ps1 会读取本文件完成：package.json name、index.html
// title、store localStorage key、登录页/侧栏品牌文案 的自动写入。
// 换肤：只需改 `skin` 字段，组件/布局零改动。
// ============================================================

export default {
  // ---- 应用身份（五处名称同步的核心）----
  name: 'MyConsole',            // package.json name / 技术标识（小写英文）
  title: '综合管理控制台',        // 浏览器标题 / 登录页主标题
  subtitle: '业务系统通用模板 · 演示样例', // 登录页/侧栏副标题
  logoText: 'MC',               // 侧栏/登录页 logo 方块内文字（建议 2~4 字符）

  // ---- 主题皮肤 ----
  // 内置：deep-blue(默认) / light-pro / emerald-dark / royal-purple
  // 新皮肤：运行 scripts/new-skin.ps1 -Accent <hex> -Name <skin-name>
  skin: 'deep-blue',

  // ---- 网络 ----
  apiBase: '/api/v1',           // 后端 API 前缀（须与 backend 路由一致）
  devPort: 5180,                // 前端 dev server 端口
  devProxyTarget: 'http://127.0.0.1:3000', // dev 时 /api 代理到的后端地址

  // ---- 鉴权 ----
  defaultAccountHint: '默认账号 admin / admin123（首启请修改）', // 登录页提示文案

  // ---- 功能开关 ----
  skinPreview: true,            // 是否在设置页提供皮肤预览切换
}
