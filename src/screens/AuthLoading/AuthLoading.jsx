import React, { useEffect } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
} from "react-native";
import colors from "../../../theme";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { auth } from "../../../firebase";

function AuthLoading() {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);

  function checkIfUserIsLoggedIn() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("Root");
      } else {
        navigation.navigate("Login");
      }
    });
  }

  useEffect(() => {
    checkIfUserIsLoggedIn();
    return () => {};
  }, []);

  return (
    <SafeAreaView
      style={theme === "light" ? styles.lightContainer : styles.darkContainer}
    >
      <ActivityIndicator size="large" color={colors.dark.accent} />
    </SafeAreaView>
  );
}

export default AuthLoading;

const styles = StyleSheet.create({
  darkContainer: {
    flex: 1,
    backgroundColor: colors.dark.background,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  lightContainer: {
    flex: 1,
    backgroundColor: colors.light.background,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
