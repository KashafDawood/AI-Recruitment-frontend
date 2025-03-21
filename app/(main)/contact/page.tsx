"use client";

import { useActionState } from "react";
import { sendContactEmail } from "@/api/user/contactus-sendemail";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import GlowBackground from "@/components/custom/glowBackground";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { useFormStatus } from "react-dom";

export default function ContactPage() {
  const initialState = { success: false, error: null, errors: {} };
  const [state, formAction] = useActionState(sendContactEmail, initialState);

  // Use server validation errors if available
  const errors = state.errors || {};

  return (
    <main className="overflow-hidden">
      <section className="relative pt-24 md:pt-36 pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center sm:mx-auto mb-12 md:mb-16">
            <span className="text-foreground text-sm border rounded-full px-3 py-1">
              Get In Touch
            </span>

            <div className="mt-8 text-balance text-4xl md:text-6xl lg:mt-8 font-black">
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h1"
                className="inline"
              >
                Contact
              </TextEffect>{" "}
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="span"
                className="inline gradient-text"
              >
                Our Team
              </TextEffect>
            </div>

            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              delay={0.5}
              as="p"
              className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground"
            >
              We&apos;d love to hear from you! Reach out with any questions
              about our platform or how we can help with your recruitment needs.
            </TextEffect>
          </div>

          {/* Contact Form Card */}
          <div className="max-w-[40%] mx-auto">
            <Card className="backdrop-blur border-border/40 shadow-lg overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Send Us A Message</h2>

                <form action={formAction} className="space-y-6">
                  {state.error && (
                    <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-md text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-900/50">
                      {state.error}
                    </div>
                  )}

                  {state.success && (
                    <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-md text-green-600 dark:text-green-400 text-sm border border-green-100 dark:border-green-900/50">
                      Your message has been sent successfully! We&apos;ll get
                      back to you soon.
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      className={errors.name ? "border-red-500" : ""}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      className={errors.email ? "border-red-500" : ""}
                      placeholder="Your email"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      className={errors.subject ? "border-red-500" : ""}
                      placeholder="Subject of your message"
                    />
                    {errors.subject && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      className={errors.message ? "border-red-500" : ""}
                      placeholder="Your message..."
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <SubmitButton />
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <GlowBackground />
      </section>
    </main>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full gradient-button text-base py-6"
      disabled={pending}
    >
      {pending ? "Sending..." : "Send Message"}
    </Button>
  );
}
