import { connectToDB } from "@src/lib/mongoDb";
import useIA from "@src/models/useIA";
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const userId = request.headers.get("userId");
  try {
    await connectToDB();
    const userIa = await useIA.find({ userId: userId });
    return new Response(JSON.stringify(userIa), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await connectToDB();
    const body = await request.json();
    const newUserIa = await useIA.create(body);
    return new Response(JSON.stringify(newUserIa), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
