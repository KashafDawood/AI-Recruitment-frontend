"use client";

import type React from "react";

import { useState } from "react";
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
import { useFormStatus } from "react-dom";
import { EyeIcon, EyeOffIcon, BriefcaseIcon, UserIcon } from "lucide-react";

interface SignupFormProps extends React.ComponentPropsWithoutRef<"div"> {
  formAction: (payload: FormData) => void;
  state?: {
    message?: string;
    errors?: {
      name?: string | string[];
      email?: string | string[];
      password?: string | string[];
      role?: string | string[];
    };
    serverError?: string;
  };
}

export function SignupForm({
  formAction,
  state,
  className,
  ...props
}: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<
    "employer" | "candidate" | null
  >(null);

  return (
    <div
      className={cn("flex flex-col items-center gap-6", className)}
      {...props}
    >
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Sign up to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
                {state?.errors?.name && (
                  <p className="text-sm text-red-500">{state.errors.name}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                />
                {state?.errors?.email && (
                  <p className="text-sm text-red-500">{state.errors.email}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
                {state?.errors?.password && (
                  <p className="text-sm text-red-500">
                    {state.errors.password}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label>Choose your role</Label>
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant={
                      selectedRole === "employer" ? "default" : "outline"
                    }
                    className="w-[48%] py-6 flex items-center"
                    onClick={() => setSelectedRole("employer")}
                  >
                    <BriefcaseIcon className="h-6 w-6" />
                    <span>Employer</span>
                  </Button>
                  <Button
                    type="button"
                    variant={
                      selectedRole === "candidate" ? "default" : "outline"
                    }
                    className="w-[48%] py-6 flex items-center"
                    onClick={() => setSelectedRole("candidate")}
                  >
                    <UserIcon className="h-6 w-6" />
                    <span>Candidate</span>
                  </Button>
                </div>
                <input type="hidden" name="role" value={selectedRole || ""} />
                {state?.errors?.role && (
                  <p className="text-sm text-red-500">{state.errors.role}</p>
                )}
              </div>
              {state?.serverError && (
                <p className="text-sm text-red-500">{state.serverError}</p>
              )}
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-semibold text-gray-600 hover:underline"
        >
          Log in
        </a>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" className="w-full">
      {pending ? "Signing up..." : "Sign up"}
    </Button>
  );
}
