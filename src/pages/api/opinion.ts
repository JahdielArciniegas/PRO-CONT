import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { title, pros, cons } = await request.json();
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.IA_TOKEN}`,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-8b-instruct:free",
          messages: [
            {
              role: "system",
              content:
                "Eres el consejero de alguien que esta tomando una decision, dale consejos sobre cual es la mas optima dependenciendo de los pros y contras que le dio",
            },
            {
              role: "user",
              content: `Dado el titulo: ${title} y los pros: ${pros} y los contras: ${cons}, dale consejos sobre cual es la mas optima dependenciendo de los pros y contras que le dio, dame una respuesta no muy larga y concisa`,
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
      JSON.stringify({ error: "Error al obtener la opinion" }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
};
