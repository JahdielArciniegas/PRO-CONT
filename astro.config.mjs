// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import clerk from "@clerk/astro";
import { esES } from "@clerk/localizations";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [clerk({
    localization: esES,
  }), react()],
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: node({ mode: "standalone" }),
  output: "server",
});