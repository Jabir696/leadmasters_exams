# Online Exam System (FastAPI + React)

This is a simple **online exam system** with:
- **Backend**: FastAPI + MySQL + JWT Authentication
- **Frontend**: React
- **Features**:
  - User registration & login
  - JWT-protected question retrieval
  - Server-side scoring (no correct answers leaked to frontend)
  - Countdown timer with auto-submit
  - Multiple-choice questions (A/B/C/D options)

---

## 📦 Project Structure

```
.
├── backend/                # FastAPI app
│   ├── main.py              # API endpoints
│   ├── database.py          # MySQL connection helper
│   └── requirements.txt     # Python dependencies
│
└── frontend/exam-frontend/  # React app
    ├── src/components/      # React components
    │   ├── Exam.js
    │   ├── Login.js
    │   └── Register.js
    └── package.json
```

---

## ⚙️ Backend Setup

1. **Install Python dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Set up MySQL database**
   ```sql
   CREATE DATABASE exam_db;
   USE exam_db;

   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(50) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL
   );

   CREATE TABLE questions (
       id INT AUTO_INCREMENT PRIMARY KEY,
       question_text TEXT NOT NULL,
       option_a VARCHAR(255),
       option_b VARCHAR(255),
       option_c VARCHAR(255),
       option_d VARCHAR(255),
       correct_option CHAR(1) NOT NULL
   );
   ```

3. **Update DB connection**
   Edit `backend/database.py` to match your MySQL credentials.

4. **Run backend**

 ```bash
   cd backend
uvicorn main:app --reload

   ```
   The backend runs at:  
   `http://127.0.0.1:8000`

---

## 🎨 Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend/exam-frontend
   npm install
   ```

2. **Start frontend**
   ```bash
   npm start
   ```
   The frontend runs at:  
   `http://localhost:3000`

---

## 🔗 API Endpoints

### `POST /register`
Register a new user.  
**Body:**
```json
{ "username": "john", "password": "1234" }
```

### `POST /login`
Authenticate user and get JWT.  
**Body:**
```json
{ "username": "john", "password": "1234" }
```
**Response:**
```json
{ "access_token": "JWT_TOKEN_HERE" }
```

### `GET /questions`
Get **10 random questions** (without correct answers).  
Requires `Authorization: Bearer TOKEN`.

### `POST /submit`
Submit answers and get the score.  
**Body:**
```json
{
  "answers": {
    "1": "B",
    "2": "D",
    "3": "A"
  }
}
```
**Response:**
```json
{
  "score": 2,
  "total": 3,
  "details": [
    { "id": 1, "selected": "B", "correct": "B", "is_correct": true },
    { "id": 2, "selected": "D", "correct": "C", "is_correct": false },
    { "id": 3, "selected": "A", "correct": "A", "is_correct": true }
  ]
}
```

---

## ⏳ How the Exam Works
1. User logs in → JWT is stored in the frontend.
2. Frontend fetches **random questions** (without answers).
3. User selects answers and clicks **Submit Exam** (or timer auto-submits).
4. Frontend sends answers to `/submit`.
5. Backend checks answers against DB and returns the **final score**.

---

## 🛠 Tech Stack
- **Backend**: FastAPI, MySQL, JWT, bcrypt, CORS
- **Frontend**: React, Fetch API
- **Auth**: JWT (JSON Web Token)

---

## 🚀 Running the Project
1. Start the backend (`uvicorn main:app --reload`)
2. Start the frontend (`npm start`)
3. Visit [http://localhost:3000](http://localhost:3000)

---
