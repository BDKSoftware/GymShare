import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import colors from "../../../theme";
import { useSelector } from "react-redux";

function EndWorkout(props) {
  const { workout, id } = props.route.params;
  const theme = useSelector((state) => state.theme.value);

  console.log("Workout: ", workout);

  return (
    <SafeAreaView
      style={theme === "light" ? styles.container : styles.darkContainer}
    >
      <Text style={styles.text}>Workout Completed</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("WorkoutDetails", { id: id });
        }}
      >
        <Text style={styles.buttonText}>View Workout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default EndWorkout;

const styles = StyleSheet.create({
  container: {
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
    justifyContent: "flex-start",
    alignItems: "center",
  },

  text: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },

  button: {
    width: "80%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light.accent,
    borderRadius: 10,
    marginTop: 20,
  },

  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    padding: 10,
  },
});
