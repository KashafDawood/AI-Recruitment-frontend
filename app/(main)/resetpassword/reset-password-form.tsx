"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Alerts from "@/components/custom/Alerts";
import { resetPassword } from "@/api/auth/resetPassword";
import Link from "next/link";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, setState] = useState<{
      message?: string;
      error?: string;
      pending?: boolean;
    }>({});
    const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
    const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ pending: true, error: undefined, message: undefined });
    setPasswordError(undefined);
    const formData = new FormData(event.currentTarget);
    const newPassword = formData.get("new_password") as string;
    if (!newPassword || newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      setState({pending: false, error: "Invalid password"});
      return;
    }

    try{
      const result = await resetPassword(token, newPassword);
      if (result.success) {
        setState({ message: result.message, pending: false });
        if (passwordRef.current) passwordRef.current.value = ""; // Clear input field
      } else {
        if (result.errors?.new_password) {
          setState({
            error: result.errors.new_password[0] || "Invalid password",
            pending: false,
          });
        } else {
          setState({
            error:
              result.serverError || "Something went wrong. Please try again.",
            pending: false,
          });
        }
      }
    } catch {
      setState({ error: "Failed to reset password.", pending: false });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-100 p-6 md:p-10 dark:bg-zinc-800">
      {state.message && (
        <Alerts message={state.message} variant="success" Icon={CheckCircle} />
      )}
      {state.error && (
        <Alerts message={state.error} variant="destructive" Icon={XCircle}/>
      )}
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
            <Image src="/StaffeeLogo.svg" alt="Logo" width={15} height={15} />
          </div>
          Staffee.
        </Link>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Reset Password</CardTitle>
            <CardDescription>Enter your new password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <Input
                    id="new_password"
                    name="new_password"
                    type="password"
                    placeholder="Enter new password"
                    required
                    ref={passwordRef}
                  />
                </div>
                {passwordError && (
                  <p className="text-red-500">{passwordError}</p>
                )}
                <SubmitButton pending={state.pending} />
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
    </div>
  );
}


function SubmitButton({ pending }: { pending?: boolean }) {
  return (
    <Button disabled={pending} type="submit" className="w-full">
      {pending ? "Updating..." : "Reset Password"}
    </Button>
  );
}