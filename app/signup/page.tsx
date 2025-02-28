"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import Alerts from "@/components/custom/Alerts";
import { CheckCircle, XCircle } from "lucide-react";
import { SignupForm } from "./signup-form";
import { signup } from "@/api/auth/signup";
import useEmailVerification from "@/hooks/useEmailVerification";
import Link from "next/link";
import { getUserFromLocalStorage } from "@/app/_lib/localStorage";
import EmailVerificationButton from "@/components/EmailVerificationButton";
import { User } from "@/api/auth/verifyEmail";

export default function SignupPage() {
  const [state, formAction] = useActionState(signup, undefined);
  const { EmailVerificationModal, open, setOpen } = useEmailVerification(
    state?.user
  );
  const [unverifiedUser, setUnverifiedUser] = useState<User | null>(null);

  useEffect(() => {
    const user = getUserFromLocalStorage();
    if (user && user.verifyEmail) {
      setOpen(true);
    }
  }, [setOpen]);

  useEffect(() => {
    if (state?.message && state?.user) {
      setOpen(true);
    }
    if (
      state?.serverError &&
      state?.serverError.includes("verify your email")
    ) {
      setUnverifiedUser(state.user);
    }
    if (state?.verifyEmail) {
      setOpen(true);
    }
  }, [
    state?.user,
    state?.message,
    state?.serverError,
    state?.verifyEmail,
    setOpen,
  ]);

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
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
            <Image src={"/StaffeeLogo.svg"} alt="Logo" width={15} height={15} />
          </div>
          Staffee.
        </Link>
        <SignupForm state={state} formAction={formAction} />
        {unverifiedUser && <EmailVerificationButton user={unverifiedUser} />}
      </div>
      {open && <EmailVerificationModal />}
    </div>
  );
}
