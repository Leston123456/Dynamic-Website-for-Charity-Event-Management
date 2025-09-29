# Charity Event Management System

A dynamic website for managing charity events built with Node.js, MySQL, HTML, and JavaScript.

## Features

- Homepage with organization info and event listings
- Search functionality to filter events by date, location, and category
- Detailed event pages with registration information
- RESTful API backend
- MySQL database integration

## Setup Instructions

1. Install dependencies: `npm install`
2. Set up MySQL database using the provided SQL file
3. Update database configuration in `config.js`
4. Start the server: `npm start` or `npm run dev` for development

## Project Structure

- `/database/` - Database schema and setup files
- `/api/` - RESTful API endpoints
- `/public/` - Client-side files (HTML, CSS, JS)
- `/docs/` - Project documentation

## API Endpoints

- GET `/api/events` - Get all active events
- GET `/api/events/:id` - Get specific event details
- GET `/api/events/search` - Search events with filters
- GET `/api/categories` - Get event categories

## Database Schema

The system uses MySQL with the following main tables:
- `events` - Event information
- `categories` - Event categories
- `organizations` - Charity organizations

## Development Progress

This project follows proper Git workflow with feature branches and regular commits to demonstrate development progress.
