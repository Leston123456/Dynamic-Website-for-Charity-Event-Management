-- Charity Events Management System Database
-- Create Database
CREATE DATABASE IF NOT EXISTS charityevents_db;
USE charityevents_db;

-- Create Organizations Table
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

-- Create Event Categories Table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Charity Events Table
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

-- Insert Sample Organizations
INSERT INTO organizations (name, description, email, phone, address, website, logo_url) VALUES
('Love Foundation', 'Non-profit organization dedicated to helping underprivileged children with education and healthcare', 'info@lovefund.org', '(02) 1234-5678', '123 Central Street, Sydney', 'https://www.lovefund.org', '/images/love-fund-logo.jpg'),
('Green Earth Society', 'Environmental protection and sustainable development organization', 'contact@greenearth.org', '(03) 9876-5432', '456 Eco Boulevard, Melbourne', 'https://www.greenearth.org', '/images/green-earth-logo.jpg'),
('Health Hope Alliance', 'Providing support and assistance to cancer patients and their families', 'support@healthhope.org', '(07) 5555-1234', '789 Medical District, Brisbane', 'https://www.healthhope.org', '/images/health-hope-logo.jpg');

-- Insert Event Categories
INSERT INTO categories (name, description) VALUES
('Charity Gala', 'Formal fundraising dinner events, usually including auction segments'),
('Charity Run', 'Running events where participants raise funds through their participation'),
('Silent Auction', 'Silent auction activities where participants bid through written offers'),
('Concert', 'Charity music performances with ticket proceeds going to charitable causes'),
('Charity Sale', 'Item sales with proceeds donated to charitable organizations'),
('Volunteer Service', 'Community volunteer service activities'),
('Educational Workshop', 'Charity education and awareness-raising workshops'),
('Sports Competition', 'Charity sports competitions and athletic events');

-- Insert Sample Charity Events
INSERT INTO events (organization_id, category_id, name, description, full_description, location, address, event_date, end_date, registration_deadline, ticket_price, goal_amount, current_amount, max_participants, current_participants, image_url, status, is_featured) VALUES

(1, 1, 'Night of Hope Charity Gala', 'Elegant fundraising dinner for underprivileged children education', 'This is a warm and meaningful charity gala aimed at raising funds for children education in underprivileged areas. The gala will be held at a luxury hotel, featuring exquisite dinner, live auction, musical performances, and more. Every donation will directly contribute to improving educational conditions for underprivileged children, providing them with better learning opportunities and brighter futures. Let us join hands to light up the hope for children tomorrow.', 'Sydney', 'Grand Ballroom, Sydney Hilton Hotel', '2025-11-15 18:00:00', '2025-11-15 22:00:00', '2025-11-10 23:59:59', 150.00, 50000.00, 12500.00, 200, 45, '/images/hope-dinner.jpg', 'active', TRUE),

(2, 2, 'Green Run Marathon', 'Running for environmental protection', 'Join our Green Marathon to contribute to environmental protection! This is an event combining fitness with charity, where participants can choose from 5km, 10km, or half marathon distances. The route passes through Sydney most beautiful parks and coastlines, allowing you to enjoy the fun of sports while raising funds for environmental causes. All participants will receive commemorative T-shirts and completion medals. Let us run together towards a greener future!', 'Sydney', 'Hyde Park Starting Point, Sydney', '2025-10-20 07:00:00', '2025-10-20 12:00:00', '2025-10-15 23:59:59', 35.00, 25000.00, 8750.00, 500, 125, '/images/green-marathon.jpg', 'active', TRUE),

(3, 4, 'Healing Voices Charity Concert', 'Spreading hope and love through music', 'A deeply moving charity concert featuring Australia finest musicians and singers, raising funds for cancer research and patient support. The concert will be held at Sydney Opera House, featuring classical music, popular songs, and original compositions. Every note carries respect for life and hope for the future. Let us send warmth and support to those brave warriors fighting against disease through the power of music.', 'Sydney', 'Concert Hall, Sydney Opera House', '2025-12-03 19:30:00', '2025-12-03 22:00:00', '2025-11-25 23:59:59', 80.00, 40000.00, 15200.00, 300, 76, '/images/healing-concert.jpg', 'active', FALSE),

(1, 3, 'Art for Charity Auction', 'Collect art, spread love', 'Carefully curated charity art auction showcasing excellent works from local and international artists. Auction items include paintings, sculptures, photography, and handicrafts. This is not only an excellent opportunity to collect artworks but also a great way to support children education. All auction proceeds will be used to provide art education resources for underprivileged children, allowing more children to experience the beauty of art.', 'Melbourne', 'Exhibition Hall, Melbourne Arts Centre', '2025-11-08 14:00:00', '2025-11-08 17:00:00', '2025-11-03 23:59:59', 25.00, 30000.00, 9600.00, 150, 48, '/images/art-auction.jpg', 'active', FALSE),

