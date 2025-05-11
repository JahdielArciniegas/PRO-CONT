import type { Board } from "@/lib/types";
import { pb } from "@/lib/pocketbase";
import { useEffect, useState, Suspense } from "react";

const Boards = () => {
  const [boards, setBoard] = useState<Board[]>([]);
  useEffect(() => {
    const boards = async () => {
      const board = await pb.collection("boards").getFullList<Board>();
      setBoard(board);
    };
    boards();
  }, []);

  const ExtraerPros = (board: Board) => {
    return board.pros.split(",");
  };

  const ExtraerCons = (board: Board) => {
    return board.cons.split(",");
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ul className="p-4 grid grid-cols-2 grid-row-2 gap-4">
        {boards.map((board) => (
          <li>
            <a href={`/board/${board.id}`}>
              <div className="flex flex-col justify-center gap-8 items-center bg-[var(--muted)] p-4 rounded-lg shadow-2xl">
                <h3 className="text-4xl">{board.title}</h3>
                <div className="flex gap-4">
                  <ul className="flex flex-col gap-2 w-1/2 h-52">
                    <h4 className="text-2xl font-bold text-center">Contras</h4>
                    {ExtraerCons(board).map((cons: string) => (
                      <li>{cons}</li>
                    ))}
                  </ul>
                  <span className="w-[2px] h-52 bg-[var(--foreground)]"></span>
                  <ul className="flex flex-col gap-2 w-1/2 h-52">
                    <h4 className="text-2xl font-bold text-center">Pros</h4>
                    {ExtraerPros(board).map((pros: string) => (
                      <li>{pros}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </Suspense>
  );
};

export default Boards;
