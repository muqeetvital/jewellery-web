# 💎 Ikram Jewellers - Showcase Gallery & Admin Console

> **Established since 1960 | Pure Gold & Diamond Jewelry | Faisalabad, Pakistan**

A premium, luxury e-commerce showcase website and administrative console built for **Ikram Jewellers**. This project features a responsive gallery, gold rate calculation integrations, dynamic catalog search/filtering, automated WhatsApp booking/inquiries, and a secure administrative dashboard connected to Firebase.

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Project Structure](#-project-structure)
5. [Setup & Installation](#-setup--installation)
   - [Local Development](#1-local-development)
   - [Firebase Setup](#2-firebase-setup)
   - [Rules Setup](#3-security-rules-setup)
6. [Demo Credentials & Whitelisting](#-demo-credentials--admin-whitelisting)
7. [Deployment](#-deployment)

---

## 🌟 Project Overview

**Ikram Jewellers** has stood as a beacon of unmatched trust, quality, and legacy for over six decades. This application serves as their modern digital showcase, allowing clients to:
* Browse high-resolution catalog items (Necklaces, Rings, Bangles & Karas, Earrings).
* Schedule VIP showroom consultations.
* Instantly enquire about specific products on WhatsApp with automated reference code templates.

Additionally, the project includes an **Inventory Management Console** (Admin Panel) that empowers store owners to add, edit, and delete showcase products in real-time, upload product photos, and modify site-wide identity details.

---

## ✨ Key Features

### 🛒 Showcase Portal (`index.html`)
* **Luxury UI/UX:** Dark-mode gold accents, premium typography, glassmorphism filters, and smooth micro-animations.
* **Dynamic Catalog Filtering:** Category tabs and search bar powered by Firebase Firestore, with a automatic local JSON backup mode.
* **Product Details Modal:** View metal purity, estimated weight, reference code, and order availability.
* **WhatsApp Inquiry Button:** Click to chat with support on WhatsApp with prefilled message templates containing the specific item's reference code (e.g. `IJ-N01`).
* **VIP Showroom Scheduler:** Book private showroom consultations directly through a dynamic reservation form that sends prefilled appointment details to the shop's WhatsApp.

### 🛠️ Inventory Console (`admin.html`)
* **Secure Login:** Authenticate using Firebase Authentication.
* **Showcase Dashboard:** Quick metric cards tracking total catalog items, listed items, unlisted items, and connection status.
* **Live Database Seeding:** Clean starter button to import the default heritage catalog dataset into Firestore instantly.
* **Product Editor:** Form to add/edit products including name, reference code, purity (22K, 21K, 18K), weight, custom descriptions, and list/unlist toggles.
* **Direct Image Uploader:** Integrates with Firebase Storage to upload custom images and preview them before saving.
* **Branding Settings Dashboard:** Update the store name, logo image, favicon icon, WhatsApp number, and address dynamically without modifying code files.

---

## 💻 Technology Stack

* **Frontend:** Semantic HTML5, Vanilla CSS3 (Custom Variables, Flexbox/Grid, transitions), Vanilla Javascript (ES6+, Async/Await)
* **Backend Database:** Firebase Firestore (NoSQL Document Store)
* **Authentication:** Firebase Authentication (Email/Password Provider)
* **Media Storage:** Firebase Cloud Storage
* **Hosting:** Firebase Hosting

---

## 📁 Project Structure

```bash
├── assets/                     # Image assets (logos, fallback product catalog pictures)
├── admin.css                   # Custom stylesheets for the Admin Console
├── admin.html                  # Admin Console dashboard user interface
├── admin.js                    # Admin Console dashboard scripts & form actions
├── app.js                      # Core customer site showcase scripts, filters, and modals
├── firebase-config.js          # Firebase SDK initialization & configuration parameters
├── firebase.json               # Firebase Hosting configuration file
├── firestore.rules             # Database security policies for Cloud Firestore
├── storage.rules               # Object storage security policies for Cloud Storage
├── index.html                  # Main showroom showcase webpage
├── style.css                   # Custom stylesheet for the main customer showroom webpage
└── README.md                   # Project documentation
```

---

## ⚙️ Setup & Installation

### 1. Local Development
Since this project consists of standard frontend files, you can run it using any static server.

**Option A: Using Live Server (VS Code)**
1. Open the project folder in VS Code.
2. Install the **Live Server** extension.
3. Click the **Go Live** button in the bottom status bar.

**Option B: Using Node.js http-server**
1. Run the following command in the project directory:
   ```bash
   npx http-server .
   ```
2. Open `http://localhost:8080` in your web browser.

---

### 2. Firebase Setup
By default, the project runs in **Local Fallback Mode** with embedded sample catalog items. To link your live Firebase services, follow these steps:

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add App** and select **Web (</>)**.
3. Register your app and copy the credentials block (`firebaseConfig` details).
4. Edit [firebase-config.js](file:///d:/abdul-projects/Ikram%20Jewellers/firebase-config.js) and replace the existing keys:
   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT.firebaseapp.com",
       projectId: "YOUR_PROJECT",
       storageBucket: "YOUR_PROJECT.firebasestorage.app",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID",
       measurementId: "YOUR_MEASUREMENT_ID"
   };
   ```
5. In the Firebase Console, go to **Build** -> **Authentication** -> **Sign-in method**, and enable **Email/Password**.
6. Go to **Build** -> **Firestore Database** and click **Create database** (Select start in production mode).
7. Go to **Build** -> **Storage** and click **Get Started** to enable Cloud Storage.

---

### 3. Security Rules Setup
To secure your data, deploy or copy-paste the configured security rules:

* **Firestore Security Rules:** Paste the contents of [firestore.rules](file:///d:/abdul-projects/Ikram%20Jewellers/firestore.rules) into the **Rules** tab of your Firestore Database in the Firebase Console.
* **Storage Security Rules:** Paste the contents of [storage.rules](file:///d:/abdul-projects/Ikram%20Jewellers/storage.rules) into the **Rules** tab of your Cloud Storage in the Firebase Console.

---

### 4. Database Seeding
To initialize the Firestore database with 24 premium jewelry items (necklaces, rings, bangles, and earrings) and the default site settings:

1. Ensure your terminal session is authenticated with the Firebase CLI:
   ```bash
   firebase login
   ```
2. Run the seeder script:
   *   **On Windows:** Double-click or run `run-seeder.bat`.
   *   **On macOS/Linux:** Execute the Python script directly:
       ```bash
       python seed-database.py
       ```

---

## 🔑 Admin Credentials & Whitelisting

Because this project utilizes Firestore-based user role checking to ensure only authorized administrators can modify the catalog and upload images, admin access requires a whitelisted user profile.

### Active Admin Account Details
*   **Admin Email / Username:** `ikram-jewellery@gmail.com`
*   **Admin Password:** *(Your selected admin password)*

---

### ➕ Whitelisting a New Admin User (Firebase Console)
If you want to create a completely new admin account:
1. **Create the User in Auth:**
   * Go to **Firebase Console** -> **Authentication** -> **Users** tab.
   * Click **Add User** and enter their email and password.
   * Copy the generated **UID** (User ID) for the new user.

2. **Add Admin Role in Firestore:**
   * Go to **Firebase Console** -> **Firestore Database** -> **Data** tab.
   * Go to the `users` collection (create it if it doesn't exist).
   * Create a document with the Document ID set exactly to the copied **UID**.
   * Add the following fields to the document:
     * Field: `isAdmin` | Type: `boolean` | Value: `true`
     * Field: `email` | Type: `string` | Value: `user-email@domain.com`
   * Click **Save**.

Now you can visit `/admin.html`, enter these credentials, and securely access the control panel.

---

## 🚀 Deployment

To host this website online using **Firebase Hosting**, follow these instructions:

1. Install the Firebase CLI tool globally:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in to your Google Account associated with Firebase:
   ```bash
   firebase login
   ```
3. Initialize hosting in the project directory:
   ```bash
   firebase init hosting
   ```
   * Choose **Use an existing project** and select your registered project.
   * Set the public directory to `.` (Current directory).
   * Configure as single-page app: `Yes` (so routing is handled properly).
   * Overwrite existing `index.html`? **No** (Crucial: do not overwrite your index.html file!).
4. Deploy the application:
   ```bash
   firebase deploy
   ```
5. Firebase will provide your live URL (e.g., `https://ikram-jewellery.web.app`).
