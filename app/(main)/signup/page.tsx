"use client";
import { toast } from "sonner";
import Image from "next/image";
import { useActionState, useEffect } from "react";
import { SignupForm } from "./signup-form";
import { signup } from "@/api/auth/signup";
import useEmailVerification from "@/hooks/useEmailVerification";
import Link from "next/link";
import { getUserFromLocalStorage } from "@/app/_lib/localStorage";

export default function SignupPage() {
  const [state, formAction] = useActionState(signup, undefined);
  const { EmailVerificationModal, open, setOpen } = useEmailVerification(
    state?.user,
    state?.user?.verifyEmail
  );

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
      setOpen(true);
    }
  }, [state?.user, state?.message, state?.serverError, setOpen]);

  useEffect(() => {
    if (state?.message) {
      toast.success(state.message);
    }
    if (state?.serverError) {
      toast.error(state.serverError);
    }
  }, [state?.message, state?.serverError]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-zinc-100 p-6 md:p-10 dark:bg-zinc-800">
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
      </div>
      {open && <EmailVerificationModal />}
    </div>
  );
}
