import AddForm from "./my-form";
import fs from "node:fs/promises";
import path from "node:path";
import { redirect } from "next/navigation";

// Define the Todo type
type Todo = {
  id: number;
  text: string;
};

// Function to read todos from the JSON file
async function getTodos(): Promise<Todo[]> {
  const filePath = path.join(
    process.cwd(),
    "src",
    "app",
    "local_data",
    "todos.json"
  );
  const fileContent = await fs.readFile(filePath, "utf-8");
  const todos: Todo[] = JSON.parse(fileContent);
  return todos;
}

export default async function Home() {
  const todos = await getTodos(); // Get the list of todos

  redirect("/contact");

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <AddForm />
        {/* Display the list of todos */}
        <ul>
          {todos.map((todo: Todo) => (
            <li key={todo.id} className="">
              {todo.text}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
