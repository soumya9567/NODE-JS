// const http = require('http');
// const fs = require('fs');
// const path = require('path');

// const dummy = require('./dummy.js');

import http from "http";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, "todo.json");

async function readJsonFile() {
  try {
    if (!(await fs.stat(jsonPath).catch(() => false))) {
      await fs.writeFile(jsonPath, JSON.stringify([]));
    }
    const fileContent = await fs.readFile(jsonPath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return [];
  }
}

async function addData(todo) {
  try {
    await fs.writeFile(jsonPath, JSON.stringify(todo, null, 2));
  } catch (error) {
    console.error("Error writing to JSON file:", error);
  }
}

const server = http.createServer(async (request, response) => {
  console.log(request.method, "Request Method");
  console.log(request.url, "Request URL");

  const todoPath = path.join(__dirname, "to-do.html");
  const scriptPath = path.join(__dirname, "script.js");

  if (request.url === "/" && request.method === "GET") {
    try {
      const data = await fs.readFile(todoPath, "utf-8");
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end(data);
    } catch (err) {
      response.writeHead(500, { "Content-Type": "text/plain" });
      response.end("Error loading page");
    }
  } else if (request.url === "/script.js" && request.method === "GET") {
    try {
      const data = await fs.readFile(scriptPath, "utf-8");
      response.writeHead(200, { "Content-Type": "application/javascript" });
      response.end(data);
    } catch (err) {
      response.writeHead(500, { "Content-Type": "text/plain" });
      response.end("Error loading script");
    }
  } else if (request.url === "/add" && request.method === "POST") {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", async () => {
      try {
        const todos = await readJsonFile();
        const parsedBody = JSON.parse(body);
        console.log(parsedBody, "parsed body")
        const newTodo = { todo: parsedBody.todo,
          id: Date.now()
        };
        todos.push(newTodo);

        await addData(todos);

        response.writeHead(201, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Todo added successfully", todos }));
      } catch (error) {
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Failed to add todo", error }));
      }
    });
  } else if (request.url === "/getTodos" && request.method === "GET") {
    try {
      const data = await readJsonFile();
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(data));
    } catch (err) {
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ message: "Failed to fetch todos", error: err }));
    }
  } else {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("404 Not Found");
  }
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});