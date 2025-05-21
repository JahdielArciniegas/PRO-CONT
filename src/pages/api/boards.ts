import { connectToDB } from "@src/lib/mongoDb";
import Board from "@src/models/board";
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    await connectToDB();
    const body = await request.json();
    const newBoard = await Board.create(body);
    return new Response(JSON.stringify(newBoard), { status: 201 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const GET: APIRoute = async ({ request }) => {
  const userId = request.headers.get("userId");
  try {
    await connectToDB();
    const boards = await Board.find({ id_user: userId });
    return new Response(JSON.stringify(boards), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
