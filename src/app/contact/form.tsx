"use client";

import React from "react";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { sendContactMessage } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Initialize the state with an empty message string
const initialState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      aria-disabled={pending}
      disabled={pending}
      type="submit"
      className="text-lg outline"
    >
      {pending ? "Submitting..." : "Submit"}
    </Button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useFormState(sendContactMessage, initialState);

  const [selectedType, setSelectedType] = React.useState<string | undefined>(
    undefined
  ); // Track the selected value in the Select

  // Create a ref for the form element
  const formRef = React.useRef<HTMLFormElement>(null);

  // Reset the form when the message is sent successfully
  React.useEffect(() => {
    if (state?.message === "Your message has been sent successfully.") {
      if (formRef.current) {
        formRef.current.reset(); // Reset the form fields
      }

      setSelectedType(undefined); // Reset the Select component
      alert(state.message); // Optional alert to notify the user
    }
  }, [state?.message]);

  return (
    <form action={formAction} ref={formRef}>
      {/* ref attached to the form */}
      <label htmlFor="type">Enter Type</label>
      <Select
        name="type"
        required
        value={selectedType}
        onValueChange={setSelectedType}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Message Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="correspondence">Correspondence</SelectItem>
          <SelectItem value="bug report">Bug Report</SelectItem>
          <SelectItem value="inquiry">Inquiry</SelectItem>
        </SelectContent>
      </Select>
      <label htmlFor="name">Enter Name</label>
      <Input type="text" id="name" name="name" required />
      <label htmlFor="email">Enter Email</label>
      <Input type="text" id="email" name="email" required />
      <label htmlFor="message">Enter Message</label>
      <Textarea id="message" name="message" required />

      <div className="pt-2">
        <SubmitButton />
      </div>
      <p aria-live="polite" className="sr-only" role="status">
        {state?.message}
      </p>
    </form>
  );
}
