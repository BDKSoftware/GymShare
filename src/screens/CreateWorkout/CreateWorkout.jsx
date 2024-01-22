import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
// Hooks
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

//Colors
import colors from "../../../theme";

//Components
import AddExerciseModal from "./components/AddExerciseModal";

//Icons
import { Feather, Ionicons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";

//Functions
import getUser from "../../utils/getUser";

import { auth } from "../../../firebase";

function CreateWorkout() {
  const theme = useSelector((state) => state.theme.value);
  const [workoutName, setWorkoutName] = useState("");
  const [gym, setGym] = useState("");
  const [exercises, setExercises] = useState([]);
  const [isVisable, setIsVisable] = useState(false);
  const navigation = useNavigation();

  function goBack() {
    navigation.goBack();
  }

  useEffect(() => {
    if (exercises.length > 0) {
      console.log(exercises.sets);
    }
  }, [exercises]);

  function removeExercise(id) {
    const newExercises = exercises.filter((exercise) => exercise.id !== id);
    setExercises(newExercises);
  }

  async function getData() {
    const user = await getUser(auth.currentUser.uid);
    setGym(user.homeGym.name);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView
      style={theme === "light" ? styles.container : styles.darkContainer}
    >
      <AddExerciseModal
        modalVisible={isVisable}
        setModalVisible={setIsVisable}
        exercises={exercises}
        setExercises={setExercises}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        <View style={styles.goBackContainer}>
          <Pressable onPress={goBack}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme === "light" ? "#000" : colors.dark.accent}
            />
          </Pressable>
        </View>
        <TextInput
          placeholder="Enter Gym Name"
          value={gym}
          onChangeText={(value) => {
            setGym(value);
          }}
          style={theme === "light" ? styles.input : styles.inputDark}
          placeholderTextColor={theme === "light" ? "#000" : colors.dark.accent}
        />
        <TextInput
          placeholder="Enter Workout Name"
          value={workoutName}
          onChangeText={(value) => {
            setWorkoutName(value);
          }}
          style={theme === "light" ? styles.input : styles.inputDark}
          placeholderTextColor={theme === "light" ? "#000" : colors.dark.accent}
        />

        <TouchableOpacity
          style={styles.addExerciseButton}
          onPress={() => {
            setIsVisable(true);
          }}
        >
          <Foundation name="plus" size={16} color="white" />
          <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
        </TouchableOpacity>
        <Text
          style={
            theme === "light"
              ? styles.exercisesTitle
              : styles.exercisesTitleDark
          }
        >
          Exercises:{" "}
        </Text>
        <View style={styles.exerciseTable}>
          {exercises.map((exercise, index) => {
            return (
              <View
                key={index}
                style={
                  theme === "light"
                    ? styles.exerciseContainer
                    : styles.exerciseContainerDark
                }
              >
                <View style={styles.containerLeft}>
                  <Text
                    numberOfLines={1}
                    style={
                      theme === "light"
                        ? styles.exerciseName
                        : styles.exerciseNameDark
                    }
                  >
                    {exercise.name}
                  </Text>
                </View>
                <View style={styles.containerMiddle}>
                  <Text
                    style={
                      theme === "light"
                        ? styles.exerciseName
                        : styles.exerciseNameDark
                    }
                  >
                    {exercise.sets.length < 2
                      ? "1 Set"
                      : `${exercise.sets.length} Sets`}
                  </Text>
                </View>
                <View style={styles.containerRight}>
                  <Pressable onPress={() => removeExercise(exercise.id)}>
                    <Feather name="x-circle" size={20} color="red" />
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
        <TouchableOpacity style={styles.startExerciseButton}>
          <Text style={styles.startExerciseButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export default CreateWorkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  goBackContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    height: "5%",
    width: "100%",
    padding: 10,
  },

  darkContainer: {
    flex: 1,
    backgroundColor: colors.dark.background,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  scroll: {
    width: "100%",
    height: "100%",
  },

  input: {
    height: 40,
    margin: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    padding: 10,
    width: "90%",
    color: "#000",
  },

  inputDark: {
    height: 40,
    margin: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.accent,
    padding: 10,
    width: "90%",
    color: "#fff",
  },

  addExerciseButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 40,
    width: "40%",
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: colors.light.accent,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginLeft: 20,
  },

  addExerciseButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "500",
  },

  exercisesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    alignSelf: "flex-start",
    marginLeft: 20,
    color: colors.dark.background,
  },

  exercisesTitleDark: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    alignSelf: "flex-start",
    marginLeft: 20,
    color: "#fff",
  },

  exerciseTable: {
    width: "100%",
    height: "auto",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20,
  },

  exerciseContainer: {
    width: "90%",
    height: 50,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  exerciseContainerDark: {
    width: "90%",
    height: 50,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    backgroundColor: "#2c2f33",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  exerciseName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },

  exerciseNameDark: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },

  setsContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "column",
  },

  setContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginLeft: 10,
  },

  setText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },

  setTextDark: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },

  containerLeft: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "50%",
    height: "100%",
  },

  containerMiddle: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "25%",
    height: "100%",
  },

  containerRight: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    flexDirection: "column",
    width: "25%",
    height: "100%",
  },

  startExerciseButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 40,
    width: "80%",
    paddingHorizontal: 15,
    backgroundColor: colors.light.accent,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 20,
  },

  startExerciseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
