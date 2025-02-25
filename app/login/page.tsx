"use client";

import Image from "next/image";
import { LoginForm } from "./login-form";
import { login } from "@/api/auth/login";
import { useActionState, useEffect } from "react";
import Alerts from "@/components/customAlert";
import { CheckCircle, XCircle } from "lucide-react";
import useEmailVerification from "@/hooks/useEmailVerification";
import { getUserFromLocalStorage } from "@/utils/localStorage";

export default function LoginPage() {
  const [state, formAction] = useActionState(login, undefined);
  const { EmailVerificationModal, open, setOpen } = useEmailVerification(
    state?.user
  );

  useEffect(() => {
    const user = getUserFromLocalStorage();
    console.log("LocalStorage User:", user); // Debugging statement
    if (user && user.verifyEmail) {
      console.log("Opening email verification modal from local storage"); // Debugging statement
      setOpen(true);
    }
  }, [setOpen]);

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
        <LoginForm state={state} formAction={formAction} />
      </div>
      {open && <EmailVerificationModal />}
    </div>
  );
}
