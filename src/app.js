const express = require("express");

const app = express();
app.use(express.json());

// In-memory task store
let tasks = [];
let nextId = 1;

app.get("/", (req, res) => {
  res.json({ message: "Go Hokies!!! 🍁" });
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "title is required" });
  }

  const task = { id: nextId++, title: title.trim(), done: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.get("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

app.patch("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });

  if (req.body.done !== undefined) task.done = Boolean(req.body.done);
  if (req.body.title !== undefined) task.title = req.body.title.trim();

  res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const index = tasks.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Task not found" });

  tasks.splice(index, 1);
  res.status(204).send();
});

// Reset state (used in tests)
app.resetState = () => {
  tasks = [];
  nextId = 1;
};

module.exports = app;
