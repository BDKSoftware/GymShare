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
import { Ionicons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";

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
      console.log(exercises);
    }
  }, [exercises]);

  function removeExercise(id) {
    const newExercises = exercises.filter((exercise) => exercise.id !== id);
    setExercises(newExercises);
  }

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
          theme === "light" ? styles.exercisesTitle : styles.exercisesTitleDark
        }
      >
        Exercises:{" "}
      </Text>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "flex-start",
          paddingBottom: 100,
        }}
        style={styles.exerciseTable}
      >
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
                  style={
                    theme === "light"
                      ? styles.exerciseName
                      : styles.exerciseNameDark
                  }
                >
                  {exercise.name}
                </Text>
                <View style={styles.setsContainer}>
                  <Text
                    style={
                      theme === "light" ? styles.setText : styles.setTextDark
                    }
                  >{`${exercise.sets.length} sets`}</Text>
                  <Text
                    style={
                      theme === "light" ? styles.setText : styles.setTextDark
                    }
                  >
                    TODO: ADD MORE DATA
                  </Text>
                </View>
              </View>
              <View style={styles.containerRight}>
                <Pressable onPress={() => removeExercise(exercise.id)}>
                  <Ionicons name="trash" size={24} color="red" />
                </Pressable>
              </View>
            </View>
          );
        })}
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
    height: "50%",
    display: "flex",

    marginTop: 20,
  },

  exerciseContainer: {
    width: "90%",
    height: 100,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    backgroundColor: colors.dark.background,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  exerciseContainerDark: {
    width: "90%",
    height: 100,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    backgroundColor: colors.light.background,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  exerciseName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },

  exerciseNameDark: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
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
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },

  setTextDark: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  containerLeft: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "column",
    width: "80%",
  },

  containerRight: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "20%",
    height: "100%",
  },
});
