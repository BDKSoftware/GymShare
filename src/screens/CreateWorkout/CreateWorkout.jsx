import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  TouchableOpacity,
  FlatList,
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

//Data
import Months from "../../data/Months";
import ExerciseItem from "./components/ExerciseItem";
import CreateExerciseModal from "./components/CreateExerciseModal";
import ScanQR from "./components/ScanQR";

function CreateWorkout() {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [qrModal, setQrModal] = useState(false);
  const [user, setUser] = useState(null);
  const [gym, setGym] = useState("");

  function getTodaysDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    let monthName = Months[month - 1];
    return `${monthName} ${day}`;
  }

  function updateExercise(exercise) {
    let newExercises = exercises.map((item) => {
      if (item.id === exercise.id) {
        return exercise;
      } else {
        return item;
      }
    });
    setExercises(newExercises);
  }

  function addSet(exercise) {
    const newSets = [...exercise.sets];
    newSets.push({ reps: "", weight: "" });
    const newExercise = { ...exercise, sets: newSets };
    updateExercise(newExercise);
  }

  async function handleNavigation() {
    if (name === "") return alert("Please enter a workout name");

    if (exercises.length === 0) return alert("Please add an exercise");

    // set every empty set to 0
    let newExercises = exercises.map((exercise) => {
      exercise.sets.map((set) => {
        if (set.reps === "") {
          set.reps = 0;
        }
        if (set.weight === "") {
          set.weight = 0;
        }
        return set;
      });
      setExercises(newExercises);
    });

    let workout = {
      name: name,
      exercises: exercises,
      gym: gym,
    };

    navigation.navigate("StartWorkout", { workout: workout });
  }

  useEffect(() => {
    getUser(auth.currentUser.uid).then((user) => {
      setUser(user);
      setGym(user.homeGym.name);
    });
  }, []);

  useEffect(() => {
    console.log(exercises);
  }, [exercises]);

  return (
    <SafeAreaView
      style={theme === "light" ? styles.container : styles.darkContainer}
    >
      <AddExerciseModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        exercises={exercises}
        setExercises={setExercises}
        setAddModal={setAddModal}
        setQrModal={setQrModal}
      />
      <CreateExerciseModal
        modalVisible={addModal}
        setModalVisible={setAddModal}
        exercises={exercises}
        setExercises={setExercises}
      />

      <ScanQR
        modalVisible={qrModal}
        setModalVisible={setQrModal}
        exercises={exercises}
        setExercises={setExercises}
      />

      <View style={styles.topArea}>
        <Text style={styles.date}>{getTodaysDate()}</Text>

        <Pressable onPress={handleNavigation}>
          <Text style={styles.finishButton}>Finish</Text>
        </Pressable>
      </View>

      <View
        style={
          theme === "light" ? styles.workoutDetails : styles.workoutDetailsDark
        }
      >
        <TextInput
          style={theme === "light" ? styles.input : styles.inputDark}
          placeholder="Workout Name"
          value={name}
          onChangeText={(text) => setName(text)}
          placeholderTextColor={theme === "light" ? "grey" : "whitesmoke"}
        />
      </View>

      <Pressable
        style={
          theme === "light"
            ? styles.addExerciseButton
            : styles.addExerciseButtonDark
        }
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={
            theme === "light"
              ? styles.addExerciseText
              : styles.addExerciseTextDark
          }
        >
          Add Exercise
        </Text>
      </Pressable>

      <FlatList
        data={exercises}
        keyExtractor={(item, index) => index.toString()}
        style={{
          width: "100%",
          height: "60%",
        }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <ExerciseItem
              item={item}
              theme={theme}
              updateExercise={updateExercise}
              addSet={addSet}
            />
          );
        }}
      />
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

  darkContainer: {
    flex: 1,
    backgroundColor: colors.dark.background,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  topArea: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },

  date: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.light.accent,
  },

  finishButton: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.light.accent,
  },

  workoutDetails: {
    width: "95%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 20,
  },

  workoutDetailsDark: {
    width: "95%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#2c2f33",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    borderBottomColor: "black",
  },

  inputDark: {
    width: "100%",
    height: "40%",
    backgroundColor: "#2c2f33",
    borderRadius: 10,
    borderBottomColor: "black",
    color: "white",
  },

  gymName: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.light.accent,
  },

  addExerciseButton: {
    width: "95%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 20,
  },

  addExerciseButtonDark: {
    width: "95%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#2c2f33",
    marginBottom: 20,
  },

  addExerciseText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.light.accent,
  },

  addExerciseTextDark: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.dark.accent,
  },
});
