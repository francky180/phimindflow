import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  outputDir: "./reports",
  timeout: 30000,
  use: {
    baseURL: "https://phimindflow-mtr13wp9r-francky180s-projects.vercel.app",
    screenshot: "on",
    video: "off",
    trace: "off",
  },
  reporter: [
    ["list"],
    ["json", { outputFile: "./reports/test-results.json" }],
  ],
  projects: [
    {
      name: "Desktop",
      use: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: "Mobile",
      use: { viewport: { width: 390, height: 844 } },
    },
  ],
});
