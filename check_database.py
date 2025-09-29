#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Quick Database Check Script
"""

import mysql.connector
from mysql.connector import Error

def check_database():
    """Check database connection and data"""
    try:
        connection = mysql.connector.connect(
            host='192.168.153.130',
            user='root',
            password='123',
            database='charityevents_db'
        )
        
        if connection.is_connected():
            print("✅ Database connection successful!")
            
            cursor = connection.cursor()
            
            # Quick data check
            cursor.execute("SELECT COUNT(*) FROM events")
            event_count = cursor.fetchone()[0]
            print(f"📊 Events in database: {event_count}")
            
            if event_count > 0:
                print("✅ Database has data - ready to use!")
                return True
            else:
                print("⚠️  Database is empty - need to import data")
                return False
                
    except Error as e:
        print(f"❌ Database connection failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == "__main__":
    print("🔍 Checking database status...")
    check_database()
