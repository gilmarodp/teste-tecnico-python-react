import os
import uuid
import bcrypt
from typing import Annotated
from dotenv import load_dotenv
from fastapi import APIRouter, Form, HTTPException
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from ..database.database import load_data, save_data, USERS_FILE
from ..models import RegisterFormModel, LoginFormModel

load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
    except Exception:
        return False

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

auth_router = APIRouter(prefix="/auth", tags=["Auth"])

users = load_data(USERS_FILE)

@auth_router.post("/register")
async def register(data: Annotated[RegisterFormModel, Form()]):
    if data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords don't match")

    for user in users:
        if user["email"] == data.email:
            raise HTTPException(status_code=400, detail="Email already registered")

    new_user = {
        "id": str(uuid.uuid4()),
        "name": data.name,
        "email": data.email,
        "password": hash_password(data.password)
    }

    users.append(new_user)

    save_data(USERS_FILE, users)

    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user["id"],
            "name": new_user["name"],
            "email": new_user["email"],
        },
    }


@auth_router.post("/login")
def login(data: Annotated[LoginFormModel, Form()]):
    user = next((u for u in users if u["email"] == data.email), None)

    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": user["email"], "id": user["id"]})
    return {"access_token": access_token, "token_type": "Bearer"}
