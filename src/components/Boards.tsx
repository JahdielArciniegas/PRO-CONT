import type { Board } from "@src/lib/types";
import { useEffect, useState, Suspense } from "react";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Trash, ArrowLeft, ArrowRight } from "lucide-react";
import { useNotificationStore } from "@src/lib/store";
import { deleteBoard, getBoards } from "@src/lib/pocketbase";
const Boards = ({ userId }: { userId: string }) => {
  const [boards, setBoard] = useState<Board[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const { addNotification } = useNotificationStore();
  useEffect(() => {
    try {
      const boards = async () => {
        const board = await getBoards(userId, page);
        setBoard(board.items);
        setTotal(board.totalPages);
      };
      boards();
      addNotification({
        message: "Tablas cargadas exitosamente",
        type: "success",
      });
    } catch (error) {
      addNotification({
        message: "Error al cargar las tablas",
        type: "error",
      });
    }
  }, [page]);

  const handleDelete = async (id: string) => {
    try {
      await deleteBoard(id);
      const boards = await getBoards(userId, page);
      setBoard(boards.items);
      addNotification({
        message: "Tabla eliminada exitosamente",
        type: "success",
      });
    } catch (error) {
      addNotification({
        message: "Error al eliminar la tabla",
        type: "error",
      });
    }
  };

  const ExtraerPros = (board: Board) => {
    return board.pros.split(",");
  };

  const ExtraerCons = (board: Board) => {
    return board.cons.split(",");
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="relative flex flex-col gap-4 w-full">
        <ul className="p-4 pt-12 grid sm:grid-cols-2 grid-cols-1 grid-row-2 sm:gap-4 gap-2">
          {boards.map((board) => (
            <li key={board.id}>
              <Card className="sm:h-80 h-40">
                <CardHeader className="">
                  <CardTitle className="lg:text-3xl h-12 text-xl flex gap-2 items-center justify-center text-center">
                    <a
                      className="hover:text-muted-foreground transition-colors duration-300"
                      href={`/board/${board.id}`}
                    >
                      {board.title}
                    </a>
                    <Button
                      onClick={() => handleDelete(board.id)}
                      variant="destructive"
                      className="cursor-pointer"
                    >
                      <Trash />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <div className="flex sm:gap-4 gap-2">
                  <div className="flex flex-col gap-2 w-1/2 sm:h-52 h-24 sm:p-4 p-2 ">
                    <h4 className="sm:text-2xl text-lg w-24 sm:w-auto mx-auto sm:m-0 font-bold text-center bg-green-500 rounded-lg">
                      Pros
                    </h4>
                    <ul className="hidden sm:flex flex-col gap-2 sm:h-52 h-32 p-4 overflow-y-auto  no-scrollbar">
                      {ExtraerPros(board).map((pros: string) => (
                        <li
                          key={Math.random()}
                          className="text-sm sm:text-base"
                        >
                          {pros}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="w-0.5 sm:h-52 h-12 bg-foreground"></span>
                  <div className="flex flex-col gap-2 w-1/2 sm:h-52 h-24 sm:p-4 p-2">
                    <h4 className="sm:text-2xl text-lg w-24 sm:w-auto mx-auto sm:m-0  font-bold text-center bg-red-500 rounded-lg">
                      Contras
                    </h4>
                    <ul className="hidden sm:flex flex-col gap-2 h-52 p-4 overflow-y-auto no-scrollbar">
                      {ExtraerCons(board).map((cons: string) => (
                        <li
                          key={Math.random()}
                          className="text-sm sm:text-base"
                        >
                          {cons}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </li>
          ))}
          {Array.from({ length: 4 - boards.length }).map((_, index) => (
            <li key={index} className="invisible h-48 sm:h-80"></li>
          ))}
        </ul>
        {boards.length === 0 && <p>No hay tableros</p>}

        <div className="flex gap-4 -mt-4 justify-center w-full z-10">
          <Button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="cursor-pointer"
          >
            <ArrowLeft />
          </Button>
          <Button
            onClick={() => setPage(page + 1)}
            disabled={page === total}
            className="cursor-pointer "
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
    </Suspense>
  );
};

export default Boards;
