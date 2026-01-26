import { Draggable, Droppable } from "@hello-pangea/dnd";
import Card from "./Card";
import { PlusIcon } from "lucide-react";

function Column({ itemsOrder, id, items, onAddTaskClick }) {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="flex flex-col w-full h-fit max-h-[60vh] overflow-y-auto"
        >
          <button
            type="button"
            onClick={() => onAddTaskClick(id)}
            className="border-b rounded-md p-2 m-2 mt-4 bg-blue-600 hover:bg-blue-700 text-center transition-colors cursor-pointer"
          >
            <PlusIcon className="w-6 h-6 mx-auto text-white" />
          </button>

          {itemsOrder.map((item_id, index) => {
            const item = items[item_id];

            return (
              <Draggable draggableId={item.id} index={index} key={item.id}>
                {(provided) => (
                  <Card
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    item={item}
                  />
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Column;
