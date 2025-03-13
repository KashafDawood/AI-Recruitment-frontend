"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { LoginForm } from "./login-form";
import { login } from "@/api/auth/login";
import useEmailVerification from "@/hooks/useEmailVerification";
import { getUserFromLocalStorage } from "@/app/_lib/localStorage";
import Link from "next/link";

export default function LoginPage() {
  const [state, formAction] = useActionState(login, undefined);
  const { EmailVerificationModal, open, setOpen, setStoredUser } =
    useEmailVerification(state?.user, state?.verifyEmail);
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    const user = getUserFromLocalStorage();
    if (!modalOpened) {
      if ((user && user.verifyEmail) || state?.verifyEmail) {
        setStoredUser(user || state?.user);
        setOpen(true);
        setModalOpened(true);
      }
    }
  }, [setOpen, modalOpened, state?.verifyEmail, setStoredUser, state?.user]);

  useEffect(() => {
    if (state?.message) {
      toast.success(state.message);
    }
    if (state?.serverError) {
      toast.error(state.serverError);
      if (state?.serverError.includes("verify your email")) {
        setStoredUser(state?.user);
        setOpen(true);
      }
    }
  }, [state, setOpen, setStoredUser, state?.user]);

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
        <LoginForm state={state} formAction={formAction} />
      </div>
      {open && <EmailVerificationModal />}
    </div>
  );
}
