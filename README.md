Handling form submissions in modern web applications is crucial for providing users with a responsive and clear experience. In this article, we’ll build a contact form in a **Next.js** and **React** project that uses **Supabase** for backend operations, but can be adapted to any datasource. Our form will display a loading state during submission, prevent multiple submissions, and reset the form after a successful submission.

Check out the GitHub repository [here](https://github.com/owolfdev/contact-form) and see the live deployment on [Vercel](https://vercel.com/owolfdevs-projects/contact-form).

### Key Features:

1. Displays a "Submitting..." message while processing.
2. Prevents multiple submissions.
3. Updates the UI with a success message once the form is submitted.

Let’s break this down into simple and reusable code examples.

---

## Example 1: Setting Up the Contact Form

We’ll start by creating the form that users will fill out. In this example, we’re using the `useFormState` and `useFormStatus` hooks from React to handle form state and submission status. Here’s the code for the form:

```jsx
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

// Initialize form state
const initialState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus(); // Track form submission status
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
  const [selectedType, setSelectedType] =
    (React.useState < string) | (undefined > undefined);

  // Create a ref for the form element
  const formRef = React.useRef < HTMLFormElement > null;

  // Reset the form upon successful submission
  React.useEffect(() => {
    if (state?.message === "Your message has been sent successfully.") {
      if (formRef.current) {
        formRef.current.reset(); // Reset form fields
      }
      setSelectedType(undefined); // Reset the Select component
      alert(state.message); // Optional alert
    }
  }, [state?.message]);

  return (
    <form action={formAction} ref={formRef}>
      <label htmlFor="type">Message Type</label>
      <Select
        name="type"
        required
        value={selectedType}
        onValueChange={setSelectedType}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="correspondence">Correspondence</SelectItem>
          <SelectItem value="bug report">Bug Report</SelectItem>
          <SelectItem value="inquiry">Inquiry</SelectItem>
        </SelectContent>
      </Select>

      <label htmlFor="name">Name</label>
      <Input type="text" id="name" name="name" required />

      <label htmlFor="email">Email</label>
      <Input type="text" id="email" name="email" required />

      <label htmlFor="message">Message</label>
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
```

### Explanation:

- **`useFormState`**: Initializes and manages the form’s state. It triggers the `sendContactMessage` action when the form is submitted.
- **`useFormStatus`**: Tracks the submission status, allowing us to display "Submitting..." and disable the button while the form is being processed.
- **SubmitButton Component**: Handles the button state and updates its label based on the submission status.

---

## Example 2: Handling the Form Submission

Now let’s implement the `sendContactMessage` action, which submits the form data to **Supabase** (or any backend of your choice). This example saves the contact message in a **Supabase** table called `contact_test_app`.

```javascript
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/supabase-client-server";
import { redirect } from "next/navigation";

export async function sendContactMessage(
  state: { message: string },
  formData: FormData
) {
  const supabase = createClient();

  // Define schema for validation
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    message: z.string(),
    type: z.string(),
  });

  // Parse and validate the form data
  const data = schema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    type: formData.get("type"),
  });

  // Simulate an async task
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Insert data into Supabase
  const { error } = await supabase.from("contact_test_app").insert([
    {
      name: data.name,
      email: data.email,
      message: data.message,
      type: data.type,
      created_at: new Date(), // Optional timestamp
    },
  ]);

  if (error) {
    console.error("Error inserting data:", error);
    return {
      message: "An error occurred while sending your message.",
    };
  }

  // Revalidate the page and redirect to a thank you page
  revalidatePath("/contact");
  redirect("/contact/thank-you");

  return {
    message: "Your message has been sent successfully.",
  };
}
```

### Explanation:

- **Data Validation**: Using `zod`, we validate the input to ensure that all fields are present and formatted correctly.
- **Supabase Integration**: We insert the validated data into Supabase. If any errors occur during insertion, we return an error message.
- **Revalidate and Redirect**: After the data is inserted, we revalidate the page and redirect the user to a thank-you page.

---

## Example 3: Rendering the Form on the Page

Now, let’s render the contact form on a page. This component wraps our form and is the main entry point.

```jsx
import ContactForm from "./form";

export default async function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ContactForm />
      </main>
    </div>
  );
}
```

This component sets up a simple grid layout and loads the `ContactForm` component.

---

### Conclusion

Using **Next.js**, **React**, and **Supabase**, we’ve built a fully functional contact form that handles user input, processes the data, and provides real-time feedback to the user during submission. The form is flexible and can be easily adapted to other data sources or platforms.

Check out the [GitHub repository](https://github.com/owolfdev/contact-form) and the [live deployment](https://contact-form-sigma-six.vercel.app/contact) to see this contact form in action.
