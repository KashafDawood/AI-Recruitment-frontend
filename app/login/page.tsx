"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { LoginForm } from "./login-form";
import { login } from "@/api/auth/login";
import useEmailVerification from "@/hooks/useEmailVerification";
import { getUserFromLocalStorage } from "@/app/_lib/localStorage";
import Alerts from "@/components/custom/Alerts";
import Link from "next/link";

export default function LoginPage() {
  const [state, formAction] = useActionState(login, undefined);
  const { EmailVerificationModal, open, setOpen } = useEmailVerification(
    state?.user
  );
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    const user = getUserFromLocalStorage();
    if (!modalOpened) {
      if (user && user.verifyEmail) {
        setOpen(true);
        setModalOpened(true);
      } else if (
        state?.serverError &&
        state?.serverError.includes("verify your email")
      ) {
        setOpen(true);
        setModalOpened(true);
      }
    }
  }, [
    state?.serverError,
    setOpen,
    modalOpened,
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
        <LoginForm state={state} formAction={formAction} />
      </div>
      {open && <EmailVerificationModal />}
    </div>
  );
}
