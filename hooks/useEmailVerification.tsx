import { useState, useEffect } from "react";
import EmailVerificationDrawer from "@/components/custom/verifyEmailModel";
import { User } from "@/api/auth/verifyEmail";

const useEmailVerification = (user: User | undefined) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setOpen(true);
    }
  }, [user]);

  const EmailVerificationModal = () =>
    user ? (
      <EmailVerificationDrawer user={user} open={open} onOpenChange={setOpen} />
    ) : null;

  return { EmailVerificationModal, open, setOpen };
};

export default useEmailVerification;
