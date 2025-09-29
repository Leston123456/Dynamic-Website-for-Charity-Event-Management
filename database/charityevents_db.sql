-- 慈善活动管理系统数据库
-- 创建数据库
CREATE DATABASE IF NOT EXISTS charityevents_db;
USE charityevents_db;

-- 创建慈善组织表
CREATE TABLE organizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    website VARCHAR(255),
    logo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建活动分类表
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建慈善活动表
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    full_description LONGTEXT,
    location VARCHAR(255),
    address TEXT,
    event_date DATETIME NOT NULL,
    end_date DATETIME,
    registration_deadline DATETIME,
    ticket_price DECIMAL(10,2) DEFAULT 0.00,
    goal_amount DECIMAL(12,2),
    current_amount DECIMAL(12,2) DEFAULT 0.00,
    max_participants INT,
    current_participants INT DEFAULT 0,
    image_url VARCHAR(255),
    status ENUM('active', 'suspended', 'completed', 'cancelled') DEFAULT 'active',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_event_date (event_date),
    INDEX idx_location (location),
    INDEX idx_status (status),
    INDEX idx_category (category_id)
);

-- 插入慈善组织数据
INSERT INTO organizations (name, description, email, phone, address, website, logo_url) VALUES
('爱心基金会', '致力于帮助贫困儿童教育和医疗的非营利组织', 'info@lovefund.org', '(02) 1234-5678', '悉尼市中心123号', 'https://www.lovefund.org', '/images/love-fund-logo.jpg'),
('绿色地球协会', '专注于环境保护和可持续发展的公益组织', 'contact@greenearth.org', '(03) 9876-5432', '墨尔本环保大道456号', 'https://www.greenearth.org', '/images/green-earth-logo.jpg'),
('健康希望联盟', '为癌症患者及家属提供支持和帮助', 'support@healthhope.org', '(07) 5555-1234', '布里斯班医疗区789号', 'https://www.healthhope.org', '/images/health-hope-logo.jpg');

-- 插入活动分类数据
INSERT INTO categories (name, description) VALUES
('慈善晚宴', '正式的筹款晚宴活动，通常包含拍卖环节'),
('义跑活动', '慈善跑步活动，参与者通过跑步为慈善事业筹款'),
('静默拍卖', '无声拍卖活动，参与者通过书面出价竞拍物品'),
('音乐会', '慈善音乐演出，门票收入用于慈善目的'),
('义卖活动', '物品义卖，所得收入捐给慈善机构'),
('志愿服务', '社区志愿服务活动'),
('教育讲座', '慈善教育和意识提升讲座'),
('体育竞赛', '慈善体育比赛和竞技活动');

-- 插入慈善活动数据
INSERT INTO events (organization_id, category_id, name, description, full_description, location, address, event_date, end_date, registration_deadline, ticket_price, goal_amount, current_amount, max_participants, current_participants, image_url, status, is_featured) VALUES

(1, 1, '希望之夜慈善晚宴', '为贫困儿童教育筹款的精美晚宴', '这是一场温馨而富有意义的慈善晚宴，旨在为贫困地区的儿童教育事业筹集资金。晚宴将在豪华酒店举行，包含精美的晚餐、现场拍卖、音乐表演等环节。您的每一份捐助都将直接用于改善贫困儿童的教育条件，为他们提供更好的学习机会和未来。让我们携手为孩子们的明天点亮希望之光。', '悉尼', '悉尼希尔顿酒店大宴会厅', '2025-11-15 18:00:00', '2025-11-15 22:00:00', '2025-11-10 23:59:59', 150.00, 50000.00, 12500.00, 200, 45, '/images/hope-dinner.jpg', 'active', TRUE),

(2, 2, '绿色奔跑马拉松', '为环境保护事业而跑', '加入我们的绿色马拉松，为地球环境保护贡献力量！这是一场结合健身与公益的活动，参与者可以选择5公里、10公里或半程马拉松距离。活动路线经过悉尼最美丽的公园和海岸线，让您在享受运动乐趣的同时为环保事业筹款。所有参与者将获得纪念T恤和完赛奖牌，让我们一起跑向更绿色的未来！', '悉尼', '悉尼海德公园起点', '2025-10-20 07:00:00', '2025-10-20 12:00:00', '2025-10-15 23:59:59', 35.00, 25000.00, 8750.00, 500, 125, '/images/green-marathon.jpg', 'active', TRUE),

(3, 4, '治愈之声慈善音乐会', '用音乐传递希望与爱', '一场感人至深的慈善音乐会，汇集了澳大利亚最优秀的音乐家和歌手，为癌症研究和患者支持筹款。音乐会将在悉尼歌剧院举行，包含古典音乐、流行歌曲和原创作品。每一个音符都承载着对生命的敬意和对未来的希望。让我们通过音乐的力量，为那些正在与疾病抗争的勇士们送去温暖与支持。', '悉尼', '悉尼歌剧院音乐厅', '2025-12-03 19:30:00', '2025-12-03 22:00:00', '2025-11-25 23:59:59', 80.00, 40000.00, 15200.00, 300, 76, '/images/healing-concert.jpg', 'active', FALSE),

