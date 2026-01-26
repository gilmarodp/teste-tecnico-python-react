import { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
} from "@hello-pangea/dnd";
import Column from "../components/Column.jsx";
import AddTaskModal from "../components/AddTaskModal.jsx";
import Trash from "../components/Trash.jsx";
import Header from "../components/Header.jsx";

const initialColumnData = {
  "pending": {
    id: "pending",
    title: "Pendente",
    itemsOrder: ["item-1", "item-2", "item-3"],
  },
  "in_progress": {
    id: "in_progress",
    title: "Em Progresso",
    itemsOrder: ["item-4", "item-5"],
  },
  "completed": {
    id: "completed",
    title: "Concluído",
    itemsOrder: ["item-6", "item-7", "item-8"],
  },
};

const initialItems = {
  "item-1": { id: "item-1", title: "Item 1", description: "" },
  "item-2": { id: "item-2", title: "Item 2", description: "" },
  "item-3": { id: "item-3", title: "Item 3", description: "" },
  "item-4": { id: "item-4", title: "Item 4", description: "" },
  "item-5": { id: "item-5", title: "Item 5", description: "" },
  "item-6": { id: "item-6", title: "Item 6", description: "" },
  "item-7": { id: "item-7", title: "Item 7", description: "" },
  "item-8": { id: "item-8", title: "Item 8", description: "" },
};

function Home() {
  const [columnsOrder, setColumnsOrder] = useState(["pending", "in_progress", "completed"]);
  const [data, setData] = useState(initialColumnData);
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState(null);

  const handleOpenModal = (columnId) => {
    setSelectedColumnId(columnId);
    setIsModalOpen(true);
  };

  const handleAddTask = (columnId, { title, description }) => {
    const newItemId = `item-${Date.now()}`;
    
    setItems((prev) => ({
      ...prev,
      [newItemId]: {
        id: newItemId,
        title,
        description,
      },
    }));

    setData((prev) => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        itemsOrder: [...prev[columnId].itemsOrder, newItemId],
      },
    }));
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
      <Header />
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Quadro de Tarefas (Público)</h1>
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
                              onAddTaskClick={handleOpenModal}
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
        columnId={selectedColumnId}
      />
    </div>
  );
}

export default Home;
