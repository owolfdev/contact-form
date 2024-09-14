// import fs from "node:fs/promises";
// import path from "node:path";
import { getAllMessages } from "../actions";

// Define the Todo type
type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  type: string;
  created_at: string;
};

export default async function Home() {
  const { messages } = await getAllMessages(); // Get the list of todos

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h2 className="text-3xl font-bold">Thank You for your message!</h2>
        {/* Display the list of messages */}
        <ul className="flex flex-col gap-2 max-w-[800px]">
          {messages.map((message: Message) => (
            <li key={message.id} className="border rounded-lg py-2 px-4">
              <div>Date: {message.created_at.split("T")[0]}</div>
              <div>Message Type: {message.type}</div>
              <div>Name: {message.name}</div>
              <div>Email: {message.email}</div>
              <div className="">Message: {message.message}</div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
