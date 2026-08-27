# Social Blogging Platform

A full-stack social media application built with **React, TypeScript, Node.js, Express.js, and MongoDB**, developed for the **Fullstack Application Development with Node.js + Express.js + React.js** course.

## Features

### 🔐 Authentication

* JWT-based user registration and login
* Automatic login after registration
* Secure password hashing with bcrypt

### 📝 Posts

* Create text and/or multi-photo posts
* Apply independent filters to each photo
* Client-side image processing using HTML Canvas
* Available filters:

  * Negative
  * Blur
  * Sobel edge detection

### 👥 Social Graph

* Follow and unfollow users
* Mutual follows automatically form a friendship
* Friends-only features such as direct messaging

### ❤️ Engagement

* Like and unlike posts
* Comment on posts
* Bookmark/favorite posts

### 🏷️ Groups

* Create interest-based groups
* Join existing groups
* Owner approval workflow for group membership

### 💬 Messaging

* Direct messaging between friends
* Read receipts
* Unread message badges

### 🔔 Notifications

Notifications for:

* Likes
* Comments
* New followers
* Group activity

### 🔎 Search & Explore

* Search users, groups, and posts by keyword
* Search posts using `#hashtags`
* Personalized and popular post discovery grid

### 🛡️ Moderation

* Report users and content
* Admin review queue for reported content
* Content moderation across the platform

### ⚙️ Admin Dashboard

* Platform statistics
* User role management
* User moderation
* Post moderation
* Comment moderation
* Group moderation

## Tech Stack

### Frontend

* **React 19**
* **TypeScript**
* **Redux Toolkit**
* **RTK Query**
* **React Router v6**
* **Vite**
* HTML Canvas API for client-side image processing

### Backend

* **Node.js**
* **Express 5**
* **TypeScript**
* **MongoDB**
* **Mongoose**
* **JWT**
* **bcrypt**
* **Yup**
