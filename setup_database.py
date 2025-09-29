#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Database Setup Script for Charity Event Management System
This script will create the database and import all sample data
"""

import mysql.connector
import sys
from mysql.connector import Error

# Database configuration
DB_CONFIG = {
    'host': '192.168.153.130',
    'user': 'root',
    'password': '123',
    'database': 'charityevents_db'
}

def create_connection():
    """Create database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            print("✅ Successfully connected to MySQL database")
            return connection
    except Error as e:
        print(f"❌ Error connecting to MySQL: {e}")
        return None

def create_database():
    """Create database if it doesn't exist"""
    try:
        # Connect without specifying database
        config_no_db = DB_CONFIG.copy()
        del config_no_db['database']
        
        connection = mysql.connector.connect(**config_no_db)
        cursor = connection.cursor()
        
        # Create database
        cursor.execute("CREATE DATABASE IF NOT EXISTS charityevents_db")
        print("✅ Database 'charityevents_db' created or already exists")
        
        cursor.close()
        connection.close()
        
    except Error as e:
        print(f"❌ Error creating database: {e}")

def execute_sql_file():
    """Execute the SQL file to create tables and insert data"""
    try:
        connection = create_connection()
        if not connection:
            return False
            
        cursor = connection.cursor()
        
        # Read SQL file
        with open('database/charityevents_db.sql', 'r', encoding='utf-8') as file:
            sql_content = file.read()
        
        # Split SQL statements
        statements = sql_content.split(';')
        
        for statement in statements:
            statement = statement.strip()
            if statement and not statement.startswith('--'):
                try:
                    cursor.execute(statement)
                    print(f"✅ Executed: {statement[:50]}...")
                except Error as e:
                    if "already exists" in str(e).lower():
                        print(f"⚠️  Already exists: {statement[:50]}...")
                    else:
                        print(f"❌ Error executing: {statement[:50]}... - {e}")
        
        connection.commit()
        print("✅ All SQL statements executed successfully")
        
        cursor.close()
        connection.close()
        return True
        
    except FileNotFoundError:
        print("❌ Error: database/charityevents_db.sql file not found")
        return False
    except Error as e:
        print(f"❌ Error executing SQL file: {e}")
        return False

def check_data():
    """Check if data was imported correctly"""
    try:
        connection = create_connection()
        if not connection:
            return
            
        cursor = connection.cursor()
        
        # Check tables and data
        tables_to_check = [
            ('organizations', 'SELECT COUNT(*) FROM organizations'),
            ('categories', 'SELECT COUNT(*) FROM categories'),
            ('events', 'SELECT COUNT(*) FROM events')
        ]
        
        print("\n📊 Database Status:")
        print("-" * 40)
        
        for table_name, query in tables_to_check:
            cursor.execute(query)
            count = cursor.fetchone()[0]
            print(f"{table_name:15}: {count:3} records")
        
        # Show sample events
        print("\n🎭 Sample Events:")
        print("-" * 40)
        cursor.execute("""
            SELECT e.name, c.name as category, o.name as organization 
            FROM events e 
            JOIN categories c ON e.category_id = c.id 
            JOIN organizations o ON e.organization_id = o.id 
            LIMIT 5
        """)
        
        events = cursor.fetchall()
        for event in events:
            print(f"• {event[0]} ({event[1]}) - {event[2]}")
        
        cursor.close()
        connection.close()
        
    except Error as e:
        print(f"❌ Error checking data: {e}")

def main():
    """Main function"""
    print("🚀 Charity Event Management System - Database Setup")
    print("=" * 60)
    
    # Step 1: Create database
    print("\n1️⃣  Creating database...")
    create_database()
    
    # Step 2: Execute SQL file
    print("\n2️⃣  Importing database schema and data...")
    if execute_sql_file():
        print("\n3️⃣  Checking imported data...")
        check_data()
        
        print("\n🎉 Database setup completed successfully!")
        print("\n📋 Next Steps:")
        print("1. Install Node.js dependencies: npm install")
        print("2. Start the server: npm start")
        print("3. Open browser: http://localhost:3000")
        print("\n🔗 API Endpoints:")
        print("• http://localhost:3000/api/events")
        print("• http://localhost:3000/api/categories")
        print("• http://localhost:3000/api/organizations/info")
        
    else:
        print("\n❌ Database setup failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
