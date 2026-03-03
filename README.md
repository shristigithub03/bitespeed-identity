# 🧩 Bitespeed Identity Reconciliation API

## 🚀 Live Deployment

Base URL:
https://bitespeed-identity-o7wy.onrender.com

Identify Endpoint:
https://bitespeed-identity-o7wy.onrender.com/identify

---

## 📌 About The Project

This project implements the **Identity Reconciliation API** for Bitespeed.

The `/identify` endpoint:

* Accepts **JSON body**
* Merges contacts based on email and/or phone number
* Returns a consolidated contact response
* Follows primary–secondary contact linking logic

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* MySQL
* Hosted on Render

---

## 🔥 API Endpoint

### POST `/identify`

⚠️ This endpoint works with **POST method only**.
Opening it directly in the browser will show:

```
Cannot GET /identify
```

This is expected behavior because the endpoint accepts only POST requests.

---

## 🧪 How To Test (Using Thunder Client)

### 1️⃣ Method

POST

### 2️⃣ URL

```
https://bitespeed-identity-o7wy.onrender.com/identify
```

### 3️⃣ Headers

```
Content-Type: application/json
```

### 4️⃣ Body (JSON)

```json
{
  "email": "doc@flux.com",
  "phoneNumber": "123456"
}
```

---

## ✅ Sample Response

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": [
      "doc@flux.com"
    ],
    "phoneNumbers": [
      "123456",
      "999999"
    ],
    "secondaryContactIds": [
      2
    ]
  }
}
```

---

## 📂 GitHub Repository

(https://github.com/shristigithub03/bitespeed-identity)

```

```

---

## 📝 Important Notes

* Uses **JSON body** (not form-data)
* Proper merging logic implemented
* Primary and secondary contact handling implemented
* Hosted online using free hosting (Render)
* Endpoint tested successfully using Thunder Client

---

## 👩‍💻 Author

Shristi Singh
Final Year – Computer Science Engineering

---

### ✅ Submission Ready

✔ Code pushed to GitHub
✔ Small meaningful commits added
✔ `/identify` endpoint exposed
✔ Hosted online
✔ Tested via Thunder Client

---
