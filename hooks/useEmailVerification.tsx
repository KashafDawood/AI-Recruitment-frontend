import { useState, useEffect } from "react";
import EmailVerificationDrawer from "@/components/custom/verifyEmailModel";

import {
  getUserFromLocalStorage,
  saveUserToLocalStorage,
  User,
} from "@/app/_lib/localStorage";

const useEmailVerification = (user: User | undefined) => {
  const [isOpen, setIsOpen] = useState(false);
  const [storedUser, setStoredUser] = useState<User | null>(null);

  useEffect(() => {
    const userFromStorage = getUserFromLocalStorage();
    setStoredUser(userFromStorage);
    if (userFromStorage && userFromStorage.verifyEmail) {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      saveUserToLocalStorage(user);
      setStoredUser(user);
      if (user.verifyEmail) {
        setIsOpen(true);
      }
    }
  }, [user]);

  const EmailVerificationModal = () =>
    storedUser ? (
      <EmailVerificationDrawer
        user={storedUser}
        open={isOpen}
        onOpenChange={setIsOpen}
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
