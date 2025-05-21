import { connectToDB } from "@src/lib/mongoDb";
import type { APIRoute } from "astro";
import Board from "@src/models/board";

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  try {
    await connectToDB();
    const board = await Board.findById(id);
    return new Response(JSON.stringify(board), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = params.id;
  try {
    await connectToDB();
    const board = await Board.findByIdAndDelete(id);
    return new Response(JSON.stringify(board), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  const id = params.id;
  try {
    await connectToDB();
    const board = await Board.findByIdAndUpdate(id, await request.json(), {
      new: true,
    });
    return new Response(JSON.stringify(board), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};
