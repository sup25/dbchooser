import express, { Request, Response } from "express";
import { Task, initDb } from "./db";

const app = express();
app.use(express.json());

// Routes
app.post("/tasks", async (req: Request, res: Response) => {
  const task = await Task.create({ title: req.body.title });
  res.json(task);
});

app.get("/tasks", async (_req: Request, res: Response) => {
  console.time("postgres-fetch");
  const tasks = await Task.findAll();
  console.timeEnd("postgres-fetch");
  res.json(tasks);
});

// Seed function
async function seed() {
  for (let i = 1; i <= 100; i++) {
    await Task.create({ title: `Task ${i}` });
  }
  console.log("Seeded 100 tasks into PostgreSQL");
}

// Start the server
async function start() {
  await initDb();
  await seed();
  app.listen(3001, () => console.log("Postgres API running on port 3001"));
}

start().catch((err) => console.error("Failed to start Postgres API:", err));
