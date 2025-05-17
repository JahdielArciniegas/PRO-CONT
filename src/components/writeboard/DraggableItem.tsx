import { Draggable } from "./Draggable";

const DraggableItem = ({ input, handleDelete }: any) => {
  return (
    <div key={input.id} className="flex gap-2">
      <Draggable id={input.id}>{input.value}</Draggable>
    </div>
  );
};

export default DraggableItem;
