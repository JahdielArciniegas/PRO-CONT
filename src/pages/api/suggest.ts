import type { APIRoute } from "astro";
import { HfInference } from "@huggingface/inference";
import { model } from "mongoose";

export const prerender = false;

const hf = new HfInference(import.meta.env.IA_AUTOMATE_TOKEN);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { latestPetition, title } = await request.json();
    const response = await hf.chatCompletion({
      provider: "hf-inference",
      model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente que ayuda a los usuarios a crear listas de pros y contras para sus tableros.",
        },
        {
          role: "user",
          content: `Dado el titulo: ${title}, sugiere solo un ${
            latestPetition ? "pro" : "contra"
          } corto de 5 palabras maximo, no pongas nada mas que la sugerencia y en español`,
        },
      ],
    });
    console.log(response.choices[0].message.content);
    const data = response.choices[0].message.content;
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
