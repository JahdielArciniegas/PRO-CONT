import { Draggable } from "./Draggable";

const DraggableItem = ({ input, handleDelete }: any) => {
  return (
    <div key={input.id} className="flex gap-2">
      <Draggable id={input.id}>{input.value}</Draggable>
      <button
        onClick={() => handleDelete(input.id)}
        className="p-2 rounded-lg bg-[var(--destructive)] text-white cursor-pointer"
      >
        Eliminar
      </button>
    </div>
  );
};

export default DraggableItem;
