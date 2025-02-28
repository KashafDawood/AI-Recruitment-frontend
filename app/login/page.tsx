"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import Alerts from "@/components/customAlert";
import { CheckCircle, XCircle } from "lucide-react";
import { LoginForm } from "./login-form";
import { login } from "@/api/auth/login";
import useEmailVerification from "@/hooks/useEmailVerification";
import { getUserFromLocalStorage } from "@/utils/localStorage";
import EmailVerificationButton from "@/components/EmailVerificationButton"; // Import EmailVerificationButton
import { User } from "@/types"; // Import User type

export default function LoginPage() {
  const [state, formAction] = useActionState(login, undefined);
  const { EmailVerificationModal, open, setOpen } = useEmailVerification(
    state?.user
  );
  const [unverifiedUser, setUnverifiedUser] = useState<User | null>(null);

  useEffect(() => {
    const user = getUserFromLocalStorage();
    console.log("LocalStorage User:", user); // Debugging statement
    if (user && user.verifyEmail) {
      console.log("Opening email verification modal from local storage"); // Debugging statement
      setOpen(true);
    }
  }, [setOpen]);

  useEffect(() => {
    if (state?.message && state?.user) {
      console.log("Opening email verification modal from state"); // Debugging statement
      setOpen(true);
    }
    if (state?.serverError && state?.serverError.includes("verify your email")) {
      setUnverifiedUser(state.user);
    }
    if (state?.verifyEmail) {
      console.log("Opening email verification modal due to verifyEmail flag"); // Debugging statement
      setOpen(true);
    }
  }, [state?.user, state?.message, state?.serverError, state?.verifyEmail, setOpen]);

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
        {unverifiedUser && <EmailVerificationButton user={unverifiedUser} />}
      </div>
      {open && <EmailVerificationModal />}
    </div>
  );
}
