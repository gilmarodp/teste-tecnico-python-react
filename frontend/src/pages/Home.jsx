import { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
} from "@hello-pangea/dnd";
import Cookies from 'js-cookie';
import Column from "../components/Column.jsx";
import AddTaskModal from "../components/AddTaskModal.jsx";
import EditTaskModal from "../components/EditTaskModal.jsx";
import Trash from "../components/Trash.jsx";
import Header from "../components/Header.jsx";
import api from '../services/api';

const initialColumnData = {
  "pending": {
    id: "pending",
    title: "Pendente",
    itemsOrder: [],
  },
  "in_progress": {
    id: "in_progress",
    title: "Em Progresso",
    itemsOrder: [],
  },
  "completed": {
    id: "completed",
    title: "Concluído",
    itemsOrder: [],
  },
};

const fetchTasks = async () => {
  try {
    const response = await api.get('/tasks');

    return response.data;
  } catch (error) {
    console.error('Erro ao obter tarefas da API:', error);
  }
}

const addTask = async (task) => {
  try {
    const response = await api.post('/tasks', task, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar tarefa na API:', error);
  }
}

const updateTask = async (taskId, task) => {
  try {
    const response = await api.put(`/tasks/${taskId}`, task, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar tarefa na API:', error);
  }
}

const deleteTask = async (taskId) => {
  try {
    await api.delete(`/tasks/${taskId}`);
  } catch (error) {
    console.error('Erro ao deletar tarefa da API:', error);
  }
}

function Home() {
  const [columnsOrder, setColumnsOrder] = useState(["pending", "in_progress", "completed"]);
  const [data, setData] = useState(initialColumnData);
  const [items, setItems] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('token'));
  const [userName, setUserName] = useState(Cookies.get('user_name') || '');

  const loadTasksData = () => {
    fetchTasks()
      .then((tasks) => {
        const newItemsMap = {};
        const newColumnsData = {
            "pending": { ...initialColumnData.pending, itemsOrder: [] },
            "in_progress": { ...initialColumnData.in_progress, itemsOrder: [] },
            "completed": { ...initialColumnData.completed, itemsOrder: [] },
        };

        tasks.forEach((task) => {
          newItemsMap[task.id] = {
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
          };

          if (newColumnsData[task.status]) {
            newColumnsData[task.status].itemsOrder.push(task.id);
          }
        });

        setItems(newItemsMap);
        setData(newColumnsData);
      });
  };

  const onLogout = () => {
    loadTasksData();

    setIsLoggedIn(false);
    setUserName(null);
  }

  useEffect(() => {
    loadTasksData();
  }, []);

  const handleOpenAddModal = (columnId) => {
    setSelectedColumnId(columnId);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleAddTask = (columnId, { title, description }) => {
    addTask({
      title,
      description,
      status: columnId,
    })
      .then((task) => {
        setItems((prev) => ({
          ...prev,
          [task.id]: {
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
          },
        }));

        setData((prev) => ({
          ...prev,
          [columnId]: {
            ...prev[columnId],
            itemsOrder: [...prev[columnId].itemsOrder, task.id],
          },
        }));
      })
      .catch((error) => {
        console.error('Erro ao adicionar tarefa na API:', error);
      })
  };

  const handleUpdateTask = (taskId, { title, description }) => {
    const taskToUpdate = items[taskId];
    const updatedTaskData = { ...taskToUpdate, title, description };

    updateTask(taskId, updatedTaskData)
      .then((updatedTask) => {
        setItems((prev) => ({
          ...prev,
          [taskId]: {
            ...prev[taskId],
            title: updatedTask.title,
            description: updatedTask.description,
          },
        }));
      })
      .catch((error) => {
        console.error('Erro ao atualizar tarefa na API:', error);
      });
  };

  const handleDragDrop = (results) => {
    const { source, destination, type, draggableId } = results;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (destination.droppableId === "trash") {
      const sourceColId = source.droppableId;
      setData((prev) => ({
        ...prev,
        [sourceColId]: {
          ...prev[sourceColId],
          itemsOrder: prev[sourceColId].itemsOrder.filter((id) => id !== draggableId),
        },
      }));
      setItems((prev) => {
        const newItems = { ...prev };
        delete newItems[draggableId];
        return newItems;
      });

      deleteTask(draggableId)
        .catch((error) => {
          console.error('Erro ao deletar tarefa da API:', error);
        });

      return;
    }

    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    if (type === "column") {
      const reorderedColumns = [...columnsOrder];
      const [removedItem] = reorderedColumns.splice(sourceIndex, 1);
      reorderedColumns.splice(destinationIndex, 0, removedItem);
      setColumnsOrder(reorderedColumns);
    } else {
      if (source.droppableId === destination.droppableId) {
        const sourceColId = source.droppableId;
        const newItemsOrder = [...data[sourceColId].itemsOrder];
        const [deletedItemId] = newItemsOrder.splice(sourceIndex, 1);
        newItemsOrder.splice(destinationIndex, 0, deletedItemId);
        
        setData((prev) => ({
          ...prev,
          [sourceColId]: {
            ...prev[sourceColId],
            itemsOrder: newItemsOrder,
          },
        }));
      } else {
        const sourceColId = source.droppableId;
        const destColId = destination.droppableId;
        
        const sourceItemsOrder = [...data[sourceColId].itemsOrder];
        const destItemsOrder = [...data[destColId].itemsOrder];
        
        const [deletedItemId] = sourceItemsOrder.splice(sourceIndex, 1);
        destItemsOrder.splice(destinationIndex, 0, deletedItemId);

        let task = items[draggableId];
        task = {
          ...task,
          status: destColId,
        };

        updateTask(draggableId, task)
          .catch((error) => {
            console.error('Erro ao atualizar tarefa na API:', error);
          });

        setData((prev) => ({
          ...prev,
          [sourceColId]: {
            ...prev[sourceColId],
            itemsOrder: sourceItemsOrder,
          },
          [destColId]: {
            ...prev[destColId],
            itemsOrder: destItemsOrder,
          },
        }));
      }
    }
  };

  return (
    <div>
      <Header onLogout={onLogout} />
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Quadro de Tarefas
            {isLoggedIn && userName ? ` - ${userName}` : ' (Público)'}
          </h1>
          <p className="text-gray-400">Arraste as colunas e cartões para reorganizar</p>
        </div>

        <DragDropContext onDragEnd={handleDragDrop}>
          <Droppable droppableId="root" type="column" direction="horizontal">
            {(provided) => (
              <div
                className="flex gap-4 pb-4 overflow-x-auto lg:overflow-x-visible"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {columnsOrder.map((colId, index) => {
                  const columnData = data[colId];
                  return (
                    <Draggable
                      draggableId={columnData.id}
                      key={columnData.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex-shrink-0 w-80"
                        >
                          <div
                            className={`rounded-lg overflow-hidden shadow-lg transition-all ${snapshot.isDragging ? "ring-2 ring-blue-500 shadow-xl" : ""
                              } bg-slate-700`}
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="flex items-center justify-between px-4 py-4 bg-gradient-to-r from-blue-600 to-blue-700 cursor-grab active:cursor-grabbing hover:from-blue-700 hover:to-blue-800 transition-colors"
                            >
                              <p className="text-lg font-bold text-white">
                                {columnData.title}
                              </p>
                              <span className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                                {columnData.itemsOrder.length}
                              </span>
                            </div>

                            <Column 
                              {...columnData} 
                              items={items} 
                              onAddTaskClick={handleOpenAddModal}
                              onCardClick={handleOpenEditModal}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="mt-8 flex justify-center">
            <Trash />
          </div>
        </DragDropContext>
      </div>

      <AddTaskModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTask={handleAddTask}
        columnId={selectedColumnId}
      />

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateTask}
        task={selectedTask}
      />
    </div>
  );
}

export default Home;
