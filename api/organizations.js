const express = require('express');
const router = express.Router();
const db = require('../event_db');

// GET /api/organizations/info - 获取组织信息
router.get('/info', async (req, res) => {
  try {
    const organizationInfo = await db.getOrganizationInfo();
    
    if (!organizationInfo) {
      return res.status(404).json({
        success: false,
        message: '组织信息不存在'
      });
    }
    
    res.json({
      success: true,
      data: organizationInfo,
      message: '成功获取组织信息'
    });
  } catch (error) {
    console.error('获取组织信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: process.env.NODE_ENV === 'development' ? error.message : '获取组织信息失败'
    });
  }
});

// GET /api/organizations/statistics - 获取统计信息
router.get('/statistics', async (req, res) => {
  try {
    const statistics = await db.getStatistics();
    
    res.json({
      success: true,
      data: statistics,
      message: '成功获取统计信息'
    });
  } catch (error) {
    console.error('获取统计信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: process.env.NODE_ENV === 'development' ? error.message : '获取统计信息失败'
    });
  }
});

module.exports = router;
