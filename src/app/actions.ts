"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";

// Path to the JSON file
const filePath = path.join(
  process.cwd(),
  "src",
  "app",
  "local_data",
  "todos.json"
);

export async function createTodo(
  state: { message: string },
  formData: FormData
) {
  const schema = z.object({
    todo: z.string(),
  });

  const data = schema.parse({
    todo: formData.get("todo"),
  });

  // Simulate an async task with a Promise that resolves after 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Read the existing todos from the file
  const fileContent = await fs.readFile(filePath, "utf-8");
  const todos = JSON.parse(fileContent);

  // Add the new todo to the list
  todos.push({
    id: Date.now(), // Unique ID for the todo
    text: data.todo,
  });

  // Write the updated todos back to the file
  await fs.writeFile(filePath, JSON.stringify(todos, null, 2));

  // Revalidate the page to show the new todo
  revalidatePath("/");

  return {
    message: "Task created",
  };
}
