# 🚗 Vehicle Showroom & Management System

A full-stack vehicle inventory and showroom application built with **Laravel (API Backend)** and **React + Vite (Frontend Dashboard)**.

---

## 📋 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Get the Code](#2-get-the-code)
3. [Database Setup](#3-database-setup)
4. [Backend Setup (Laravel API)](#4-backend-setup-laravel-api)
5. [Frontend Setup (React + Vite)](#5-frontend-setup-react--vite)
6. [Testing the Application](#6-testing-the-application)

---

## 1. Prerequisites

Before starting, make sure you have the following installed on your computer:

- **Node.js** (v18 or higher) → [Download Node.js](https://nodejs.org/)
- **Composer** → [Download Composer](https://getcomposer.org/)
- **XAMPP** (or any MySQL/PHP local server environment) → [Download XAMPP](https://www.apachefriends.org/)

To verify that these tools are installed and accessible, open your terminal (Command Prompt, PowerShell, or Terminal) and run:

```bash
node -v
php -v
composer -v
```

---

## 2. Get the Code

You can get the repository either by cloning it via Git or downloading it as a ZIP archive.

### Option A: Clone via Git (Recommended)

If you have Git installed, open your terminal and run:

```bash
# Clone the project repository
git clone https://github.com/hanisidd/car-showroom-management.git

# Navigate into the project directory
cd car-showroom-management
```

### Option B: Download as ZIP

1. Click the **Code** button at the top right of the repository page and select **Download ZIP**.
2. Extract the downloaded `.zip` file into a folder on your computer.
3. Open your terminal and navigate to that extracted folder:

```bash
cd path/to/your/extracted-folder
```

---

## 3. Database Setup

1. Launch **XAMPP Control Panel** and start both **Apache** and **MySQL**.
2. Open your browser and go to phpMyAdmin: [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
3. Click on **Databases** (or the **SQL** tab) and create a new database named `showroom_db`:

```sql
CREATE DATABASE showroom_db;
```

---

## 4. Backend Setup (Laravel API)

### Step 4.1: Navigate to Backend Directory

Open your terminal and navigate into the backend project directory:

```bash
cd path/to/your/showroom-api
```

### Step 4.2: Install PHP Packages

Download all required backend dependencies:

```bash
composer install
```

### Step 4.3: Set Up `.env` Environment File

Copy the example environment configuration file to create `.env`:

```bash
# On Windows (Command Prompt):
copy .env.example .env

# On Mac/Linux or Git Bash:
cp .env.example .env
```

Open `.env` in a text editor (like VS Code) and update the database settings to connect to `showroom_db`.

### Step 4.4: Generate Key, Link Storage & Migrate

```bash
# 1. Generate security key
php artisan key:generate

# 2. Link storage folder so vehicle photos can be viewed in the browser
php artisan storage:link

# 3. Create database tables and populate lookup data
php artisan migrate --seed
```

### Step 4.5: Start Backend Server

```bash
php artisan serve --port=8000
```

> 🔴 **Keep this terminal open!** Your API is now active and running at `http://localhost:8000`.

---

## 5. Frontend Setup (React + Vite)

### Step 5.1: Open a New Terminal Window

Leave the backend terminal running. Open a new terminal window and navigate to your frontend project directory:

```bash
cd path/to/your/showroom-client
```

### Step 5.2: Install JavaScript Packages

Install React, Tailwind CSS, Lucide icons, Framer Motion, and required HTTP client tools:

```bash
npm install
```

### Step 5.3: Start Frontend Server

```bash
npm run dev
```

> 🟢 **Your application is ready!** Open the URL provided in your terminal (usually `http://localhost:5173`) in your web browser.

---

## 6. Testing the Application

- ✅ Ensure **MySQL** is active in XAMPP.
- ✅ Ensure both terminals are running (`php artisan serve` on port `8000` and `npm run dev` on port `5173`).
- ✅ Access the dashboard in your browser at `http://localhost:5173` to browse inventory, update vehicle specs, and manage image galleries.