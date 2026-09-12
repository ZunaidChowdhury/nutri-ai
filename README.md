# 🏆🥗 NutriAI – AI-Powered Meal Planning & Nutrition Tracking Platform

A modern **full-stack AI nutrition and meal planning platform** that empowers mindful eaters to discover macro-balanced recipes, generate personalized 7-day meal plans using intelligent multi-agent AI, and track daily food intake with automated nutritional deficiency analysis. NutriAI provides a comprehensive wellness suite with role-based dashboards, interactive charts, and a responsive user experience.

---

## 🌐 Live URL
> Frontend: https://nutri-ai-sepia.vercel.app

> Backend: https://nutri-ai-server.onrender.com/api

---

# 🎯 Purpose

NutriAI is designed to connect **health-conscious individuals, fitness enthusiasts, mindful eaters, and nutritionists** with autonomous AI agents.

Users can explore macro-balanced meals, log their daily dietary intake, and generate custom 7-day meal plans calibrated to their health goals (weight loss, maintenance, muscle building) and dietary restrictions (vegan, keto, halal, gluten-free). Administrators oversee the meal catalog, manage users, and curate global cuisine tags to ensure high-quality dietary data across the platform.

---

# ✨ Key Features

### 👤 Authentication & Authorization

* Secure authentication using **Better Auth**
* JWT session management with httpOnly cookies
* Email & Password registration and login
* Google OAuth Social Sign-In
* Role-based access control (Admin, User)
* Protected route middleware and server-side session verification

---

### 🤖 Tri-Agent AI System (LangChain & Groq)

* **Meal Planning Agent**: Generates personalized 7-day meal plans (breakfast, lunch, dinner, snack) balanced for target calories, macros, and restrictions using either the global catalog or the user's bookmarked library
* **Nutrition Analysis Agent**: Analyzes the last 7 days of logged foods from the food diary, detects macro/micronutrient deficiencies, and delivers actionable recommendations
* **Food Classification Agent**: Automatically analyzes meal titles and descriptions to suggest accurate cuisine tags with confidence scoring
* Shared **ChatGroq** LLM runtime with internal LangChain tools and strict Zod structured output validation

---

### 🍽️ Meal Exploration & Management

* Browse, search, filter, and paginate meals across global cuisines (Bangladeshi, Italian, Japanese, Turkish, Mexican, etc.)
* Filter meals by calorie range presets (`< 400`, `400 - 600`, `600 - 800`, `> 800` kcal)
* Dynamic cuisine quick-pill carousel with smooth scrolling arrow navigation
* Comprehensive meal details: calorie count, macros (protein, carbs, fat), ingredients, and ratings
* Create custom meals with image uploads via **UploadThing** and AI cuisine detection
* Full CRUD capabilities with public/private visibility control

---

### 🔖 Curated Meal Library & 7-Day AI Planner

* One-click meal bookmarking to build a personal library (`/items/selected`)
* Curate 10+ selected meals to generate custom 7-day plans exclusively from favorite dishes
* Interactive daily meal cards with macro breakdowns, ingredients, and preparation steps
* Instant one-click **PDF Meal Plan Export** powered by jsPDF

---

### 📊 Food Logging & Interactive Analytics Dashboard

* Quick meal logging from catalog dishes, generated meal plan days, or custom entries
* Real-time **Calories-Over-Time** trend lines and **Macro Distribution** charts using **Recharts**
* One-click **"Analyze My Nutrition"** generating structured AI nutrition deficiency reports
* Daily diary management with quick deletion and date-stamped intake logs

---

### 🛠️ Admin Panel (`/admin`)

* Manage all meals across the platform
* Toggle meal visibility (`public`, `private`, `locked`)
* Delete inappropriate or duplicate meals
* Manage user accounts, inspect activity, and promote/demote roles
* Dynamic cuisine management with admin-only cuisine creation

---

### 🎨 UI & UX Design

* Pixel-perfect modern design built with **Hero UI v3** & **Tailwind CSS v4**
* Fully responsive on all devices (mobile, tablet, desktop)
* Smooth micro-interactions and transitions with **Framer Motion**
* Seamless light and dark mode with pre-hydration theme detection
* Responsive floating Developer Bar with animated 1s entrance and social platform integrations
* Interactive Toast notifications via **React Toastify**
* Comprehensive mobile navigation drawer and responsive grids

