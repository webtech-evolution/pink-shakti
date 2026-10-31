import { Client, Databases, Query } from "appwrite";
import { mkdir, writeFile } from "node:fs/promises";
import { defineConfig, loadEnv, type Plugin, type PluginOption } from "vite";
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

export default defineConfig(async ({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const routes = [...staticRoutes];

  if (
    command === "build" &&
    env.VITE_APPWRITE_ENDPOINT &&
    env.VITE_APPWRITE_PROJECT_ID &&
    env.VITE_APPWRITE_DATABASE_ID &&
    env.VITE_APPWRITE_EVENTS_COLLECTION_ID
  ) {
    try {
      const client = new Client()
        .setEndpoint(env.VITE_APPWRITE_ENDPOINT)
        .setProject(env.VITE_APPWRITE_PROJECT_ID);
      const databases = new Databases(client);
      const events = await databases.listDocuments(
        env.VITE_APPWRITE_DATABASE_ID,
        env.VITE_APPWRITE_EVENTS_COLLECTION_ID,
        [Query.equal("status", "published"), Query.limit(100)],
      );
      for (const event of events.documents) {
        const slug = event.slug || event.$id;
        if (slug) routes.push(`/events/${encodeURIComponent(String(slug))}`);
      }
    } catch (error) {
      console.warn(
        "Could not load published events for prerendering and sitemap generation.",
        error instanceof Error ? error.message : error,
      );
    }
  }

  const plugins: PluginOption[] = [react(), tailwindcss(), tsconfigPaths()];
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
