"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface ForgetPasswordFormProps
  extends React.ComponentPropsWithoutRef<"div"> {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  state?: {
    message?: string;
    errors?: {
      email?: string | string[];
    };
    serverError?: string;
    pending?: boolean;
  };
  emailRef: React.RefObject<HTMLInputElement | null>;
}

export function ForgetPasswordForm({
  handleSubmit,
  state,
  emailRef,
  className,
  ...props
}: ForgetPasswordFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  ref={emailRef} // Attach ref for clearing input field
                />
              </div>
              {state?.errors?.email && (
                <p className="text-red-500">{state.errors.email}</p>
              )}
              <SubmitButton pending={state?.pending} />
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-center text-sm">
        Remembered your password?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </div>
  );
}

function SubmitButton({ pending }: { pending?: boolean }) {
  return (
    <Button disabled={pending} type="submit" className="w-full">
      {pending ? "Sending..." : "Send Reset Link"}
    </Button>
  );
}
