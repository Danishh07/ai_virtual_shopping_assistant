# 🛍️ AI-Powered Fashion Shopping Assistant (Fashion AI)

A full-stack web application built with the **MERN stack** (MongoDB, Express.js, React, Node.js) that enables users to search for fashion products using **natural language queries**, powered by **Google's Gemini 2.0 API**.

---

## ✨ Features

- 🔍 **Natural Language Search**  
  Use phrases like:
  - *"Show me black sneakers under ₹2000"*
  - *"I need a cotton summer dress for women"*

- 🛒 **Product Listings**  
  Browse curated results with images, prices, and descriptions.

- 📱 **Responsive Design**  
  Optimized for both mobile and desktop views.

- ⚠️ **Smart Fallback**  
  Handles server/API errors gracefully with sample product data.

- 🎨 **Custom Branding**  
  Includes a Fashion AI theme and hanger icon favicon.

---

## 🛠️ Tech Stack

- **Frontend**: React, CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **AI Integration**: Google Gemini 2.0 API

---

## 🚀 Installation & Setup

### ✅ Prerequisites

- [Node.js](https://nodejs.org/) and `npm`
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### ⚙️ Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/fashion-ai.git
   cd fashion-ai

2. **Install dependencies**:
   ```
   npm run install-all
   ```
3. ***Set up environment variables***:
   - Create a `.env` file in the server directory with the following variables:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     GEMINI_API_KEY=your_gemini_api_key
     ```
4. ***Start the development servers***:
   ```
   npm run dev
   ```

## Usage

1. Access the application at `http://localhost:3000`
2. Enter natural language queries in the search bar
3. Browse the AI-generated product recommendations