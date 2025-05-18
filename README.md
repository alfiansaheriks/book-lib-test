# 📚 Book Library RESTful API

RESTful API sederhana untuk manajemen buku dan autentikasi pengguna, dibuat menggunakan **Express.js** dan **MongoDB** dengan dukungan JWT Authentication.

---

## ✨ Fitur

- ✅ Register & Login (JWT + Refresh Token)
- ✅ CRUD Buku (`Book`) dengan relasi ke `Author`
- ✅ Refresh Token Endpoint
- ✅ Middleware autentikasi (protected route)
- ✅ Validasi dasar
- ✅ Unit test menggunakan **Jest + Supertest**

---

## 🚀 Teknologi

- Node.js + Express
- MongoDB (via Mongoose)
- JSON Web Token (JWT)
- Jest + Supertest (untuk testing)

---

## 📦 Instalasi

1. **Clone repo:**
   ```bash
   git clone https://github.com/alfiansaheriks/book-lib-test
   cd backend-test
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Siapkan `.env`:**

   ```env
   PORT=3000
   MONGODB_URI=MongoDB Atlas URL
   JWT_SECRET=your_access_token_secret
   JWT_REFRESH_SECRET=your_refresh_token_secret
   ```

4. **Jalankan server:**
   ```bash
   npm start
   ```

---

## 🧪 Testing

Project ini hanya menguji endpoint berikut:

### ✅ Diuji:
- 🔐 Register & Login
- ♻️ Refresh Token
- 📘 CRUD Book

### Jalankan test:
```bash
npm run test
```

---

## 📚 Endpoint Utama

| Method | Endpoint                  | Keterangan                    |
|--------|---------------------------|-------------------------------|
| POST   | `/api/auth/register`      | Register user                 |
| POST   | `/api/auth/login`         | Login dan dapatkan JWT        |
| POST   | `/api/auth/refresh-token` | Dapatkan access token baru    |
| POST   | `/api/book`               | Tambah buku (autentikasi)     |
| GET    | `/api/book`               | List semua buku               |
| GET    | `/api/book/detail/:id`           | Detail buku                   |
| PUT    | `/api/book/:id`           | Update buku                   |
| DELETE | `/api/book/:id`           | Hapus buku                    |
| POST   | `/api/author`             | Tambah author                 |
| GET    | `/api/author`             | List author (tanpa test)      |

---

## 🧾 Struktur Folder

```
src/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
tests/
├── auth.test.js
├── book.test.js
```



## 👤 Author

Dibuat oleh [Alfiansaheriks](https://github.com/alfiansaheriks)  