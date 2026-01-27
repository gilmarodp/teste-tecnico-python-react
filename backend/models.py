from typing import Literal
from pydantic import BaseModel, Field, EmailStr

class RegisterFormModel(BaseModel):
    name: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8)
    confirm_password: str

class LoginFormModel(BaseModel):
    email: str
    password: str

class UserModel(BaseModel):
    id: int
    name: str
    email: str

class TaskModel(BaseModel):
    title: str
    description: str = None
    status: Literal["pending", "in_progress", "completed"]