(2, 5, 'Green Living Market', 'Eco-friendly product charity market', 'Environmental-themed market selling various eco-friendly products, organic foods, handicrafts, and recycled items. The event aims to promote sustainable lifestyles while raising funds for environmental protection projects. The venue also features environmental knowledge workshops, DIY workshops, and children eco-games, suitable for the whole family. Let us learn how to live more environmentally friendly and contribute to the future of our planet.', 'Brisbane', 'South Bank Parklands Plaza, Brisbane', '2025-10-28 09:00:00', '2025-10-28 16:00:00', '2025-10-25 23:59:59', 0.00, 15000.00, 4500.00, 1000, 180, '/images/green-market.jpg', 'active', FALSE),

(3, 7, 'Cancer Prevention Health Workshop', 'Knowledge is the best prevention', 'Health workshop led by renowned oncologists and nutritionists, covering cancer prevention, early screening, healthy diet, and lifestyle. The workshop is free to attend, but voluntary donations to support cancer research are welcome. Free health check services and health consultations are also available on-site. This is an excellent opportunity to learn health knowledge and care for yourself and your family. Let us learn how to prevent diseases and protect our health together.', 'Sydney', 'Grand Auditorium, University of Sydney Medical School', '2025-11-22 13:00:00', '2025-11-22 16:00:00', '2025-11-20 23:59:59', 0.00, 5000.00, 1250.00, 400, 95, '/images/health-lecture.jpg', 'active', FALSE),

(1, 8, 'Kids Football Charity Match', 'Playing football for charity, sports with love', 'Children football charity match inviting 8-16 year olds to participate in football games while raising funds for underprivileged children sports education. The competition is divided into different age groups, and every child will receive a participation certificate. The venue also features football skills training, parent-child games, and healthy snacks. This is a great opportunity for children to learn teamwork and social responsibility through sports.', 'Adelaide', 'Football Field, Adelaide Sports Park', '2025-11-12 09:00:00', '2025-11-12 15:00:00', '2025-11-08 23:59:59', 20.00, 8000.00, 2400.00, 200, 60, '/images/kids-football.jpg', 'active', FALSE),

(2, 6, 'Beach Cleanup Volunteer Activity', 'Protecting oceans, starting from us', 'Beach environmental protection volunteer service activity where volunteers will clean beach litter, organize coastlines, and participate in marine environmental education. The activity is free to participate, providing cleaning tools, gloves, and eco-bags. Participants can learn about ocean protection knowledge and understand the impact of plastic pollution on marine ecosystems. Let us protect the beautiful marine environment through practical actions, leaving a clean planet for the next generation.', 'Gold Coast', 'Surfers Paradise Beach, Gold Coast', '2025-10-14 08:00:00', '2025-10-14 12:00:00', '2025-10-12 23:59:59', 0.00, 3000.00, 750.00, 300, 85, '/images/beach-cleanup.jpg', 'active', FALSE),

(3, 1, 'Pink Ribbon Charity Gala', 'Caring for women health', 'Pink Ribbon breast cancer prevention themed charity gala aimed at raising awareness about breast cancer prevention and early detection among women, while raising funds for breast cancer research and patient support. The gala will feature medical experts sharing health knowledge, breast cancer survivors sharing inspiring stories, and touching musical performances. Let us support women health causes together and spread care and hope.', 'Perth', 'Grand Ballroom, Crown Perth Hotel', '2025-12-10 18:30:00', '2025-12-10 22:30:00', '2025-12-05 23:59:59', 120.00, 35000.00, 10500.00, 180, 52, '/images/pink-ribbon.jpg', 'active', FALSE),

(1, 2, 'Children Heart Run', 'Running for children future', 'Family-friendly charity run specifically held to support children education and welfare. Features 1km children run, 3km family run, and 10km adult run, suitable for different ages and fitness levels. The venue includes children playground, health check stations, and nutrition supply stations. Every participant will receive commemorative items, and winners will receive special prizes. Let us run together for children future!', 'Canberra', 'Around Parliament House, Canberra', '2025-11-25 07:30:00', '2025-11-25 11:00:00', '2025-11-20 23:59:59', 30.00, 18000.00, 5400.00, 400, 108, '/images/kids-run.jpg', 'active', FALSE);

-- Create View: Event Overview
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

-- Create Indexes for Query Optimization
CREATE INDEX idx_events_date_status ON events(event_date, status);
CREATE INDEX idx_events_location_status ON events(location, status);
CREATE INDEX idx_events_featured ON events(is_featured, status);