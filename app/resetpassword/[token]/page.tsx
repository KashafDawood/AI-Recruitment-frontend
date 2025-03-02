"use client";

import { useParams } from "next/navigation";
import ResetPasswordForm from "../reset-password-form";

export default function ResetPasswordPage() {
  const params = useParams();
  const { token } = params;

  if (!token) {
    return <div>Invalid token</div>;
  }

  return <ResetPasswordForm token={token} />;
}
