# AI-Powered Fashion Shopping Assistant - Startup Guide

This document provides instructions on how to set up and run the AI-Powered Fashion Shopping Assistant application.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)
- Google Gemini API key (already configured in the server/.env file)

## First-time Setup

1. Install all dependencies by running the following command from the root folder:
   ```
   npm run install-all
   ```

2. Seed the database with initial product data:
   ```
   cd server
   node config/seeder.js
   ```

## Starting the Application

### Option 1: Using the PowerShell Script (Recommended)

Run the provided PowerShell script to start both the server and client in separate windows:
```
.\start-app.ps1
```

### Option 2: Using npm Scripts

From the root directory, you can run:
```
npm run dev
```
This will start both the server and client concurrently.

### Option 3: Starting Components Separately

Start the server:
```
cd server
node server.js
```

Start the client:
```
cd client-new
npm start
```

## Accessing the Application

- Server API is available at: http://localhost:5001
- Web application is available at: http://localhost:3000

## Troubleshooting

1. If port 5001 is already in use, you can edit the server/.env file to use a different port.
2. If you see "Failed to load products", make sure the MongoDB service is running.
3. The application will display sample products if it cannot connect to the server.