(1, 3, '艺术品慈善拍卖', '收藏艺术，传递爱心', '精心策划的艺术品慈善拍卖活动，展示来自本地和国际艺术家的优秀作品。拍卖品包括绘画、雕塑、摄影作品和手工艺品。这不仅是一个收藏艺术品的绝佳机会，更是支持儿童教育事业的良好途径。拍卖所得将全部用于为贫困儿童提供艺术教育资源，让更多孩子接触到艺术的美好。', '墨尔本', '墨尔本艺术中心展览厅', '2025-11-08 14:00:00', '2025-11-08 17:00:00', '2025-11-03 23:59:59', 25.00, 30000.00, 9600.00, 150, 48, '/images/art-auction.jpg', 'active', FALSE),

(2, 5, '绿色生活义卖节', '环保物品义卖集市', '环保主题的义卖活动，销售各种环保产品、有机食品、手工制品和回收再利用的物品。活动旨在推广可持续生活方式，同时为环境保护项目筹款。现场还有环保知识讲座、DIY工作坊和儿童环保游戏，适合全家参与。让我们一起学习如何过更环保的生活，为地球的未来做出贡献。', '布里斯班', '布里斯班南岸公园广场', '2025-10-28 09:00:00', '2025-10-28 16:00:00', '2025-10-25 23:59:59', 0.00, 15000.00, 4500.00, 1000, 180, '/images/green-market.jpg', 'active', FALSE),

(3, 7, '癌症预防健康讲座', '知识就是最好的预防', '由知名肿瘤专家和营养师主讲的癌症预防健康讲座，内容涵盖癌症预防、早期筛查、健康饮食和生活方式。讲座免费参加，但欢迎自愿捐款支持癌症研究。现场还有免费的健康检查服务和健康咨询。这是一个学习健康知识、关爱自己和家人的绝佳机会。让我们一起学习如何预防疾病，守护健康。', '悉尼', '悉尼大学医学院大礼堂', '2025-11-22 13:00:00', '2025-11-22 16:00:00', '2025-11-20 23:59:59', 0.00, 5000.00, 1250.00, 400, 95, '/images/health-lecture.jpg', 'active', FALSE),

(1, 8, '儿童足球慈善赛', '踢球做公益，运动献爱心', '儿童足球慈善比赛，邀请8-16岁的孩子们参与足球比赛，同时为贫困儿童体育教育筹款。比赛分为不同年龄组，每个孩子都能获得参与证书。现场还有足球技能培训、亲子游戏和健康小食。这是一个让孩子们在运动中学习团队合作和社会责任的好机会。', '阿德莱德', '阿德莱德体育公园足球场', '2025-11-12 09:00:00', '2025-11-12 15:00:00', '2025-11-08 23:59:59', 20.00, 8000.00, 2400.00, 200, 60, '/images/kids-football.jpg', 'active', FALSE),

(2, 6, '海滩清洁志愿活动', '保护海洋，从我做起', '海滩环境保护志愿服务活动，志愿者们将清理海滩垃圾、整理海岸线，并参与海洋环保教育。活动免费参加，提供清洁工具、手套和环保袋。参与者可以学到海洋保护知识，了解塑料污染对海洋生态的影响。让我们用实际行动保护美丽的海洋环境，为下一代留下清洁的地球。', '黄金海岸', '黄金海岸冲浪者天堂海滩', '2025-10-14 08:00:00', '2025-10-14 12:00:00', '2025-10-12 23:59:59', 0.00, 3000.00, 750.00, 300, 85, '/images/beach-cleanup.jpg', 'active', FALSE),

(3, 1, '粉红丝带慈善晚宴', '关爱女性健康', '粉红丝带乳腺癌防治主题慈善晚宴，旨在提高女性对乳腺癌预防和早期发现的认识，同时为乳腺癌研究和患者支持筹款。晚宴将有医学专家分享健康知识，乳腺癌康复者分享励志故事，以及感人的音乐表演。让我们一起支持女性健康事业，传递关爱与希望。', '珀斯', '珀斯皇冠酒店大宴会厅', '2025-12-10 18:30:00', '2025-12-10 22:30:00', '2025-12-05 23:59:59', 120.00, 35000.00, 10500.00, 180, 52, '/images/pink-ribbon.jpg', 'active', FALSE),

(1, 2, '童心奔跑慈善跑', '为孩子们的未来而跑', '专为支持儿童教育和福利而举办的家庭友好型慈善跑活动。设有1公里儿童跑、3公里家庭跑和10公里成人跑，适合不同年龄和体能水平的参与者。活动现场有儿童游乐区、健康检查站和营养补给站。每位参与者都将获得纪念品，优胜者还有特别奖品。让我们一起为孩子们的未来奔跑！', '堪培拉', '堪培拉国会大厦周边', '2025-11-25 07:30:00', '2025-11-25 11:00:00', '2025-11-20 23:59:59', 30.00, 18000.00, 5400.00, 400, 108, '/images/kids-run.jpg', 'active', FALSE);

-- 创建视图：活动概览
CREATE VIEW event_overview AS
SELECT 
    e.id,
    e.name,
    e.description,
    e.location,
    e.event_date,
    e.ticket_price,
    e.goal_amount,
    e.current_amount,
    e.image_url,
    e.status,
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
WHERE e.status = 'active';

-- 创建索引优化查询性能
CREATE INDEX idx_events_date_status ON events(event_date, status);
CREATE INDEX idx_events_location_status ON events(location, status);
CREATE INDEX idx_events_featured ON events(is_featured, status);
