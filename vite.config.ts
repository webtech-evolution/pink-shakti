import { mkdir, writeFile } from "node:fs/promises";
import { defineConfig, type Plugin, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";
import prerender from "@prerenderer/rollup-plugin";

const siteUrl = "https://www.pinkshakti.com";
const staticRoutes = [
  "/",
  "/about",
  "/how-it-works",
  "/pillars",
  "/events",
  "/showcase",
  "/circles",
  "/stories",
  "/faq",
  "/awards",
  "/membership",
  "/sakhi-bazaar",
  "/sell",
  "/media",
  "/partners",
  "/partner",
  "/contact",
  "/csr",
  "/privacy",
  "/terms",
  "/join",
  "/resources",
];

function sitemapPlugin(routes: string[]): Plugin {
  return {
    name: "pink-shakti-sitemap",
    apply: "build",
    async closeBundle() {
      const urls = routes
        .map((route) => new URL(route, `${siteUrl}/`).toString())
        .map((url) => `    <url><loc>${url.replaceAll("&", "&amp;")}</loc></url>`)
        .join("\n");
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
      const outputDir = path.resolve(process.cwd(), "dist");
      await mkdir(outputDir, { recursive: true });
      await writeFile(path.join(outputDir, "sitemap.xml"), sitemap, "utf8");
    },
  };
}

// Runs the Express API (server/app.js) inside the Vite dev server, so `npm run dev` starts everything.
function apiPlugin(): Plugin {
  return {
    name: "pink-shakti-api",
    apply: "serve",
    async configureServer(server) {
      const { app, runReminders } = await import("./server/app.js");
      runReminders();
      setInterval(runReminders, 6 * 3600e3);
      server.middlewares.use(app);
    },
  };
}

export default defineConfig(async ({ mode, command }) => {
  const routes = [...staticRoutes];

  const plugins: PluginOption[] = [react(), tailwindcss(), tsconfigPaths(), apiPlugin()];
  if (command === "build") {
    const rendererOptions: {
      renderAfterTime: number;
      launchOptions?: {
        args: string[];
        executablePath: string;
        headless: boolean;
      };
    } = { renderAfterTime: 2500 };

    if (process.env.VERCEL === "1" && process.platform === "linux") {
      const chromium = (await import("@sparticuz/chromium")).default;
      rendererOptions.launchOptions = {
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      };
    }

    plugins.push(
      prerender({
        routes,
        renderer: "@prerenderer/renderer-puppeteer",
        rendererOptions,
        postProcess(renderedRoute) {
          renderedRoute.html = renderedRoute.html.replace(
            /http:\/\/(?:127\.0\.0\.1|localhost):\d+/g,
            siteUrl,
          );
        },
      }) as unknown as PluginOption,
      sitemapPlugin(routes),
    );
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "::",
      port: 8080,
    },
  };
});
