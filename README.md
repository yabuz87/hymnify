
---

# 🎵 Hymnify

**Hymnify** is a digital platform designed to preserve, organize, and share gospel song lyrics from church choirs across Ethiopia. Its mission is to make local and national gospel songs easily accessible to anyone, anywhere.

---

## 📖 Overview

Hymnify aims to **digitalize church choir songs** and provide a centralized, user-friendly platform where churches can store and manage their gospel song lyrics.
The system supports both **private church choir collections** and **publicly available Amharic gospel albums**, ensuring that Ethiopia’s rich gospel heritage is accessible and preserved for future generations.

---

## ✨ Key Features

### 🎼 For Churches

* **Church Registration:** Each evangelical church in Ethiopia can create a unique account with verified credentials.
* **Song Management:** Add, edit, and store all choir song lyrics securely.
* **Access Control:** Choir members can log in to view and download their church’s songs.

### 🎤 For Users (Mobile App)

* **Offline Access:** Once songs are downloaded, they remain available offline.
* **Public Gospel Library:** Browse and access popular Amharic gospel lyrics that are publicly published.
* **Smooth User Experience:** Designed for quick search, clean display, and easy navigation.

### ⚙️ For Admins

* **Admin Panel:** Manage churches, songs, and public content efficiently.
* **Content Moderation:** Verify songs and approve public gospel uploads.
* **Analytics Dashboard:** Track church participation and song statistics.

---

## 🧩 Tech Stack

| Layer                     | Technology                         |
| ------------------------- | ---------------------------------- |
| **Frontend (Web)**        | React.js / Next.js                 |
| **Frontend (Mobile App)** | React Native                       |
| **Backend**               | Node.js + Express.js               |
| **Database**              | MongoDB                            |
| **Authentication**        | Firebase Auth / JWT                |
| **Cloud Storage**         | Cloudinary / Firebase Storage      |
| **Hosting**               | Render / Vercel / Firebase Hosting |

---

## 📱 System Architecture

Hymnify consists of three major components:

1. **Backend API** – Handles authentication, data storage, and file management.
2. **Admin Dashboard** – Enables management of church data and public content.
3. **Mobile App** – Provides user access to both private (church) and public gospel lyrics.

```
Church Choir → Admin Panel → Backend → Database → Mobile App
```

---

## 🌍 Vision

Hymnify’s vision is to **preserve Ethiopia’s gospel music heritage** by providing a unified digital space where churches can archive their choir songs and make them accessible to their members and the wider Christian community.

---

## 🚀 Future Plans

* Add **audio and video playback** support.
* Enable **song translation and transliteration** features.
* Integrate **AI-powered search** for lyrics and artists.
* Provide **multi-language support** (Amharic, English, Oromiffa, Tigrigna).

---

## 🤝 Contribution

We welcome contributions from developers, churches, and gospel enthusiasts.
If you want to contribute:

1. Fork the repository.
2. Create a new branch.
3. Commit your changes.
4. Submit a pull request.

---

## 🕊️ License

This project is licensed under the **MIT License** — feel free to use and improve it for your own church or gospel initiatives.

---

## 👥 Maintainers

[@yabuz87](https://www.github.com/yabuz87)

---

**Components:**
1. **Backend API** – Handles authentication, data storage, and logic.  
2. **Admin Dashboard** – For managing churches and public content.  
3. **Mobile App** – User-facing app for accessing and downloading lyrics.

---

## 🌍 Vision  

> To preserve and spread Ethiopia’s gospel music legacy by building a unified digital archive of church and public gospel songs — empowering churches and believers through technology.

---

## 🚀 Future Enhancements  

- 🎵 **Audio and Video Playback Support**  
- 🌐 **Multi-language Lyrics (Amharic, English, Oromiffa, Tigrigna)**  
- 🤖 **AI-powered Search & Recommendation System**  
- 📤 **Community Upload and Sharing Feature**

---

## 🛠️ Installation (Development Setup)

```bash
# Clone the repository
git clone https://github.com/yabuz87/hymnify.git

# Navigate to the backend directory
cd hymnify/backend

# Install dependencies
npm install

# Run the development server
npm run dev
