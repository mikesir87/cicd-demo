const request = require("supertest");
const app = require("./app");

beforeEach(() => {
  app.resetState();
});

describe("GET /", () => {
  it("returns a health check message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Task API is running");
  });
});

describe("GET /tasks", () => {
  it("returns an empty array when no tasks exist", async () => {
    const res = await request(app).get("/tasks");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns all tasks", async () => {
    await request(app).post("/tasks").send({ title: "Buy groceries" });
    await request(app).post("/tasks").send({ title: "Walk the dog" });

    const res = await request(app).get("/tasks");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe("POST /tasks", () => {
  it("creates a new task", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Buy groceries" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, title: "Buy groceries", done: false });
  });

  it("returns 400 when title is missing", async () => {
    const res = await request(app).post("/tasks").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("returns 400 when title is blank", async () => {
    const res = await request(app).post("/tasks").send({ title: "   " });
    expect(res.status).toBe(400);
  });
});

describe("GET /tasks/:id", () => {
  it("returns a task by id", async () => {
    await request(app).post("/tasks").send({ title: "Buy groceries" });

    const res = await request(app).get("/tasks/1");
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Buy groceries");
  });

  it("returns 404 for a non-existent task", async () => {
    const res = await request(app).get("/tasks/99");
    expect(res.status).toBe(404);
  });
});

describe("PATCH /tasks/:id", () => {
  it("marks a task as done", async () => {
    await request(app).post("/tasks").send({ title: "Buy groceries" });

    const res = await request(app).patch("/tasks/1").send({ done: true });
    expect(res.status).toBe(200);
    expect(res.body.done).toBe(true);
  });

  it("returns 404 for a non-existent task", async () => {
    const res = await request(app).patch("/tasks/99").send({ done: true });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /tasks/:id", () => {
  it("deletes a task", async () => {
    await request(app).post("/tasks").send({ title: "Buy groceries" });

    const deleteRes = await request(app).delete("/tasks/1");
    expect(deleteRes.status).toBe(204);

    const getRes = await request(app).get("/tasks/1");
    expect(getRes.status).toBe(404);
  });

  it("returns 404 when deleting a non-existent task", async () => {
    const res = await request(app).delete("/tasks/99");
    expect(res.status).toBe(404);
  });
});
