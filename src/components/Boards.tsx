import type { Board } from "@src/lib/types";
import { pb } from "@src/lib/pocketbase";
import { useEffect, useState, Suspense } from "react";

const Boards = ({ userId }: { userId: string }) => {
  const [boards, setBoard] = useState<Board[]>([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    const boards = async () => {
      const board = await pb.collection("boards").getList<Board>(page, 4, {
        filter: `id_user = "${userId}"`,
      });
      setBoard(board.items);
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
        <ul className="p-4 grid grid-cols-2 grid-row-2 gap-4">
          {boards.map((board) => (
            <li key={board.id}>
              <div className="flex flex-col justify-center gap-8 items-center bg-[var(--muted)] p-4 rounded-lg shadow-2xl text-pre-wrap h-82">
                <h3 className="text-4xl flex gap-2 items-center justify-center text-center">
                  <a
                    className="hover:text-[var(--muted-foreground)] transition-colors duration-300"
                    href={`/board/${board.id}`}
                  >
                    {board.title}
                  </a>
                  <button
                    onClick={() => handleDelete(board.id)}
                    className="p-2 rounded-lg bg-[var(--destructive)] text-sm text-white cursor-pointer"
                  >
                    Eliminar
                  </button>
                </h3>
                <div className="flex gap-4">
                  <ul className="flex flex-col gap-2 w-1/2 h-52 p-4 overflow-y-auto">
                    <h4 className="text-2xl font-bold text-center">Pros</h4>
                    {ExtraerPros(board).map((pros: string) => (
                      <li key={Math.random()}>{pros}</li>
                    ))}
                  </ul>
                  <span className="w-[2px] h-52 bg-[var(--foreground)]"></span>
                  <ul className="flex flex-col gap-2 w-1/2 h-52 p-4 overflow-y-auto">
                    <h4 className="text-2xl font-bold text-center">Contras</h4>
                    {ExtraerCons(board).map((cons: string) => (
                      <li key={Math.random()}>{cons}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="absolute bottom-4 flex gap-4 justify-center w-full">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="p-2 rounded-lg bg-[var(--primary)] text-white cursor-pointer"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="p-2 rounded-lg bg-[var(--primary)] text-white cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>
    </Suspense>
  );
};

export default Boards;
