"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { User } from "@/api/auth/verifyEmail";
import useEmailVerification from "@/hooks/useEmailVerification";

interface EmailVerificationButtonProps {
  user: User;
}

const EmailVerificationButton: React.FC<EmailVerificationButtonProps> = ({ user }) => {
  const { EmailVerificationModal, open, setOpen } = useEmailVerification(user);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Verify Email</Button>
      {open && <EmailVerificationModal />}
    </>
  );
};

export default EmailVerificationButton;
