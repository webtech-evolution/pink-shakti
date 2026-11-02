// Production: serves the built site (dist/) and the API from one Node process. Run `npm run build` then `npm start`.
import express from "express";
import path from "node:path";
import fs from "node:fs";
import { app, runReminders } from "./app.js";

const dist = path.resolve(process.cwd(), "dist");
app.use(express.static(dist, { index: false }));
app.get("*", (req, res) => {
  const pre = path.join(dist, req.path, "index.html"); // prerendered page if it exists
  res.sendFile(fs.existsSync(pre) ? pre : path.join(dist, "index.html"));
});

runReminders();
setInterval(runReminders, 6 * 3600e3);
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Pink Shakti running on http://localhost:${port}`));
