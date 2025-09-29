const express = require('express');
const router = express.Router();
const db = require('../event_db');

// GET /api/events - 获取所有活跃的慈善活动
router.get('/', async (req, res) => {
  try {
    const events = await db.getAllActiveEvents();
    
    res.json({
      success: true,
      data: events,
      message: '成功获取活动列表'
    });
  } catch (error) {
    console.error('获取活动列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: process.env.NODE_ENV === 'development' ? error.message : '获取活动列表失败'
    });
  }
});

// GET /api/events/featured - 获取精选活动
router.get('/featured', async (req, res) => {
  try {
    const events = await db.getAllActiveEvents();
    const featuredEvents = events.filter(event => event.is_featured);
    
    res.json({
      success: true,
      data: featuredEvents,
      message: '成功获取精选活动'
    });
  } catch (error) {
    console.error('获取精选活动错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: process.env.NODE_ENV === 'development' ? error.message : '获取精选活动失败'
    });
  }
});

// GET /api/events/search - 搜索活动
router.get('/search', async (req, res) => {
  try {
    const { startDate, endDate, location, categoryId } = req.query;
    
    // 构建筛选条件
    const filters = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (location) filters.location = location;
    if (categoryId) filters.categoryId = parseInt(categoryId);
    
    const events = await db.searchEvents(filters);
    
    res.json({
      success: true,
      data: events,
      filters: filters,
      count: events.length,
      message: '搜索完成'
    });
  } catch (error) {
    console.error('搜索活动错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: process.env.NODE_ENV === 'development' ? error.message : '搜索活动失败'
    });
  }
});

// GET /api/events/:id - 获取特定活动详情
router.get('/:id', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    
    if (isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        message: '无效的活动ID'
      });
    }
    
    const event = await db.getEventById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: '活动不存在'
      });
    }
    
    res.json({
      success: true,
      data: event,
      message: '成功获取活动详情'
    });
  } catch (error) {
    console.error('获取活动详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: process.env.NODE_ENV === 'development' ? error.message : '获取活动详情失败'
    });
  }
});

module.exports = router;
