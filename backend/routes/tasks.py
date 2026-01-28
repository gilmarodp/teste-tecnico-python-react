import uuid
import os
from typing import Annotated, Optional
from dotenv import load_dotenv
from jose import jwt, JWTError, ExpiredSignatureError
from fastapi import APIRouter, HTTPException, status
from fastapi.params import Form, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models import TaskModel
from database.database import load_data, save_data, TASKS_FILE

load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env"))

SECRET_KEY = os.getenv("SECRET_KEY", "sua_chave_secreta_aqui")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

security = HTTPBearer(auto_error=False)

def bearer_token_scheme(auth: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    if auth is None:
        return None

    token = auth.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # Retorna o payload para as rotas que precisarem
    except ExpiredSignatureError:
        # Se você não usar o Handler Global da opção 1, precisa dar raise aqui:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado",
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Erro na validação do token",
        )

task_router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)

tasks = load_data(TASKS_FILE)

@task_router.get("")
async def list_tasks(user: Optional[dict] = Depends(bearer_token_scheme)):
    if user:
        return [task for task in tasks if task.get("user_id") == user["id"]]
    return [task for task in tasks if not task.get("user_id")]

@task_router.get("/{task_id}")
async def get_task(task_id: uuid.UUID, user: Optional[dict] = Depends(bearer_token_scheme)):
    target_user_id = user["id"] if user else None

    for task in tasks:
        if task["id"] == str(task_id):
            if task.get("user_id") == target_user_id:
                return task
            else:
                 raise HTTPException(status_code=403, detail="Not authorized to access this task")
    raise HTTPException(status_code=404, detail="Task not found")

@task_router.post("")
async def create_task(
    task: Annotated[TaskModel, Form()],
    user: Optional[dict] = Depends(bearer_token_scheme)
):
    new_task = {
        "id": str(uuid.uuid4()),
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "user_id": user["id"] if user else None
    }

    tasks.append(new_task)

    save_data(TASKS_FILE, tasks)

    return new_task

@task_router.put("/{task_id}")
async def update_task(
    task_id: uuid.UUID,
    updated_task: Annotated[TaskModel, Form()],
    user: Optional[dict] = Depends(bearer_token_scheme)
):
    target_user_id = user["id"] if user else None

    for index, task in enumerate(tasks):
        if task["id"] == str(task_id):
            if task.get("user_id") != target_user_id:
                 raise HTTPException(status_code=403, detail="Not authorized to update this task")

            tasks[index].update({
                "title": updated_task.title,
                "description": updated_task.description,
                "status": updated_task.status
            })
            save_data(TASKS_FILE, tasks)
            return tasks[index]
    return {"error": "Task not found"}

@task_router.delete("/{task_id}")
async def delete_task(task_id: uuid.UUID, user: Optional[dict] = Depends(bearer_token_scheme)):
    target_user_id = user["id"] if user else None

    for index, task in enumerate(tasks):
        if task["id"] == str(task_id):
            if task.get("user_id") != target_user_id:
                 raise HTTPException(status_code=403, detail="Not authorized to delete this task")

            deleted_task = tasks.pop(index)
            save_data(TASKS_FILE, tasks)
            return deleted_task
    return {"error": "Task not found"}
