const mysql = require('mysql2/promise');
const config = require('./config');

// 创建数据库连接池
const pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});

// 测试数据库连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('数据库连接成功！');
    console.log('Connected to MySQL database:', config.database.database);
    connection.release();
    return true;
  } catch (error) {
    console.error('数据库连接失败:', error.message);
    return false;
  }
}

// 获取所有活跃的慈善活动
async function getAllActiveEvents() {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        e.id,
        e.name,
        e.description,
        e.location,
        e.event_date,
        e.end_date,
        e.ticket_price,
        e.goal_amount,
        e.current_amount,
        e.max_participants,
        e.current_participants,
        e.image_url,
        e.is_featured,
        o.name AS organization_name,
        c.name AS category_name,
        CASE 
          WHEN e.event_date > NOW() THEN 'upcoming'
          WHEN e.event_date <= NOW() AND e.end_date >= NOW() THEN 'ongoing'
          ELSE 'past'
        END AS event_status,
        ROUND((e.current_amount / e.goal_amount) * 100, 2) AS progress_percentage
      FROM events e
      JOIN organizations o ON e.organization_id = o.id
      JOIN categories c ON e.category_id = c.id
      WHERE e.status = 'active'
      ORDER BY e.is_featured DESC, e.event_date ASC
    `);
    return rows;
  } catch (error) {
    console.error('获取活动列表失败:', error);
    throw error;
  }
}

// 根据ID获取特定活动详情
async function getEventById(eventId) {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        e.*,
        o.name AS organization_name,
        o.description AS organization_description,
        o.email AS organization_email,
        o.phone AS organization_phone,
        o.website AS organization_website,
        c.name AS category_name,
        c.description AS category_description,
        CASE 
          WHEN e.event_date > NOW() THEN 'upcoming'
          WHEN e.event_date <= NOW() AND e.end_date >= NOW() THEN 'ongoing'
          ELSE 'past'
        END AS event_status,
        ROUND((e.current_amount / e.goal_amount) * 100, 2) AS progress_percentage
      FROM events e
      JOIN organizations o ON e.organization_id = o.id
      JOIN categories c ON e.category_id = c.id
      WHERE e.id = ? AND e.status = 'active'
    `, [eventId]);
    
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('获取活动详情失败:', error);
    throw error;
  }
}

// 搜索活动（根据日期、地点、分类）
async function searchEvents(filters) {
  try {
    let query = `
      SELECT 
        e.id,
        e.name,
        e.description,
        e.location,
        e.event_date,
        e.end_date,
        e.ticket_price,
        e.goal_amount,
        e.current_amount,
        e.image_url,
        o.name AS organization_name,
        c.name AS category_name,
        CASE 
          WHEN e.event_date > NOW() THEN 'upcoming'
          WHEN e.event_date <= NOW() AND e.end_date >= NOW() THEN 'ongoing'
          ELSE 'past'
        END AS event_status,
        ROUND((e.current_amount / e.goal_amount) * 100, 2) AS progress_percentage
      FROM events e
      JOIN organizations o ON e.organization_id = o.id
      JOIN categories c ON e.category_id = c.id
      WHERE e.status = 'active'
    `;
    
    const params = [];
    
    // 按日期筛选
    if (filters.startDate) {
      query += ` AND e.event_date >= ?`;
      params.push(filters.startDate);
    }
    
    if (filters.endDate) {
      query += ` AND e.event_date <= ?`;
      params.push(filters.endDate + ' 23:59:59');
    }
    
    // 按地点筛选
    if (filters.location) {
      query += ` AND e.location LIKE ?`;
      params.push(`%${filters.location}%`);
    }
    
    // 按分类筛选
    if (filters.categoryId) {
      query += ` AND e.category_id = ?`;
      params.push(filters.categoryId);
    }
    
    query += ` ORDER BY e.event_date ASC`;
    
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('搜索活动失败:', error);
    throw error;
  }
}

// 获取所有活动分类
async function getAllCategories() {
  try {
    const [rows] = await pool.execute(`
      SELECT id, name, description
      FROM categories
      ORDER BY name ASC
    `);
    return rows;
  } catch (error) {
    console.error('获取分类列表失败:', error);
    throw error;
  }
}

// 获取组织信息
async function getOrganizationInfo() {
  try {
    const [rows] = await pool.execute(`
      SELECT name, description, email, phone, address, website, logo_url
      FROM organizations
      LIMIT 1
    `);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('获取组织信息失败:', error);
    throw error;
  }
}

// 获取统计信息
async function getStatistics() {
  try {
    const [totalEvents] = await pool.execute(`
      SELECT COUNT(*) as total FROM events WHERE status = 'active'
    `);
    
    const [totalFunds] = await pool.execute(`
      SELECT SUM(current_amount) as total FROM events WHERE status = 'active'
    `);
    
    const [totalParticipants] = await pool.execute(`
      SELECT SUM(current_participants) as total FROM events WHERE status = 'active'
    `);
    
    return {
      totalEvents: totalEvents[0].total,
      totalFunds: totalFunds[0].total || 0,
      totalParticipants: totalParticipants[0].total || 0
    };
  } catch (error) {
    console.error('获取统计信息失败:', error);
    throw error;
  }
}

module.exports = {
  pool,
  testConnection,
  getAllActiveEvents,
  getEventById,
  searchEvents,
  getAllCategories,
  getOrganizationInfo,
  getStatistics
};
