import React from "react";
import { View, Text, StyleSheet, Pressable, SafeAreaView } from "react-native";

import colors from "../../../theme";
import { useSelector } from "react-redux";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

function EndWorkout(props) {
  const { workout, id } = props.route.params;
  const theme = useSelector((state) => state.theme.value);
  const navigation = useNavigation();

  const finishHandler = () => {
    navigation.navigate("HomeScreen");
  };

  //get current date
  const date = new Date();

  //get current date in format: mm/dd/yyyy
  const currentDate = `${Months[date.getMonth()]} ${
    date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  }`;

  return (
    <SafeAreaView
      style={theme === "light" ? styles.container : styles.darkContainer}
    >
      <View style={styles.topArea}>
        <Text style={styles.headerText}>{currentDate}</Text>

        <Pressable onPress={finishHandler}>
          <Text style={styles.finish}>Finish</Text>
        </Pressable>
      </View>
      <View style={styles.iconContainer}>
        <View style={styles.circle}>
          <Ionicons name="checkmark" size={25} color="white" />
        </View>
      </View>
      <Text style={styles.text}>Workout Completed!</Text>
      <View style={styles.dataContainer}></View>
    </SafeAreaView>
  );
}

export default EndWorkout;

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

  text: {
    fontSize: 20,
    color: colors.dark.accent,
    fontWeight: "500",
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

  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    height: "10%",
    width: "100%",
  },

  circle: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: colors.light.accent,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  topArea: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 20,
  },

  headerText: {
    fontSize: 16,
    fontWeight: "500",
  },

  finish: {
    fontSize: 16,
    fontWeight: "600",
    color: "red",
  },

  dataContainer: {
    height: "50%",
    width: "100%",
    borderColor: "red",
    borderWidth: 1,
  },
});
