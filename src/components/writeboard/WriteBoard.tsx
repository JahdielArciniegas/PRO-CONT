import { useEffect, useState, useRef } from "react";
import { DndContext } from "@dnd-kit/core";
import { Droppable } from "./Droppable";
import DraggableItem from "./DraggableItem";
import { pb } from "@src/lib/pocketbase";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  HandHelping,
  ArrowDownToLine,
  MessageCircleQuestion,
  Trash,
} from "lucide-react";

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
  const [editTitle, setEditTitle] = useState(false);
  const [latestPetition, setLatestPetition] = useState(true);
  const [opinion, setOpinion] = useState<string | null>(null);

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
        latestPetition,
        title,
      }),
    });
    setLatestPetition(!latestPetition);
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
    if (opinion) setOpinion(null);
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
    setOpinion(data.choices[0].message.content);
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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="relative h-full flex flex-col gap-4">
        <div className="flex justify-center items-center gap-4">
          {!editTitle && title !== "" ? (
            <h1
              className="text-2xl cursor-pointer font-bold"
              onClick={() => setEditTitle(true)}
            >
              {title}
            </h1>
          ) : (
            <input
              onFocus={() => setEditTitle(true)}
              onBlur={() => setEditTitle(false)}
              type="text"
              className="p-2 text-2xl rounded-lg bg-[var(--muted)] "
              placeholder="Escribe un Titulo para tu tabla"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          )}

          <Button onClick={saveBoard} className="cursor-pointer">
            Guardar <ArrowDownToLine />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={handleOpinion} className="cursor-pointer">
                Opinión <MessageCircleQuestion />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Opinión</DialogTitle>
                {opinion ? (
                  <div className="flex flex-col gap-2">
                    <DialogDescription>{opinion}</DialogDescription>
                    <Button onClick={handleOpinion} className="cursor-pointer">
                      Generar Opinión <MessageCircleQuestion />
                    </Button>
                  </div>
                ) : (
                  <DialogDescription>Loading...</DialogDescription>
                )}
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col h-auto max-h-[calc(100vh-200px)] overflow-y-auto no-scrollbar gap-4">
          <div className="flex gap-4">
            <Card className="w-1/2 flex flex-col items-center flex-1">
              <h3 className="text-2xl font-bold">Pros</h3>
              <Droppable id="pros">
                <div className="flex flex-col gap-2">
                  {inputs.find((input) => input.status === "pros") ? (
                    inputs
                      .filter((input) => input.status === "pros")
                      .map((input) => (
                        <DraggableItem key={input.id} input={input} />
                      ))
                  ) : (
                    <p>No hay Pros</p>
                  )}
                </div>
              </Droppable>
            </Card>
            <Card className="w-1/2 flex flex-col items-center flex-1">
              <h3 className="text-2xl font-bold">Contras</h3>
              <Droppable id="cons">
                <div className="flex flex-col gap-2">
                  {inputs.find((input) => input.status === "cons") ? (
                    inputs
                      .filter((input) => input.status === "cons")
                      .map((input) => (
                        <DraggableItem key={input.id} input={input} />
                      ))
                  ) : (
                    <p>No hay Contras</p>
                  )}
                </div>
              </Droppable>
            </Card>
          </div>
          <Card className="w-full flex justify-center p-4">
            <Droppable id="new">
              {inputs.find((input) => input.status === "new") ? (
                inputs
                  .filter((input) => input.status === "new")
                  .map((input) => (
                    <DraggableItem key={input.id} input={input} />
                  ))
              ) : (
                <p>No hay inputs</p>
              )}
            </Droppable>
          </Card>
          <div className="flex justify-center">
            <Droppable id="Delete">
              <Button variant="destructive" className="w-64 h-12">
                <Trash />
              </Button>
            </Droppable>
          </div>
        </div>

        <Card className="absolute bottom-4 self-center flex flex-col gap-2 justify-center w-full items-center">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              className="p-2 rounded-lg bg-[var(--muted)] "
              placeholder="Escribe un nuevo input"
              value={newActualInput}
              onChange={(e) => setNewActualInput(e.target.value)}
            />
            <Button
              onClick={handleInputChange}
              className="p-2 rounded-lg bg-[var(--primary)]  cursor-pointer"
            >
              Agregar
            </Button>
            <Button
              onClick={() => {
                setNewActualInput("");
                setIdInput("");
              }}
              className="cursor-pointer"
              variant="destructive"
            >
              cancelar
            </Button>
          </div>
          <div className="flex gap-2 items-center">
            <p className="w-64 p-2">{suggestions}</p>
            <Button onClick={handleSuggest} className=" cursor-pointer">
              <HandHelping /> Sugerencia
            </Button>
          </div>
        </Card>
      </div>
    </DndContext>
  );

  function handleDragEnd({ active, over }: any) {
    if (!over) {
      setIdInput(active.id);
      setNewActualInput(active.value);
      return;
    }

    const newField = inputs.map((input) => {
      if (input.id === active.id) {
        setIdInput(input.id);
        setNewActualInput(input.value);
        return { ...input, status: over.id };
      }
      return input;
    });
    if (over.id === "Delete") {
      setInputs(newField.filter((input) => input.id !== active.id));
      setNewActualInput("");
      setIdInput("");
    }
    setInputs(newField);
    localStorage.setItem("inputs", JSON.stringify(newField));
  }
};

export default WriteBoard;
