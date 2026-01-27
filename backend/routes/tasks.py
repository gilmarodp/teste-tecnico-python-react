import uuid
from fastapi import APIRouter
from ..models import TaskModel
from ..database.database import load_data, save_data, TASKS_FILE

task_router = APIRouter(prefix="/tasks", tags=["Tasks"])

tasks = load_data(TASKS_FILE)

@task_router.get("/")
async def index():
    return tasks

@task_router.get("/{task_id}")
async def get_task(task_id: int):
    for task in tasks:
        if task["id"] == task_id:
            return task
    return {"error": "Task not found"}

@task_router.post("/tasks")
async def create_task(task: TaskModel):
    new_task = {
        "id": str(uuid.uuid4()),
        "title": task.title,
        "description": task.description,
        "status": task.status
    }

    tasks.append(new_task)

    save_data(TASKS_FILE, tasks)

    return new_task

