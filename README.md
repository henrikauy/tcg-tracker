# Trading Card Release Tracker

A full-stack application to track TCG set releases in Australia. The system scrapes retailer websites to detect when sets become available (e.g., "Coming Soon", "Pre-Order", "In-Stock"), allows users to subscribe to specific releases, and sends notifications (email/SMS) when releases go live. The backend is built with FastAPI (Python) and PostgreSQL, and the frontend is a Next.js application using NextAuth.js for authentication.

# Features

User sign-up, login, and JWT-based authentication
Next.js frontend with NextAuth.js integration
FastAPI backend with CRUD endpoints for users, releases, and subscriptions
PostgreSQL database for persistence
Web scraping with hrequests to avoid blocks

# Future Updates

Background scheduler to periodically scrape known release URLs, detect status changes, and trigger notifications
Email/SMS notifications to subscribed users when release status changes
OAuth Providers
Notification Dashboard to track notifications and manage preferences
Mobile App
Automatic TCG Purchasing
