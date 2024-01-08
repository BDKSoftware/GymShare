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
import AsyncStorage from "@react-native-async-storage/async-storage";

function AuthLoading() {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);

  async function checkIfUserIsLoggedIn() {
    const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");

    if (JSON.parse(isLoggedIn) === false) {
      navigation.navigate("Login");
      return;
    }
    navigation.navigate("Root");
    return;
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
      <Text>Loading...</Text>
    </SafeAreaView>
  );
}

export default AuthLoading;

const styles = StyleSheet.create({
  darkContainer: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },

  lightContainer: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
});
