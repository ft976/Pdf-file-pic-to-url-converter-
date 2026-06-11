# ⚡ EtherealShare

<p align="center">
  <em>Secure, simple, and fully ephemeral file sharing.</em>
</p>

EtherealShare allows you to upload any file and share it with a secure link. Once the customizable timer expires (up to 24 hours), your file is automatically and permanently purged from the server. Zero compression, zero trackers, and 100% metadata preservation.

## ✨ Key Features

- **Lossless & Bit-Perfect**: Your files (ZIPs, images, docs) remain byte-perfect. No compression artifacts or metadata stripping.
- **Customizable Ephemeral Timer**: You control the lifespan of your link. Choose anything from 10 minutes up to 24 hours. Once time is up, the data is completely scrubbed.
- **Zero-Knowledge Architecture**: No user accounts required. No tracking scripts or analytics. Your local history stays right in your browser.
- **High-Performance Uploads**: Fast, isolated transmission over encrypted transit channels.

## 🚀 Getting Started (Usage)

It's as simple as drag, drop, and share:

1. Drop your file (up to 50MB) onto the upload stage.
2. Select your desired expiration timer (ranging from 10 min to 24 hrs).
3. Click **Generate Link** and share the resulting URL with your recipient.
4. You can track your active links in your local **Transfers History** tab.

## 💻 Running Locally

To run EtherealShare on your local machine, follow these steps:

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ft976/ethereal-share.git
   cd ethereal-share
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

## 🏗️ Technology Stack

- **Frontend:** React 18, Tailwind CSS, Motion (Framer Motion) for fluid animations, Lucide React for iconography.
- **Backend:** Express API, Node.js application for automated file tracking and cleanup.
- **Storage:** Secure temporary system storage with automated deadline-based purging.

## 📁 Core Infrastructure

- **`/src/pages/`** - Frontend application views (Upload, Viewer, History, Info).
- **`/server.ts`** - Express framework handling file streaming, upload limitations, and cleanup interval sweeps.
- **`/uploads/`** - Local temporary directory used for ephemeral physical file storage (auto-scrubbed).

## 👨‍💻 Developer Information

Crafted with care by **Rehan97**.

- **GitHub:** [@ft976](https://github.com/ft976)
- **LinkedIn:** [Rehan Ahmad](https://www.linkedin.com/in/rehan-ahmad-863386382?utm_source=share_via&utm_content=profile&utm_medium=member_android)

---
<p align="center">
  <em>Built for a more private, transient web.</em>
</p>