---

# 🛠️ Tech Stack

## Frontend

* Next.js 16 (App Router)
* React 19
* TypeScript 5
* Tailwind CSS v4
* Hero UI v3
* Better Auth
* JWT Authentication
* Redux Toolkit
* TanStack React Query v5
* Framer Motion 12
* UploadThing
* Recharts
* jsPDF & jsPDF AutoTable
* Lucide React & React Icons
* React Toastify

---

## Backend

* Node.js
* Express.js 5
* TypeScript
* MongoDB & Mongoose
* LangChain.js
* ChatGroq (Groq LLM)
* Better Auth
* JOSE (JWT)
* Zod
* CORS
* Dotenv
* TSX / Nodemon

---

# 📦 NPM Packages Used

## Frontend

```txt
@heroui/react
@heroui/styles
@reduxjs/toolkit
@tanstack/react-query
@uploadthing/react
bcryptjs
better-auth
framer-motion
jspdf
jspdf-autotable
lucide-react
mongodb
next
next-themes
react
react-dom
react-icons
react-redux
react-toastify
recharts
uploadthing
zod
```

## Backend

```txt
@langchain/groq
@types/cors
@types/express
@types/node
bcryptjs
cors
dotenv
express
jose
langchain
mongoose
tsx
typescript
zod
```

---

# 🚀 Installation & Setup

## 1. Clone the repository

```bash
git clone https://github.com/ZunaidChowdhury/nutri-ai.git
git clone https://github.com/ZunaidChowdhury/nutri-ai-server.git
```

---

## 2. Install dependencies

### Frontend

```bash
cd nutri-ai
npm install
```

### Backend

```bash
cd nutri-ai-server
npm install
```

---

## 3. Configure Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

BETTER_AUTH_SECRET=your_better_auth_secret_here
BETTER_AUTH_URL=http://localhost:3000

MONGODB_URI=your_mongodb_connection_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

UPLOADTHING_TOKEN=your_uploadthing_token

NEXT_PUBLIC_SHOW_DEV_BAR=1
ADMIN_EMAIL=programmer.zunaid@gmail.com
```

### Backend (.env)

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key

CORS_ORIGIN=http://localhost:3000

JWT_SECRET=your_jwt_secret
BETTER_AUTH_SECRET=your_better_auth_secret

NODE_ENV=development
```

---

## 4. Run the application

### Backend

```bash
# Seed initial meals and cuisines (optional)
npm run seed

# Start development server
npm run dev
```

### Frontend

```bash
npm run dev
```

---

# 🔒 Authentication

* Better Auth
* JWT Session Authentication
* Google OAuth Social Login
* Protected Routes Middleware
* Role-Based Access Control (Admin / User)
* Secure httpOnly Cookie Management

---

# 📈 Core Functionalities

* Tri-Agent Autonomous AI Pipeline (Meal Planning, Nutrition Analysis, Food Classification)
* Dynamic 7-Day Personalized Meal Plan Generation
* Curated Meal Library & One-Click Selection System
* Real-Time Daily Food Logging & Food Diary
* Interactive Caloric & Macronutrient Analytics Charts
* Automated Deficiency Detection & Diet Recommendations
* Comprehensive Meal Catalog Search, Filter & Pagination
* Dynamic Cuisine Quick-Pill Carousel with Smooth Scrolling
* PDF Meal Plan Export with Detailed Daily Itineraries
* Cloud Image Upload via UploadThing
* Full CRUD Operations for Custom Meals
* Admin Dashboard for User Role & Meal Catalog Control
* Responsive Light / Dark Theme Architecture

---

# 👨‍💻 Author

**Zunaid Chowdhury**

Full Stack MERN & Next.js Developer

📧 [programmer.zunaid@gmail.com](mailto:programmer.zunaid@gmail.com)

---

## ⭐ If you like this project, don't forget to give it a star!

---

## 📸 Screenshot
<div align="center">
  <img src="./nutri-ai-fullshot.png" width="100%" alt="NutriAI Homepage Screenshot" />
</div>
