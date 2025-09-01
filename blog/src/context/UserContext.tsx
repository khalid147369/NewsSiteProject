import React, { createContext, useContext, useEffect, useState } from "react";
import { logout as logoutServer } from "../api/user";
import type { IUser } from "../utils/types";
import { useGetAlluserReducer } from "../reducer/userReducers/userReducer";

type UserContextType = {
  user: {
    data: IUser;
    set: React.Dispatch<React.SetStateAction<IUser>>;
    logout: () => void;
    login: (email: string, password: string) => Promise<any>;
    isLoggedIn?: boolean;
    isAdmin?: boolean;
  };
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { logIn, user: userFromApi } = useGetAlluserReducer();

  const [user, setUser] = useState<IUser>(userFromApi);

  useEffect(() => {
    // Load user data from localStorage or any other source if needed
    localStorage.setItem("role", user.user.role || "");
    setUser(userFromApi);
  }, [userFromApi]); // Retrieve role from localStorage

  const logout = () => {
    setUser({ user: { username: "", email: "", role: null }, accessToken: "" }),
      logoutServer(),
      localStorage.clear();
  };
  const isLoggedIn =
    user?.accessToken && user?.user?.username && user?.user?.email
      ? true
      : false;
  const isAdmin = user.user?.role === "admin";
  const value = {
    user: {
      data: user,
      set: setUser,
      logout,
      login: logIn,
      isLoggedIn,
      isAdmin,
    },
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
