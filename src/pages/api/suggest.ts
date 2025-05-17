import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { latestPetition, title } = await request.json();
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.IA_TOKEN}`,
        },
        body: JSON.stringify({
          model: "nousresearch/deephermes-3-mistral-24b-preview:free",
          messages: [
            {
              role: "system",
              content:
                "Eres un asistente que ayuda a los usuarios a crear listas de pros y contras para sus tableros.",
            },
            {
              role: "user",
              content: `Dado el titulo: ${title}, sugiere un ${
                latestPetition ? "pro" : "contra"
              } corto de 5 palabras maximo`,
            },
          ],
        }),
      }
    );
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ error: "Error al obtener la sugerencia" }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
};
