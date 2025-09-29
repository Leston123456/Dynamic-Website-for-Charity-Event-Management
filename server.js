const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const db = require('./event_db');

// 导入API路由
const eventsRoutes = require('./api/events');
const categoriesRoutes = require('./api/categories');
const organizationsRoutes = require('./api/organizations');

const app = express();
const PORT = config.server.port || 3000;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// API路由
app.use('/api/events', eventsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/organizations', organizationsRoutes);

// 健康检查端点
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await db.testConnection();
    res.json({
      success: true,
      message: '服务运行正常',
      timestamp: new Date().toISOString(),
      database: dbStatus ? '连接正常' : '连接失败'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务异常',
      error: error.message
    });
  }
});

// 首页路由 - 服务客户端HTML文件
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 搜索页面路由
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

// 活动详情页面路由
app.get('/event/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'event-details.html'));
});

// 404处理
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({
      success: false,
      message: 'API端点不存在'
    });
  } else {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  }
});

// 全局错误处理中间件
app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? error.message : '请稍后重试'
  });
});

// 启动服务器
async function startServer() {
  try {
    // 测试数据库连接
    const dbConnected = await db.testConnection();
    if (!dbConnected) {
      console.error('警告: 数据库连接失败，服务器仍将启动但功能可能受限');
    }
    
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log('🎉 慈善活动管理系统服务器启动成功!');
      console.log(`🌐 服务器地址: http://localhost:${PORT}`);
      console.log(`📊 API端点: http://localhost:${PORT}/api`);
      console.log(`💾 数据库: ${config.database.host}:3306/${config.database.database}`);
      console.log(`⏰ 启动时间: ${new Date().toLocaleString()}`);
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
}

// 优雅关闭处理
process.on('SIGTERM', () => {
  console.log('收到SIGTERM信号，正在关闭服务器...');
  if (db.pool) {
    db.pool.end();
  }
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('收到SIGINT信号，正在关闭服务器...');
  if (db.pool) {
    db.pool.end();
  }
  process.exit(0);
});

// 启动服务器
startServer();

module.exports = app;
