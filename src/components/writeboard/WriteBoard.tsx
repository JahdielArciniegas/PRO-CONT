import { useEffect, useState, useRef } from "react";
import { DndContext } from "@dnd-kit/core";
import { Droppable } from "./Droppable";
import DraggableItem from "./DraggableItem";
import { pb } from "@/lib/pocketbase";

interface WriteBoardProps {
  userId: string;
  idBoard?: string;
}

interface content {
  id: string;
  value: string;
  status: string;
}

const WriteBoard = ({ userId, idBoard = "" }: WriteBoardProps) => {
  const [inputs, setInputs] = useState<content[]>([]);
  const [title, setTitle] = useState("");
  const [statusEdit, setStatusEdit] = useState(false);
  const [newActualInput, setNewActualInput] = useState("");
  const [suggestions, setSuggestions] = useState("No hay sugerencias");
  const [idInput, setIdInput] = useState("");

  const board = async () => {
    await localStorage.removeItem("inputs");
    await localStorage.removeItem("title");
    const board = await pb.collection("boards").getOne(idBoard);
    setTitle(board.title);
    const storedInputsPros = board.pros.split(",").map((input: string) => ({
      id: crypto.randomUUID(),
      value: input,
      status: "pros",
    }));
    const storedInputsCons = board.cons.split(",").map((input: string) => ({
      id: crypto.randomUUID(),
      value: input,
      status: "cons",
    }));
    const storedInputs = [...storedInputsPros, ...storedInputsCons];
    setInputs(storedInputs);
    localStorage.setItem("inputs", JSON.stringify(storedInputs));
    localStorage.setItem("title", board.title);
    localStorage.setItem("idEdit", idBoard);
    setStatusEdit(true);
  };

  const handleSuggest = async () => {
    const response = await fetch("/api/suggest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: newActualInput,
        title,
      }),
    });
    const data = await response.json();
    setSuggestions(data.choices[0].message.content);
  };

  useEffect(() => {
    if (idBoard !== "") {
      board();
    } else {
      if (localStorage.getItem("idEdit") !== idBoard) {
        localStorage.removeItem("inputs");
        localStorage.removeItem("title");
        localStorage.removeItem("idEdit");
      }
      const storedInputs = localStorage.getItem("inputs");
      const storedTitle = localStorage.getItem("title");
      if (storedInputs) {
        setInputs(JSON.parse(storedInputs));
      }
      if (storedTitle) {
        setTitle(JSON.parse(storedTitle));
      }
    }
  }, []);

  const saveBoard = async () => {
    const board = {
      id_user: userId,
      title,
      pros: inputs
        .filter((input) => input.status === "pros")
        .map((input) => input.value)
        .join(","),
      cons: inputs
        .filter((input) => input.status === "cons")
        .map((input) => input.value)
        .join(","),
    };

    if (statusEdit) {
      await pb.collection("boards").update(idBoard, board);
      localStorage.removeItem("inputs");
      localStorage.removeItem("title");
      localStorage.removeItem("idEdit");
      window.location.href = "/dashboard";
    } else {
      await pb.collection("boards").create(board);
      localStorage.removeItem("inputs");
      localStorage.removeItem("title");
      localStorage.removeItem("idEdit");
      window.location.href = "/dashboard";
    }
  };

  const handleOpinion = async () => {
    const response = await fetch("/api/opinion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        pros: inputs
          .filter((input) => input.status === "pros")
          .map((input) => input.value)
          .join(","),
        cons: inputs
          .filter((input) => input.status === "cons")
          .map((input) => input.value)
          .join(","),
      }),
    });
    const data = await response.json();
    setSuggestions(data.choices[0].message.content);
  };

  const handleInputChange = () => {
    localStorage.setItem("title", title);
    if (idInput === "") {
      const newInput = [
        ...inputs,
        {
          id: crypto.randomUUID(),
          value: newActualInput,
          status: "new",
        },
      ];
      setInputs(newInput);
      localStorage.setItem("inputs", JSON.stringify(newInput));
    } else {
      const newValue = inputs.map((input) => {
        if (input.id === idInput) {
          return {
            ...input,
            value: newActualInput,
          };
        }
        return input;
      });
      setInputs(newValue);
      localStorage.setItem("inputs", JSON.stringify(newValue));
    }
    setNewActualInput("");
    setIdInput("");
  };

  const handleDelete = (id: string) => {
    setInputs(inputs.filter((input) => input.id !== id));
    localStorage.setItem("inputs", JSON.stringify(inputs));
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex justify-center gap-2">
        <input
          type="text"
          className="p-2 rounded-lg bg-[var(--muted)] "
          placeholder="Escribe un Titulo para tu tabla"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={saveBoard}
          className="p-2 rounded-lg bg-[var(--primary)] text-white cursor-pointer"
        >
          Guardar
        </button>
        <button
          onClick={handleOpinion}
          className="p-2 rounded-lg bg-[var(--primary)] text-white cursor-pointer"
        >
          Opinión
        </button>
      </div>
      <div className="flex h-[600px]">
        <div className="w-1/2 flex flex-col items-center flex-1">
          <h3 className="text-2xl font-bold">Pros</h3>
          <Droppable id="pros">
            <div className="flex flex-col gap-2">
              {inputs.find((input) => input.status === "pros") ? (
                inputs
                  .filter((input) => input.status === "pros")
                  .map((input) => (
                    <DraggableItem
                      key={input.id}
                      input={input}
                      handleDelete={handleDelete}
                    />
                  ))
              ) : (
                <p>No hay Pros</p>
              )}
            </div>
          </Droppable>
        </div>
        <div className="w-1/2 flex flex-col items-center flex-1">
          <h3 className="text-2xl font-bold">Contras</h3>
          <Droppable id="cons">
            <div className="flex flex-col gap-2">
              {inputs.find((input) => input.status === "cons") ? (
                inputs
                  .filter((input) => input.status === "cons")
                  .map((input) => (
                    <DraggableItem
                      key={input.id}
                      input={input}
                      handleDelete={handleDelete}
                    />
                  ))
              ) : (
                <p>No hay Contras</p>
              )}
            </div>
          </Droppable>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <Droppable id="new">
          {inputs.find((input) => input.status === "new") ? (
            inputs
              .filter((input) => input.status === "new")
              .map((input) => (
                <DraggableItem
                  key={input.id}
                  input={input}
                  handleDelete={handleDelete}
                />
              ))
          ) : (
            <p>No hay inputs</p>
          )}
        </Droppable>
      </div>

      <div className="flex justify-center">
        <input
          type="text"
          className="p-2 rounded-lg bg-[var(--muted)] "
          placeholder="Escribe un nuevo input"
          value={newActualInput}
          onChange={(e) => setNewActualInput(e.target.value)}
        />
        <button
          onClick={handleInputChange}
          className="p-2 rounded-lg bg-[var(--primary)] text-white cursor-pointer"
        >
          Agregar
        </button>
        <button
          onClick={() => {
            setNewActualInput("");
            setIdInput("");
          }}
          className="p-2 rounded-lg bg-[var(--destructive)] text-white cursor-pointer"
        >
          cancelar
        </button>
        <p>{suggestions}</p>
        <button
          onClick={handleSuggest}
          className="p-2 rounded-lg bg-[var(--primary)] text-white cursor-pointer"
        >
          Sugerir
        </button>
      </div>
    </DndContext>
  );

  function handleDragEnd({ active, over }: any) {
    const newField = inputs.map((input) => {
      if (input.id === active.id) {
        setIdInput(input.id);
        setNewActualInput(input.value);
        return { ...input, status: over.id };
      }
      return input;
    });
    setInputs(newField);
    localStorage.setItem("inputs", JSON.stringify(newField));
  }
};

export default WriteBoard;
