"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { createTodo } from "./actions";

// Initialize the state with an empty message string
const initialState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button aria-disabled={pending} disabled={pending} type="submit">
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

export default function AddForm() {
  const [state, formAction] = useFormState(createTodo, initialState);
  return (
    <form action={formAction}>
      <label htmlFor="todo">Enter Task</label>
      <input
        className="text-black"
        type="text"
        id="todo"
        name="todo"
        required
      />
      <SubmitButton />
      <p aria-live="polite" className="sr-only" role="status">
        {state?.message}
      </p>
    </form>
  );
}
