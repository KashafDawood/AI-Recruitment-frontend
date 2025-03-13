import { useState, useEffect } from "react";
import EmailVerificationDrawer from "@/components/custom/verifyEmailModel";
import { User } from "@/types/user";
import { getUserFromLocalStorage } from "@/app/_lib/localStorage";

const useEmailVerification = (user: User | undefined, verifyEmail: boolean | undefined) => {
  const [isOpen, setIsOpen] = useState(false);
  const [storedUser, setStoredUser] = useState<User | null>(null);

  useEffect(() => {
    const userFromStorage = getUserFromLocalStorage();
    if (userFromStorage && userFromStorage.verifyEmail) {
      setStoredUser(userFromStorage);
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (user && user.verifyEmail) {
      setStoredUser(user);
      setIsOpen(true);
    }
  }, [user]);

  useEffect(() => {
    if (user && verifyEmail) {
      setStoredUser(user);
      setIsOpen(true);
    }
  }, [verifyEmail, user]);

  const EmailVerificationModal = () =>
    storedUser ? (
      <EmailVerificationDrawer
        user={storedUser}
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
        }}
      />
    ) : null;

  return {
    EmailVerificationModal,
    open: isOpen,
    setOpen: setIsOpen,
    setStoredUser,
  };
};

export default useEmailVerification;
