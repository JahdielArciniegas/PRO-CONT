import PocketBase from "pocketbase";
import type { Board } from "./types";

const pb = new PocketBase("http://localhost:8090");

export const getLengthBoards = async (userId: string) => {
  const boards = await pb.collection("boards").getFullList({
    filter: `id_user = "${userId}"`,
  });
  return boards.length;
};

export const getBoards = async (userId: string, page: number) => {
  const board = await pb.collection("boards").getList<Board>(page, 4, {
    filter: `id_user = "${userId}"`,
  });
  return board;
};

export const getBoard = async (id: string) => {
  const board = await pb.collection("boards").getOne(id);
  return board;
};

export const deleteBoard = async (id: string) => {
  await pb.collection("boards").delete(id);
};

export const updateBoard = async (id: string, title: string) => {
  await pb.collection("boards").update(id, { title });
};

export const createBoard = async (board: Board) => {
  await pb.collection("boards").create(board);
};
