import { useState, useEffect } from "react";
import EmailVerificationDrawer from "@/components/verifyEmailModel";
import { User } from "@/api/auth/verifyEmail";
import { getUserFromLocalStorage, saveUserToLocalStorage } from "@/utils/localStorage";

const useEmailVerification = (user: User | undefined) => {
  const [open, setOpen] = useState(false);
  const [storedUser, setStoredUser] = useState<User | null>(null);

  useEffect(() => {
    const userFromStorage = getUserFromLocalStorage();
    console.log("Stored User:", userFromStorage); // Debugging statement
    setStoredUser(userFromStorage);
    if (userFromStorage && userFromStorage.verifyEmail) {
      console.log("Opening email verification modal from local storage"); // Debugging statement
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    console.log("User:", user); // Debugging statement
    if (user) {
      saveUserToLocalStorage(user);
      setStoredUser(user);
      if (user.verifyEmail) {
        console.log("Opening email verification modal"); // Debugging statement
        setOpen(true);
      }
    }
  }, [user]);

  const EmailVerificationModal = () =>
    storedUser ? (
      <EmailVerificationDrawer user={storedUser} open={open} onOpenChange={setOpen} />
    ) : null;

  return { EmailVerificationModal, open, setOpen };
};

export default useEmailVerification;
