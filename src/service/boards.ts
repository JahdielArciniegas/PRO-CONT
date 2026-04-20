import type { Board } from "@src/lib/types";

const domain = import.meta.env.PUBLIC_DOMAIN || "http://localhost:4321/api";

export const getLengthBoards = async (userId: string) => {
  try {
    const response = await fetch(`${domain}/boards`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        userId,
      },
    });
    const data = await response.json();
    return data.length;
  } catch (error) {
    console.error("Error al obtener la longitud de las tablas:", error);
    return 0;
  }
};

export const getBoards = async (userId: string) => {
  try {
    const response = await fetch(`${domain}/boards`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        userId: `${userId}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener las tablas:", error);
    return [];
  }
};

export const getBoard = async (id: string) => {
  try {
    const response = await fetch(`${domain}/boards/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener la tabla:", error);
    return null;
  }
};

export const deleteBoard = async (id: string) => {
  try {
    const response = await fetch(`${domain}/boards/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al eliminar la tabla:", error);
    return null;
  }
};

export const updateBoard = async (id: string, board: Board) => {
  try {
    const response = await fetch(`${domain}/boards/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(board),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al actualizar la tabla:", error);
    return null;
  }
};

export const createBoard = async (board: Board) => {
  try {
    const response = await fetch(`${domain}/boards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(board),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al crear la tabla:", error);
    return null;
  }
};
