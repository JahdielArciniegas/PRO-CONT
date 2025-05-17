import type { Board } from "@src/lib/types";
import { pb } from "@src/lib/pocketbase";
import { useEffect, useState, Suspense } from "react";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Trash, ArrowLeft, ArrowRight } from "lucide-react";

const Boards = ({ userId }: { userId: string }) => {
  const [boards, setBoard] = useState<Board[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const boards = async () => {
      const board = await pb.collection("boards").getList<Board>(page, 4, {
        filter: `id_user = "${userId}"`,
      });
      setBoard(board.items);
      setTotal(board.totalPages);
    };
    boards();
  }, [page]);

  const handleDelete = async (id: string) => {
    try {
      await pb.collection("boards").delete(id);
      const boards = await pb.collection("boards").getList<Board>(page, 4, {
        filter: `id_user = "${userId}"`,
      });
      setBoard(boards.items);
    } catch (error) {
      console.log(error);
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
        <ul className="p-4 pt-12 grid grid-cols-2 grid-row-2 gap-4 ">
          {boards.map((board) => (
            <li key={board.id}>
              <Card className="h-80">
                <CardHeader className="">
                  <CardTitle className="text-3xl flex gap-2 items-center justify-center text-center">
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
                <div className="flex gap-4">
                  <div className="flex flex-col gap-2 w-1/2 h-52 p-4">
                    <h4 className="text-2xl font-bold text-center bg-green-500 rounded-lg">
                      Pros
                    </h4>
                    <ul className="flex flex-col gap-2  h-52 p-4 overflow-y-auto no-scrollbar ">
                      {ExtraerPros(board).map((pros: string) => (
                        <li key={Math.random()}>{pros}</li>
                      ))}
                    </ul>
                  </div>
                  <span className="w-0.5 h-52 bg-[var(--foreground)]"></span>
                  <div className="flex flex-col gap-2 w-1/2 h-52 p-4">
                    <h4 className="text-2xl font-bold text-center bg-red-500 rounded-lg">
                      Contras
                    </h4>
                    <ul className="flex flex-col gap-2 h-52 p-4 overflow-y-auto no-scrollbar">
                      {ExtraerCons(board).map((cons: string) => (
                        <li key={Math.random()}>{cons}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </li>
          ))}
          {Array.from({ length: 4 - boards.length }).map((_, index) => (
            <li key={index} className="invisible h-80"></li>
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
