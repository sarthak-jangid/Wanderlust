# Wanderlust – Full-Stack Travel Booking App** (inspired by Airbnb)

A full-stack travel booking web application where users can explore listings, register accounts, and post new destinations. Inspired by Airbnb, built with Node.js, Express, MongoDB, and EJS.

## 🚀 Live Demo

[Click here to view the app](https://delta-project-37gq.onrender.com)

## ✨ Features

- User registration and login (authentication)
- Create, edit, and delete listings
- Image uploads with Cloudinary
- Form validation with Joi
- Flash messages for feedback
- Responsive UI using Bootstrap

## 🛠 Tech Stack

- **Frontend:** EJS, Bootstrap, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** Passport.js, passport-local-mongoose, express-session
- **Image Uploads:** Multer, Cloudinary, multer-storage-cloudinary
- **Validation & Flash:** Joi, connect-flash

## 🔧 Installation

1. Clone the repo

```bash
git clone https://github.com/sarthak-jangid/wanderlust.git
⏳ *Please allow a few seconds for the app to load — the server may take a moment to wake up due to free-tier hosting.*

npm install

Create a .env file and add:

CLOUD_NAME=yourname
CLOUD_API_KEY=yourkey
CLOUD_API_SECRET=yoursecret
RAZORPAY_API_KEY=apikey
RAZORPAY_API_SECRET=razorpaysecret
ATLASDB_URL=your_mongo_db_url
SECRET=session_secret_key
```
npm run dev


---

### ✅ **6. Folder Structure** 
```markdown
## 📁 Folder Structure

- `models/` - Mongoose models (User, Listing, Review)
- `routes/` - Route handlers
- `views/` - EJS templates
- `public/` - Static files (CSS, JS)
- `controllers/` - Logic separated using MVC pattern