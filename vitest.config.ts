import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: { "@content": path.resolve(__dirname, "content"), "@": path.resolve(__dirname, "src") },
  },
  test: { include: ["tests/**/*.test.ts"] },
});
