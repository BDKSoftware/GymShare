import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import colors from "../../../theme";

function Home() {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();

  return (
    <View
      style={theme === "light" ? styles.lightContainer : styles.darkContainer}
    >
      <Text>Home</Text>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  lightContainer: {
    flex: 1,
    backgroundColor: colors.light.background,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  darkContainer: {
    flex: 1,
    backgroundColor: colors.dark.background,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
