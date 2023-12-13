import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    experimentalStudio: true,
  },
  viewportWidth: 1536,
  viewportHeight: 960,
});
