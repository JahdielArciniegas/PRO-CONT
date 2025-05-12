import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { Draggable } from "./Draggable";
import { Droppable } from "./Droppable";

interface content {
  id: string;
  value: string;
  status: string;
}

const WriteBoard = () => {
  const [parent, setParent] = useState(null);
  const [inputs, setInputs] = useState<content[]>([
    { id: "1", value: "Esto es el primer draggable", status: "pros" },
    { id: "2", value: "Esto es el segundo draggable", status: "cons" },
    { id: "3", value: "Esto es el tercer draggable", status: "cons" },
    { id: "4", value: "Esto es el cuarto draggable", status: "cons" },
    { id: "5", value: "Esto es el quinto draggable", status: "cons" },
    { id: "6", value: "Esto es el sexto draggable", status: "cons" },
    { id: "7", value: "Esto es el septimo draggable", status: "cons" },
    { id: "8", value: "Esto es el octavo draggable", status: "cons" },
    { id: "9", value: "Esto es el noveno draggable", status: "cons" },
    { id: "10", value: "Esto es el decimo draggable", status: "cons" },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    setInputs(
      inputs.map((input) =>
        input.id === id ? { ...input, value: e.target.value } : input
      )
    );
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex justify-center">
        <input
          type="text"
          className="p-2 rounded-lg bg-[var(--muted)] "
          placeholder="Escribe un Titulo para tu tabla"
        />
      </div>
      <div className="flex h-[calc(100vh-100px)]">
        <div className="w-1/2 flex flex-col items-center flex-1">
          <h3 className="text-2xl font-bold">Pros</h3>
          <Droppable id="pros">
            {inputs.find((input) => input.status === "pros") ? (
              inputs
                .filter((input) => input.status === "pros")
                .map((input) => (
                  <Draggable id={input.id} key={input.id}>
                    {input.value}
                  </Draggable>
                ))
            ) : (
              <p>No hay Pros</p>
            )}
          </Droppable>
        </div>
        <div className="w-1/2 flex flex-col items-center flex-1">
          <h3 className="text-2xl font-bold">Contras</h3>
          <Droppable id="cons">
            {inputs.find((input) => input.status === "cons") ? (
              inputs
                .filter((input) => input.status === "cons")
                .map((input) => (
                  <Draggable id={input.id} key={input.id}>
                    {input.value}
                  </Draggable>
                ))
            ) : (
              <p>No hay Contras</p>
            )}
          </Droppable>
        </div>
      </div>
      <div className="flex justify-center"></div>
    </DndContext>
  );

  function handleDragEnd({ active, over }: any) {
    console.log(active.id);
    setInputs(
      inputs.map((input) =>
        input.id === active.id ? { ...input, status: over.id } : input
      )
    );
    setParent(over ? over.id : null);
  }
};

export default WriteBoard;
