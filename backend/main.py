from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from jose import jwt
import bcrypt
from datetime import datetime, timedelta
from database import get_db
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List

SECRET_KEY = "123456"
ALGORITHM = "HS256"

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # for dev; lock down in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    username: str
    password: str

# --- auth helpers ---
def _require_token(authorization: str):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ")[1]
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/register")
def register(user: User):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    hashed_password = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
    try:
        cursor.execute(
            "INSERT INTO users (username, password) VALUES (%s, %s)",
            (user.username, hashed_password),
        )
        db.commit()
        return {"message": "User registered successfully"}
    except Exception:
        raise HTTPException(status_code=400, detail="Username already exists")
    finally:
        cursor.close()
        db.close()

@app.post("/login")
def login(user: User):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username=%s", (user.username,))
    db_user = cursor.fetchone()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not bcrypt.checkpw(user.password.encode(), db_user["password"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    payload = {"user_id": db_user["id"], "exp": datetime.utcnow() + timedelta(hours=1)}
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    cursor.close()
    db.close()
    return {"access_token": token}

@app.get("/questions")
def get_questions(authorization: str = Header(None)):
    _require_token(authorization)
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, question_text, option_a, option_b, option_c, option_d
        FROM questions
        ORDER BY RAND()
        LIMIT 10
    """)
    questions = cursor.fetchall()
    cursor.close()
    db.close()
    return {"questions": questions}

# ---- NEW: submit answers & score server-side ----
class SubmitPayload(BaseModel):
    # { "1": "B", "2": "D", ... }  (keys can be numeric strings; Pydantic will coerce to int)
    answers: Dict[int, str]

@app.post("/submit")
def submit_exam(payload: SubmitPayload, authorization: str = Header(None)):
    _require_token(authorization)

    answer_map = payload.answers or {}
    if not answer_map:
        return {"score": 0, "total": 0, "details": []}

    q_ids: List[int] = list(answer_map.keys())

    # build IN clause safely
    placeholders = ",".join(["%s"] * len(q_ids))
    sql = f"SELECT id, correct_option FROM questions WHERE id IN ({placeholders})"

    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute(sql, q_ids)
    rows = cursor.fetchall()
    cursor.close()
    db.close()

    total = len(rows)
    correct = 0
    details = []
    for row in rows:
        qid = row["id"]
        chosen = answer_map.get(qid)
        is_correct = (chosen == row["correct_option"])
        if is_correct:
            correct += 1
        details.append({
            "id": qid,
            "selected": chosen,
            "correct": row["correct_option"],
            "is_correct": is_correct
        })

    return {"score": correct, "total": total, "details": details}
