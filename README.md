# MyQQ - 简约群聊天应用 v1.1.0

一个基于WebSocket的实时群聊天应用，具有简约美观的界面和完整的聊天功能。

## 🚀 功能特性

### v1.1.0 新增功能
- ✅ **修复在线人数显示** - 新用户连接时立即显示准确的在线人数
- ✅ **消息布局优化** - 我方消息右对齐，对方消息左对齐（仿微信/QQ样式）
- ✅ **中英文切换** - 支持一键切换系统语言（中文/英文）
- ✅ **移动端优化** - 响应式设计，完美适配手机和平板
- ✅ **实时在线人数** - 精确显示当前在线用户数量

### 核心功能
- 🔗 **实时通信** - 基于WebSocket的即时消息传递
- 📱 **响应式设计** - 支持桌面、平板、手机多端访问
- 💾 **消息历史** - 自动保存聊天记录，新用户可查看历史消息
- 👥 **用户管理** - 自动生成用户名，支持用户加入/离开通知
- 🎨 **美观界面** - 现代化UI设计，支持深色/浅色主题适配

## 🛠️ 技术栈

- **后端**: Node.js + Express + WebSocket (ws)
- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **通信**: WebSocket 实时双向通信
- **部署**: 支持HTTP/HTTPS协议自动适配

## 📦 安装与运行

### 快速开始
```bash
# 克隆项目
git clone https://github.com/Kevin-HYX/MyQQ.git
cd MyQQ

# 安装依赖
npm install

# 启动服务器
npm start

# 访问应用
打开浏览器访问: http://localhost:3000
```

### 生产环境部署
```bash
# 设置环境变量
export PORT=80  # 或其他端口

# 启动服务器
node server.js
```

## 🌐 在线体验

公网访问地址: http://14.103.165.233:3000

## 📱 移动端使用

- **iPhone/iPad**: 支持Safari、Chrome浏览器
- **Android**: 支持Chrome、Firefox、Edge等浏览器
- **响应式优化**: 自动适配不同屏幕尺寸

## 🔄 版本历史

### v1.1.0 (当前版本)
- 修复在线人数显示bug
- 优化消息布局（左右对齐）
- 增加中英文语言切换
- 移动端响应式优化

### v1.0.0
- 基础聊天功能
- WebSocket实时通信
- 消息历史记录
- 用户加入/离开通知