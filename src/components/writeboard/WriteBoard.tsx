import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { Draggable } from "./Draggable";
import { Droppable } from "./Droppable";

const WriteBoard = () => {
  const [parent, setParent] = useState(null);
  const draggable = (
    <Draggable id="draggable">Esto es un objeto arrastrable</Draggable>
  );
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <input
        type="text"
        className="p-2 rounded-lg bg-[var(--muted)]"
        placeholder="Escribe un pros o un con"
      />
      <div className="flex">
        <div className="w-1/2">
          <h3 className="text-2xl font-bold">Pros</h3>
          <Droppable id="droppable">
            {parent === "droppable" ? draggable : "Drop here"}
          </Droppable>
        </div>
        <div className="w-1/2">
          <h3 className="text-2xl font-bold">Cons</h3>
          <Droppable id="droppable2">
            {parent === "droppable2" ? draggable : "Drop here"}
          </Droppable>
        </div>
      </div>
      {!parent ? draggable : null}
    </DndContext>
  );

  function handleDragEnd({ over }: any) {
    setParent(over ? over.id : null);
  }
};

export default WriteBoard;
