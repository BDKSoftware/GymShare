import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function logIn(user) {
    setIsLoggedIn(true);
    setUser(user);
    AsyncStorage.setItem("user", JSON.stringify(user));
  }

  function logOut() {
    setIsLoggedIn(false);
    setUser(null);
    AsyncStorage.removeItem("user");
    signOut(auth);
  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        logIn(user);
      } else {
        logOut();
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoggedIn, setIsLoggedIn, logIn, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
