"use client";

import Image from "next/image";
import { useActionState } from "react";
import Alerts from "@/components/customAlert";
import { CheckCircle, XCircle } from "lucide-react";
import { ForgetPasswordForm } from "./forget-password-form";
import { forgetPassword } from "@/api/auth/forgetPassword";
import { startTransition } from "react";

export default function ForgetPasswordPage() {
  const [state, formAction] = useActionState(forgetPassword, undefined);


const handleFormAction = async (formData: FormData) => {
  if (!formData) {
    console.error("FormData is undefined");
    return;
  }

  // Convert FormData to an object
  const formObject = Object.fromEntries(formData.entries()); 
  console.log("In page before sending:", formObject);

  const result = await forgetPassword(formObject);
  console.log("Forget password result:", result);

  // ✅ Wrap the state update inside startTransition to avoid React errors
  startTransition(() => {
    formAction(result);
  });
};

  
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget); // Ensure correct FormData
    console.log("Form data before sending:", Object.fromEntries(formData.entries()));
  
    formAction(formData);
  };
  
   

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
        <ForgetPasswordForm state={state} formAction={handleFormAction} />
      </div>
    </div>
  );
}
