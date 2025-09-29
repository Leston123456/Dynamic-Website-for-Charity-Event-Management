# Charity Event Management System

A complete dynamic website for managing charity events, built with Node.js, Express.js, MySQL, HTML, CSS, and JavaScript. This project demonstrates full-stack web development skills with proper Git workflow and professional code organization.

## Features

### Frontend
- **Homepage**: Organization information, statistics, featured events, and complete event listings
- **Search Page**: Advanced filtering by date, location, and category with real-time results
- **Event Details**: Comprehensive event information with participation features
- **Responsive Design**: Mobile-friendly interface with modern CSS
- **Interactive UI**: Smooth animations, error handling, and user feedback

### Backend
- **RESTful API**: Complete set of endpoints for events, categories, and organizations
- **Database Integration**: MySQL with connection pooling and query optimization
- **Error Handling**: Comprehensive error responses and logging
- **Data Validation**: Input validation and sanitization

### Technical Highlights
- **Clean Code**: Well-commented, modular JavaScript code
- **Security**: Protection against SQL injection and XSS attacks
- **Performance**: Optimized database queries and connection pooling
- **Git Workflow**: Feature branch development with comprehensive commit history

## Installation & Setup

### Prerequisites
- Node.js 14 or higher
- MySQL 8.0 or higher
- Git

### Database Setup
1. Create MySQL database:
   ```sql
   CREATE DATABASE charityevents_db;
   ```
2. Import the database schema:
   ```bash
   mysql -u root -p charityevents_db < database/charityevents_db.sql
   ```

### Application Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Leston123456/Dynamic-Website-for-Charity-Event-Management.git
   cd Dynamic-Website-for-Charity-Event-Management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure database connection in `config.js`:
   ```javascript
   module.exports = {
     database: {
       host: 'your-mysql-host',
       user: 'your-username',
       password: 'your-password',
       database: 'charityevents_db'
     }
   };
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser and visit: `http://localhost:3000`

## Project Structure

```
├── database/                 # Database schema and sample data
│   └── charityevents_db.sql
├── api/                      # RESTful API routes
│   ├── events.js
│   ├── categories.js
│   └── organizations.js
├── public/                   # Client-side files
│   ├── css/
│   │   ├── style.css
│   │   ├── search.css
│   │   └── event-details.css
│   ├── js/
│   │   ├── common.js
│   │   ├── index.js
│   │   ├── search.js
│   │   └── event-details.js
│   ├── index.html
│   ├── search.html
│   ├── event-details.html
│   └── 404.html
├── event_db.js              # Database connection and queries
├── server.js                # Express.js server
├── config.js                # Configuration settings
└── package.json              # Project dependencies
```

## API Documentation

### Events
- `GET /api/events` - Retrieve all active events
- `GET /api/events/featured` - Get featured events
- `GET /api/events/search?startDate=&endDate=&location=&categoryId=` - Search events
- `GET /api/events/:id` - Get specific event details

### Categories
- `GET /api/categories` - Get all event categories

### Organizations
- `GET /api/organizations/info` - Get organization information
- `GET /api/organizations/statistics` - Get system statistics

### Health Check
- `GET /api/health` - Check API and database status

## Database Schema

### Tables
1. **organizations** - Charity organization details
2. **categories** - Event categories (Charity Gala, Charity Run, etc.)
3. **events** - Complete event information with relationships

### Sample Data
- 3 sample organizations
- 8 event categories
- 10 complete sample events with realistic data

## Development Features

### Git Workflow
- **Feature Branches**: Separate branches for each major feature
- **Commit History**: Detailed commit messages showing development progress
- **Code Organization**: Logical separation of concerns

### Code Quality
- **Comments**: Comprehensive English comments throughout
- **Error Handling**: Robust error handling and user feedback
- **Validation**: Input validation and data sanitization
- **Responsive**: Mobile-first responsive design

### Modern Web Practices
- **ES6+ JavaScript**: Modern JavaScript features
- **CSS Grid/Flexbox**: Modern layout techniques
- **Fetch API**: Modern HTTP requests
- **Semantic HTML**: Proper HTML5 structure

## Technologies Used

- **Backend**: Node.js, Express.js, MySQL2
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: MySQL
- **Tools**: Git, npm
- **Development**: Feature branch workflow, modular architecture

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This project demonstrates academic work following professional development practices. The codebase showcases:
- Clean, maintainable code
- Proper Git workflow
- Comprehensive documentation
- Industry-standard practices

## License

This project is created for educational purposes as part of PROG2002 Web Development II coursework.

## Project Status

✅ **Complete** - All requirements implemented and tested
- Database design and implementation
- RESTful API development
- Client-side website with all required pages
- Responsive design and user experience
- Git workflow with proper branching
- English localization and clean code
