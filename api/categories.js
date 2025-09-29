const express = require('express');
const router = express.Router();
const db = require('../event_db');

// GET /api/categories - 获取所有活动分类
router.get('/', async (req, res) => {
  try {
    const categories = await db.getAllCategories();
    
    res.json({
      success: true,
      data: categories,
      count: categories.length,
      message: '成功获取分类列表'
    });
  } catch (error) {
    console.error('获取分类列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: process.env.NODE_ENV === 'development' ? error.message : '获取分类列表失败'
    });
  }
});

module.exports = router;
