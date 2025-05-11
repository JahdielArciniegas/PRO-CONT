import React from "react";
import { useDroppable } from "@dnd-kit/core";

export function Droppable(props: any) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={` ${isOver ? "opacity-100" : "opacity-50"}`}
    >
      {props.children}
    </div>
  );
}
