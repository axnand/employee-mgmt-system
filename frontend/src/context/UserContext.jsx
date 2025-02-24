"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context with default values.
const UserContext = createContext({
  user: null,
  userRole: "",
  setUser: () => {},
  setUserRole: () => {},
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("");

  // Retrieve the logged-in user from localStorage when the component mounts.
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserRole(parsedUser.role || "");
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, userRole, setUser, setUserRole }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the UserContext in any component.
export function useUser() {
  return useContext(UserContext);
}
