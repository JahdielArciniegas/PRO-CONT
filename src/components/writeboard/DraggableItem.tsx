import { Draggable } from "./Draggable";
import { XIcon, LeafIcon, CheckIcon } from "lucide-react";

const DraggableItem = ({ input, select }: { input: any; select: any }) => {
  return (
    <div key={input.id} className="flex text-xs sm:text-base gap-2">
      <Draggable id={input.id} select={select}>
        {input.status === "pros" && (
          <CheckIcon className="size-4 text-green-500" />
        )}
        {input.status === "cons" && <XIcon className="size-4 text-red-500" />}
        {input.status === "new" && (
          <LeafIcon className="size-4 text-muted-foreground" />
        )}
        {input.value}
      </Draggable>
    </div>
  );
};

export default DraggableItem;
