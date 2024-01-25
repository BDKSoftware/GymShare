import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";

import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import colors from "../../../theme";

function StartWorkout(props) {
  const theme = useSelector((state) => state.theme.value);
  console.log(props.route.params.workout);
  return (
    <SafeAreaView
      style={theme === "light" ? styles.container : styles.darkContainer}
    >
      <Text style={{ color: "#fff" }}>Start Workout</Text>
    </SafeAreaView>
  );
}

export default StartWorkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  darkContainer: {
    flex: 1,
    backgroundColor: colors.dark.background,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
