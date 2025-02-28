"use client";

import Image from "next/image";
import { CheckCircle, XCircle } from "lucide-react";
import { ForgetPasswordForm } from "./forget-password-form";
import { forgetPassword } from "@/api/auth/forgetPassword";
import { useState, useRef } from "react";
import Alerts from "@/components/custom/Alerts";

export default function ForgetPasswordPage() {
  const [state, setState] = useState<{
    message?: string;
    error?: string;
    pending?: boolean;
  }>({});
  const emailRef = useRef<HTMLInputElement>(null); // Reference for email input

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    if (!email) {
      setState({ error: "Email is required" });
      return;
    }

    console.log("Form data before sending:", { email });

    setState({ pending: true, error: undefined, message: undefined }); // Disable button

    try {
      const result = await forgetPassword({ email });
      console.log("Forget password result:", result);

      if (result?.message) {
        setState({ message: result.message, pending: false });
        if (emailRef.current) emailRef.current.value = ""; // Clear input field
      } else {
        setState({
          error: "Something went wrong. Please try again.",
          pending: false,
        });
      }
    } catch (err) {
      console.error("Error:", err);
      setState({ error: "Failed to send reset email.", pending: false });
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-zinc-100 p-6 md:p-10 dark:bg-zinc-800">
      {state.message && (
        <Alerts message={state.message} variant="success" Icon={CheckCircle} />
      )}
      {state.error && (
        <Alerts message={state.error} variant="destructive" Icon={XCircle} />
      )}

      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
            <Image src="/StaffeeLogo.svg" alt="Logo" width={15} height={15} />
          </div>
          Staffee.
        </a>

        <ForgetPasswordForm
          handleSubmit={handleSubmit}
          state={state}
          emailRef={emailRef}
        />
      </div>
    </div>
  );
}
