export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  verifyEmail?: boolean;
}

const USER_STORAGE_KEY = "user";
const USER_TIMESTAMP_KEY = "user_timestamp";
const EXPIRATION_DAYS = 3;

export const saveUserToLocalStorage = (user: User) => {
  const timestamp = new Date().getTime();
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  localStorage.setItem(USER_TIMESTAMP_KEY, timestamp.toString());
};

export const getUserFromLocalStorage = (): User | null => {
  const user = localStorage.getItem(USER_STORAGE_KEY);
  const timestamp = localStorage.getItem(USER_TIMESTAMP_KEY);

  if (user && timestamp) {
    const currentTime = new Date().getTime();
    const storedTime = parseInt(timestamp, 10);
    const expirationTime = EXPIRATION_DAYS * 24 * 60 * 60 * 1000;

    if (currentTime - storedTime > expirationTime) {
      removeUserFromLocalStorage();
      return null;
    }

    return JSON.parse(user);
  }

  return null;
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(USER_TIMESTAMP_KEY);
};
