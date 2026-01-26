import { Droppable } from "@hello-pangea/dnd";
import { Trash2 } from "lucide-react";

function Trash() {
  return (
    <Droppable droppableId="trash">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex flex-col items-center justify-center w-24 h-24 rounded-lg border-2 border-dashed transition-all ${
            snapshot.isDraggingOver
              ? "border-red-500 bg-red-500 bg-opacity-20"
              : "border-gray-500 bg-slate-700"
          }`}
        >
          <Trash2 className={`w-8 h-8 ${snapshot.isDraggingOver ? "text-red-500" : "text-gray-400"}`} />
          <p className="text-xs text-gray-400 mt-2 text-center">Lixeira</p>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default Trash;
