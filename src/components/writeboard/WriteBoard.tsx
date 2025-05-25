import { useEffect, useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  TouchSensor,
  PointerSensor,
} from "@dnd-kit/core";
import { Droppable } from "./Droppable";
import DraggableItem from "./DraggableItem";
import {
  updateBoard,
  createBoard,
  getBoard,
  getLengthBoards,
} from "@src/service/boards";
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
import { ArrowDownToLine, MessageCircleQuestion, Trash } from "lucide-react";
import { useNotificationStore } from "@src/lib/store";
import type { Board, content, userIa, WriteBoardProps } from "@src/lib/types";
import { addUserIa, getUserIa } from "@src/service/useIA";

const WriteBoard = ({ userId, idBoard = "" }: WriteBoardProps) => {
  const isTouchDevice = navigator.maxTouchPoints > 0;
  const [inputs, setInputs] = useState<content[]>([]);
  const [title, setTitle] = useState("");
  const [statusEdit, setStatusEdit] = useState(false);
  const [newActualInput, setNewActualInput] = useState("");
  const [idInput, setIdInput] = useState("");
  const [editTitle, setEditTitle] = useState(false);
  const [opinion, setOpinion] = useState<string | null>(null);
  const { addNotification } = useNotificationStore();
  const sensors = useSensors(
    isTouchDevice ? useSensor(TouchSensor) : useSensor(PointerSensor)
  );
  // const [suggestions, setSuggestions] = useState("No hay sugerencias");
  // const [latestPetition, setLatestPetition] = useState(true);
  const board = async () => {
    try {
      addNotification({
        message: "Cargando Tabla",
        type: "info",
      });
      const board = await getBoard(idBoard);
      setTitle(board.title);
      const storedInputsPros = board.pros.map((input: string) => ({
        id: crypto.randomUUID(),
        value: input,
        status: "pros",
      }));
      const storedInputsCons = board.cons.map((input: string) => ({
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
      addNotification({
        message: "Tabla cargada exitosamente",
        type: "success",
      });
    } catch (error) {
      addNotification({
        message: "Error al cargar la tabla",
        type: "error",
      });
    }
  };

  /* Manejo de Sugerencias - No implementado  
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
    console.log(data);
    setSuggestions(data.choices[0].message.content);
  };
*/
  useEffect(() => {
    const idEdit = localStorage.getItem("idEdit");
    if (idEdit) {
      localStorage.removeItem("inputs");
      localStorage.removeItem("title");
      localStorage.removeItem("idEdit");
    }
    if (idBoard !== "") {
      localStorage.removeItem("inputs");
      localStorage.removeItem("title");
      localStorage.removeItem("idEdit");
      board();
    } else {
      const storedInputs = localStorage.getItem("inputs");
      const storedTitle = localStorage.getItem("title");
      if (storedInputs) {
        setInputs(JSON.parse(storedInputs));
      }
      if (storedTitle) {
        setTitle(storedTitle);
      }
    }
  }, []);

  const saveBoard = async () => {
    const lengthBoards = await getLengthBoards(userId);
    if (lengthBoards >= 5) {
      addNotification({
        message: "Solo puedes tener 5 tablas",
        type: "error",
      });
      return;
    } else {
      const board: Partial<Board> = {
        id_user: userId,
        title,
        pros: inputs
          .filter((input) => input.status === "pros")
          .map((input) => input.value),
        cons: inputs
          .filter((input) => input.status === "cons")
          .map((input) => input.value),
      };

      if (statusEdit) {
        console.log(idBoard);
        updateBoard(idBoard, board as Board);
      } else {
        createBoard(board as Board);
      }
      localStorage.removeItem("inputs");
      localStorage.removeItem("title");
      localStorage.removeItem("idEdit");
      window.location.href = "/dashboard";
    }
  };

  const handleOpinion = async () => {
    const userIA = await getUserIa(userId);
    if (userIA) {
      addNotification({
        message: "El usuario ya tiene IA",
        type: "error",
      });
      return;
    } else {
      if (opinion) setOpinion(null);
      const pros = inputs
        .filter((input) => input.status === "pros")
        .map((input) => input.value);
      const cons = inputs
        .filter((input) => input.status === "cons")
        .map((input) => input.value);
      try {
        const response = await fetch("/api/opinion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            pros,
            cons,
            userIA,
          }),
        });
        const data = await response.json();
        setOpinion(data.choices[0].message.content);
        const newIAUser: Partial<userIa> = {
          userId,
        };
        await addUserIa(newIAUser as userIa);
        addNotification({
          message: "Opinion obtenida exitosamente",
          type: "success",
        });
      } catch (error) {
        addNotification({
          message: "Error al obtener la opinion",
          type: "error",
        });
      }
    }
  };

  const handleInputChange = () => {
    localStorage.setItem("title", title);

    let updatedInputs;

    if (idInput === "") {
      updatedInputs = [
        ...inputs,
        {
          id: crypto.randomUUID(),
          value: newActualInput,
          status: "new",
        },
      ];
    } else {
      updatedInputs = inputs.map((input) =>
        input.id === idInput ? { ...input, value: newActualInput } : input
      );
    }

    setInputs(updatedInputs);
    localStorage.setItem("inputs", JSON.stringify(updatedInputs));

    setNewActualInput("");
    setIdInput("");
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="relative h-11/12 lg:h-full flex flex-col sm:gap-4 gap-2 mt-10 lg:mt-0">
        <div className="flex justify-center items-center gap-2 sm:gap-4">
          {!editTitle && title !== "" ? (
            <h1
              className="sm:text-2xl text-base cursor-pointer font-bold"
              onClick={() => setEditTitle(true)}
            >
              {title}
            </h1>
          ) : (
            <input
              onFocus={() => setEditTitle(true)}
              onBlur={() => setEditTitle(false)}
              type="text"
              className="p-1 sm:p-2 text-base sm:text-2xl rounded-lg bg-muted w-1/2 sm:w-auto"
              placeholder="Escribe un Titulo para tu tabla"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          )}

          <Button
            onClick={saveBoard}
            className="cursor-pointer size-6 sm:size-auto"
          >
            <p className="sm:block hidden">Guardar</p> <ArrowDownToLine />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                onClick={handleOpinion}
                className="cursor-pointer size-6 sm:size-auto"
              >
                <p className="sm:block hidden">Opinión</p>{" "}
                <MessageCircleQuestion />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Opinión</DialogTitle>
                {opinion ? (
                  <div className="flex flex-col gap-2">
                    <DialogDescription>{opinion}</DialogDescription>
                  </div>
                ) : (
                  <DialogDescription>Loading...</DialogDescription>
                )}
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col h-auto max-h-[calc(100vh-200px)] overflow-y-auto no-scrollbar gap-2 lg:gap-4">
          <div className="flex gap-2 lg:gap-4">
            <Card className="w-1/2 flex flex-col items-center flex-1 p-2 sm:p-4">
              <h3 className="text-base sm:text-2xl font-bold">Pros</h3>
              <Droppable id="pros">
                <div className="flex flex-col gap-2">
                  {inputs.find((input) => input.status === "pros") ? (
                    inputs
                      .filter((input) => input.status === "pros")
                      .map((input) => (
                        <DraggableItem
                          key={input.id}
                          input={input}
                          select={input.value === newActualInput}
                        />
                      ))
                  ) : (
                    <p className="text-xs sm:text-base">No hay Pros</p>
                  )}
                </div>
              </Droppable>
            </Card>
            <Card className="w-1/2 flex flex-col items-center flex-1 p-2 sm:p-4">
              <h3 className="text-base sm:text-2xl font-bold">Contras</h3>
              <Droppable id="cons">
                <div className="flex flex-col gap-2">
                  {inputs.find((input) => input.status === "cons") ? (
                    inputs
                      .filter((input) => input.status === "cons")
                      .map((input) => (
                        <DraggableItem
                          key={input.id}
                          input={input}
                          select={input.value === newActualInput}
                        />
                      ))
                  ) : (
                    <p className="text-xs sm:text-base">No hay Contras</p>
                  )}
                </div>
              </Droppable>
            </Card>
          </div>
          <Card className="w-full flex justify-center p-2 sm:p-4">
            <Droppable id="new">
              {inputs.find((input) => input.status === "new") ? (
                inputs
                  .filter((input) => input.status === "new")
                  .map((input) => (
                    <DraggableItem
                      key={input.id}
                      input={input}
                      select={input.value === newActualInput}
                    />
                  ))
              ) : (
                <p className="text-xs sm:text-base">No hay inputs</p>
              )}
            </Droppable>
          </Card>
          <div className="flex justify-center">
            <Droppable id="Delete">
              <Button variant="destructive" className="w-24 h-12 sm:w-64">
                <Trash />
              </Button>
            </Droppable>
          </div>
        </div>

        <Card className="absolute bottom-4 self-center flex flex-col gap-2 justify-center w-full items-center">
          <div className="flex gap-2 items-center flex-col">
            <input
              type="text"
              className="p-2 rounded-lg bg-muted"
              placeholder="Escribe un nuevo input"
              value={newActualInput}
              onChange={(e) => setNewActualInput(e.target.value)}
            />
            <Button
              onClick={handleInputChange}
              className={`cursor-pointer text-xs sm:text-base ${
                idInput === "" ? "bg-green-500 text-white" : ""
              }`}
            >
              {idInput === "" ? "Agregar" : "Editar"}
            </Button>
            <Button
              onClick={() => {
                setNewActualInput("");
                setIdInput("");
              }}
              className="cursor-pointer text-xs sm:text-base"
              variant="destructive"
            >
              cancelar
            </Button>
          </div>
          {/* Manejo de Sugerencias - No implementado */}
          {/* <div className="flex gap-2 items-center">
            <p className="w-64 p-2">{suggestions}</p>
            <Button onClick={handleSuggest} className=" cursor-pointer">
              <HandHelping /> Sugerencia
            </Button>
          </div> */}
        </Card>
      </div>
    </DndContext>
  );

  function handleDragEnd({ active, over }: any) {
    console.log(over, active);

    if (!over) {
      setIdInput(active.id);
      setNewActualInput(active.value);
      return;
    }

    const newField = inputs.map((input) => {
      if (input.id === active.id) {
        try {
          setIdInput(input.id);
          setNewActualInput(input.value);
          return { ...input, status: over.id };
        } catch (error) {
          addNotification({
            message: "Error al mover el input",
            type: "error",
          });
        }
      }
      return input;
    });

    const inputSelect = inputs.find((input) => input.id === active.id);
    if (inputSelect?.status !== over.id) {
      setIdInput("");
      setNewActualInput("");
    }

    if (over.id === "Delete") {
      try {
        setInputs(newField.filter((input) => input.id !== active.id));
        setNewActualInput("");
        setIdInput("");
        addNotification({
          message: "Input eliminado exitosamente",
          type: "success",
        });
      } catch (error) {
        addNotification({
          message: "Error al eliminar el input",
          type: "error",
        });
      }
    }

    setInputs(newField);
    localStorage.setItem("inputs", JSON.stringify(newField));
  }
};

export default WriteBoard;
