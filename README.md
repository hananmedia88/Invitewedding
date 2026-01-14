# 💍 NikahYuk - Digital Wedding Invitation & Marketplace

Aplikasi undangan pernikahan digital modern dengan fitur **AI Love Story**, **RSVP Management**, dan **Design Studio** untuk import template dari PowerPoint.

## 🚀 Cara Menjalankan Secara Lokal

Aplikasi ini menggunakan **Vite** dan **React**. Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/).

1. **Instal Dependensi**:
   ```bash
   npm install
   ```
2. **Jalankan Mode Development**:
   ```bash
   npm run dev
   ```
3. **Buka Browser**: Akses `http://localhost:5173`

## 🌐 Cara Upload & Hosting di GitHub Pages

Aplikasi ini sudah dilengkapi dengan **GitHub Actions** untuk deployment otomatis.

1. Buat repositori baru di GitHub.
2. Hubungkan folder lokal Anda dengan GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/USERNAME/REPO-NAME.git
   git branch -M main
   git push -u origin main
   ```
3. **Penting**: Masuk ke Tab **Settings** > **Pages** di GitHub.
4. Di bagian **Build and deployment** > **Source**, pilih **GitHub Actions**.
5. Website akan aktif secara otomatis setelah proses build selesai di tab **Actions**.

## 🔑 Akses Portal Manager (Owner)

Untuk mengelola bisnis dan menggunakan fitur **Studio Desain (PPT Import)**:
- **URL**: `https://USERNAME.github.io/REPO-NAME/manager.html`
- **Username**: `admin`
- **Password**: `nikahyuk2025`

## 🛠️ Fitur Utama
- **AI Love Story**: Menggunakan Google Gemini API untuk membuat narasi romantis.
- **PowerPoint Importer**: Ekstrak gaya desain dari file `.pptx` ke template web.
- **RSVP Real-time**: Pantau tamu yang hadir langsung dari dashboard.
- **Mobile Responsive**: Tampilan undangan yang elegan di semua perangkat.

---
Built with ❤️ by Senior Frontend Engineer.
