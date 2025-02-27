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
  console.time("mongo-fetch");
  const tasks = await Task.find();
  console.timeEnd("mongo-fetch");
  res.json(tasks);
});

// Seed function
async function seed() {
  for (let i = 1; i <= 100; i++) {
    await Task.create({ title: `Task ${i}` });
  }
  console.log("Seeded 100 tasks into MongoDB");
}

// Start the server
async function start() {
  await initDb();
  await seed();
  app.listen(3002, () => console.log("MongoDB API running on port 3002"));
}

start().catch((err) => console.error("Failed to start MongoDB API:", err));
