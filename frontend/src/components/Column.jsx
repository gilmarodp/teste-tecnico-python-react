import { Draggable, Droppable } from "@hello-pangea/dnd";
import Card from "./Card";

function Column({ itemsOrder, id, items }) {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="flex flex-col w-full min-h-60 h-fit max-h-[60vh] overflow-y-auto"
        >
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
