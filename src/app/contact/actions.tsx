"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/supabase-client-server";
import { redirect } from "next/navigation";

export async function sendContactMessage(
  state: { message: string },
  formData: FormData
) {
  // Initialize Supabase client
  const supabase = createClient();

  // Define schema for validation
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    message: z.string(),
    type: z.string(),
  });

  // Parse and validate form data
  const data = schema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    type: formData.get("type"),
  });

  // Simulate an async task (optional)
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Insert data into the Supabase table
  const { error } = await supabase.from("contact_test_app").insert([
    {
      name: data.name,
      email: data.email,
      message: data.message,
      type: data.type,
      created_at: new Date(), // Optional: Add a timestamp
    },
  ]);

  // Handle possible errors
  if (error) {
    console.error("Error inserting data into Supabase:", error);
    return {
      message: "An error occurred while sending your message.",
    };
  }

  // Revalidate the page to show the new data
  revalidatePath("/contact");
  redirect("/contact/thank-you");

  return {
    message: "Your message has been sent successfully.",
  };
}

export async function getAllMessages() {
  // Initialize Supabase client
  const supabase = createClient();

  // Fetch all messages from the 'contact_test_app' table
  const { data, error } = await supabase
    .from("contact_test_app")
    .select("*")
    .order("created_at", { ascending: false }); // Optional: Order by latest messages

  // Handle possible errors
  if (error) {
    console.error("Error fetching messages from Supabase:", error);
    return {
      messages: [],
      error: "An error occurred while fetching messages.",
    };
  }

  // Return the fetched messages
  return {
    messages: data,
  };
}
