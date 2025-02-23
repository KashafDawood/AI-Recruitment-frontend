"use client";

import Image from "next/image";
import { useActionState } from "react";
import Alerts from "@/components/customAlert";
import { CheckCircle, XCircle } from "lucide-react";
import { SignupForm } from "./signup-form";
import { signup } from "@/api/auth/signup";

export default function LoginPage() {
  const [state, formAction] = useActionState(signup, undefined);
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-zinc-100 p-6 md:p-10 dark:bg-zinc-800">
      {state?.message && (
        <Alerts
          message={state?.message}
          variant={"success"}
          Icon={CheckCircle}
        />
      )}
      {state?.serverError && (
        <Alerts
          message={state?.serverError}
          variant={"destructive"}
          Icon={XCircle}
        />
      )}
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
            <Image src={"/StaffeeLogo.svg"} alt="Logo" width={15} height={15} />
          </div>
          Stafee.
        </a>
        <SignupForm state={state} formAction={formAction} />
      </div>
    </div>
  );
}
