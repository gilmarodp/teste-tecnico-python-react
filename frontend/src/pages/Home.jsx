import { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
} from "@hello-pangea/dnd";
import Column from "../components/Column.jsx";

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

const items = {
  "item-1": { id: "item-1", title: "Item 1" },
  "item-2": { id: "item-2", title: "Item 2" },
  "item-3": { id: "item-3", title: "Item 3" },
  "item-4": { id: "item-4", title: "Item 4" },
  "item-5": { id: "item-5", title: "Item 5" },
  "item-6": { id: "item-6", title: "Item 6" },
  "item-7": { id: "item-7", title: "Item 7" },
  "item-8": { id: "item-8", title: "Item 8" },
};

function Home() {
  const [columnsOrder, setColumnsOrder] = useState(["pending", "in_progress", "completed"]);
  const [data, setData] = useState(initialColumnData);

  const handleDragDrop = (results) => {
    const { source, destination, type } = results;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    if (type === "column") {
      const reorderedColumns = [...columnsOrder];
      const [removedItem] = reorderedColumns.splice(sourceIndex, 1);
      reorderedColumns.splice(destinationIndex, 0, removedItem);
      setColumnsOrder(reorderedColumns);
    } else {
      if (source.droppableId === destination.droppableId) {
        const source_col_id = source.droppableId;
        const new_items_id_collection = [...data[source_col_id].itemsOrder];
        const [deleted_item_id] = new_items_id_collection.splice(sourceIndex, 1);
        new_items_id_collection.splice(destinationIndex, 0, deleted_item_id);
        const new_data = { ...data };
        new_data[source_col_id].itemsOrder = new_items_id_collection;
        setData(new_data);
      } else {
        const source_col_id = source.droppableId;
        const dest_col_id = destination.droppableId;
        const new_source_items_id_collc = [...data[source_col_id].itemsOrder];
        const new_dest_items_id_collc = [...data[dest_col_id].itemsOrder];
        const [deleted_item_id] = new_source_items_id_collc.splice(sourceIndex, 1);
        new_dest_items_id_collc.splice(destinationIndex, 0, deleted_item_id);
        const new_data = { ...data };
        new_data[source_col_id].itemsOrder = new_source_items_id_collc;
        new_data[dest_col_id].itemsOrder = new_dest_items_id_collc;
        setData(new_data);
      }
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Quadro de Tarefas</h1>
        <p className="text-gray-400 mb-8">Arraste as colunas e cartões para reorganizar</p>

        <DragDropContext onDragEnd={handleDragDrop}>
          <Droppable droppableId="root" type="column" direction="HORIZONTAL">
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
                          className="flex-shrink-0 w-full sm:w-80"
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

                            <Column {...columnData} items={items} />
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
        </DragDropContext>
      </div>
    </div>
  );
}

export default Home;
