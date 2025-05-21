import type { Board } from "@src/lib/types";

const url = `${import.meta.env.API_URI}/boards`;

export const getLengthBoards = async (userId: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      userId,
    },
  });
  const data = await response.json();
  return data.length;
};

export const getBoards = async (userId: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      userId: `${userId}`,
    },
  });
  const data = await response.json();
  return data;
};

export const getBoard = async (id: string) => {
  const response = await fetch(`${url}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

export const deleteBoard = async (id: string) => {
  const response = await fetch(`${url}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

export const updateBoard = async (id: string, board: Board) => {
  const response = await fetch(`${url}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(board),
  });
  const data = await response.json();
  return data;
};

export const createBoard = async (board: Board) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(board),
  });
  const data = await response.json();
  return data;
};
