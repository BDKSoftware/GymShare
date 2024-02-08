import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Touchable,
  TouchableOpacity,
} from "react-native";

import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import colors from "../../../theme";

import ExerciseDropdown from "./components/ExerciseDropdown";
import EndWorkoutButton from "./components/EndWorkoutButton";
import { auth, db } from "../../../firebase";
import { addDoc, doc, collection, updateDoc } from "firebase/firestore";

function StartWorkout(props) {
  const theme = useSelector((state) => state.theme.value);
  const startTime = Date.now();
  const navigation = useNavigation();

  const { gym, exercises, name } = props.route.params.workout;

  console.log("Gym: ", gym);
  console.log("Exercises: ", exercises);

  function finishWorkout() {
    console.log("Workout Finished");
    let workout = {
      gym: gym,
      name: name,
      exercises: exercises,
      duration: Date.now() - startTime,
      creator: auth.currentUser.uid,
      id: "",
      photo: "",
    };

    let workoutRef = collection(db, "workouts");

    addDoc(workoutRef, workout).then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      updateDoc(docRef, { id: docRef.id });
      navigation.navigate("EndWorkout", {
        workout: workout,
        id: docRef.id,
      });
    });
  }

  return (
    <SafeAreaView
      style={theme === "light" ? styles.container : styles.darkContainer}
    >
      <View style={styles.infoContainer}>
        <Text
          style={theme === "light" ? styles.infoText : styles.infoTextDark}
        >{`Location: ${gym}`}</Text>
        <Text
          style={theme === "light" ? styles.infoText : styles.infoTextDark}
        >{`Workout Name: ${name}`}</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={theme === "light" ? styles.title : styles.titleDark}>
          Exercises:{" "}
        </Text>
      </View>
      <View style={{ height: "65%", width: "100%" }}>
        <ScrollView
          contentContainerStyle={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 50,
          }}
          style={styles.scroll}
        >
          {exercises.map((exercise, index) => {
            return <ExerciseDropdown key={index} exercise={exercise} />;
          })}
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <EndWorkoutButton onPress={finishWorkout} />
      </View>
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

  infoContainer: {
    width: "100%",
    height: 100,

    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
  },

  infoTextDark: {
    color: "white",
    padding: 10,
    fontWeight: "500",
    fontSize: 16,
  },

  infoText: {
    color: "black",
    padding: 10,
    fontWeight: "500",
    fontSize: 16,
  },

  titleContainer: {
    width: "100%",
    height: 40,
    display: "flex",
    justifyContent: "flex-end",
  },

  title: {
    fontSize: 20,

    color: "black",
    padding: 10,
  },

  titleDark: {
    fontSize: 20,

    color: "white",
    padding: 10,
  },

  scroll: {
    width: "100%",

    height: 50,
  },

  buttonContainer: {
    width: "100%",
    height: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
