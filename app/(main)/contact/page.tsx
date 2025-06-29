"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Zod schema for validation
const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(5, "Message is required"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactForm) => {
    // Here we would send the form data to your backend or API
    toast.success("Thank you for contacting us! We'll get back to you soon.");
    reset();
  };

  return (
    <main className="flex-1 flex items-center justify-center bg-background min-h-[75vh]">
      <div className="w-[80%] mx-auto px-4 max-w-2xl py-12">
        <h1 className="text-4xl font-bold mb-6 text-center text-foreground">
          Contact <span className="text-primary">Us</span>
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-10">
          Have questions, feedback, or want to collaborate? Fill out the form below and our team will get back to you soon.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-card rounded-lg shadow p-8 flex flex-col gap-6"
          noValidate
        >
          <div>
            <Input
              {...register("name")}
              placeholder="Your Name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              required
            />
            {errors.name && (
              <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Input
              {...register("email")}
              type="email"
              placeholder="Your Email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              required
            />
            {errors.email && (
              <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Textarea
              {...register("message")}
              placeholder="Your Message"
              rows={5}
              aria-invalid={!!errors.message}
              required
            />
            {errors.message && (
              <p className="text-destructive text-xs mt-1">{errors.message.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </main>
  );
}

