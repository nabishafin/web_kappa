"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { sleep } from "@/lib/utils";
import { toast } from "@/lib/toast";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.email("Enter a valid email address."),
  topic: z.enum(["account", "billing", "playback", "creator", "other"]),
  message: z.string().trim().min(20, "Tell us a little more (at least 20 characters).").max(2000, "Keep it under 2,000 characters."),
});
type Values = z.infer<typeof schema>;

const field =
  "w-full rounded-[10px] border border-white/10 bg-[#130e1b] px-4 text-base text-white placeholder:text-white/35 placeholder:opacity-100 focus:border-brand/70 focus:outline-none aria-invalid:border-danger";

export function ContactForm() {
  const id = useId();
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { topic: "account", name: "", email: "", message: "" } });

  const onSubmit = async () => {
    await sleep(900); // TODO: POST /support/tickets
    reset();
    setDone(true);
    toast.success("Message sent", { description: "We’ll reply within 24 hours." });
  };

  const a11y = (k: keyof Values) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${id}-${k}-err` : undefined,
  });

  const err = (k: keyof Values) =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} role="alert" className="mt-1.5 text-sm text-[#ff8a93]">
        {errors[k]?.message}
      </p>
    ) : null;

  return (
    <section aria-labelledby={`${id}-h`} className="border-glow h-fit rounded-[16px] bg-panel p-6 sm:p-8">
      <h2 id={`${id}-h`} className="text-2xl font-semibold">
        Contact us
      </h2>
      {done ? (
        <div aria-live="polite" className="mt-6 flex gap-3 rounded-xl bg-[#3ddc97]/10 p-4 text-[#bff3dc]">
          <CheckCircle2 aria-hidden className="size-6 shrink-0" />
          <div>
            <p>Thanks! Your message is on its way — we’ll reply to your inbox within 24 hours.</p>
            <button type="button" onClick={() => setDone(false)} className="mt-2 text-sm underline">
              Send another message
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
          <div>
            <label htmlFor={`${id}-name`} className="mb-2 block text-sm text-white/80">
              Name
            </label>
            <input id={`${id}-name`} autoComplete="name" className={`${field} h-12`} {...a11y("name")} {...register("name")} />
            {err("name")}
          </div>
          <div>
            <label htmlFor={`${id}-email`} className="mb-2 block text-sm text-white/80">
              Email
            </label>
            <input id={`${id}-email`} type="email" autoComplete="email" className={`${field} h-12`} {...a11y("email")} {...register("email")} />
            {err("email")}
          </div>
          <div>
            <label htmlFor={`${id}-topic`} className="mb-2 block text-sm text-white/80">
              Topic
            </label>
            <select id={`${id}-topic`} className={`${field} h-12 cursor-pointer`} {...register("topic")}>
              <option value="account">Account &amp; sign-in</option>
              <option value="billing">Billing &amp; subscription</option>
              <option value="playback">Playback problem</option>
              <option value="creator">Creator program</option>
              <option value="other">Something else</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${id}-message`} className="mb-2 block text-sm text-white/80">
              Message
            </label>
            <textarea id={`${id}-message`} rows={5} className={`${field} resize-y py-3`} {...a11y("message")} {...register("message")} />
            {err("message")}
          </div>
          <Button type="submit" block loading={isSubmitting} className="h-12">
            Send message
          </Button>
        </form>
      )}
    </section>
  );
}
