import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Animated,
  Pressable,
  Alert,
  Modal,
} from "react-native";

import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import colors from "../../../theme";
import { auth, db } from "../../../firebase";
import { addDoc, doc, collection, updateDoc } from "firebase/firestore";
import { Swipeable } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import Months from "../../data/Months";

import ViewExerciseModal from "./components/ViewExerciseModal";
import ChangeExerciseModal from "./components/ChangeExerciseModal";
import getUser from "../../utils/getUser";

function StartWorkout(props) {
  const theme = useSelector((state) => state.theme.value);
  const startTime = Date.now();
  const navigation = useNavigation();
  const [exerciseList, setExerciseList] = useState(
    props.route.params.workout.exercises
  );
  const [changeModalVisible, setChangeModalVisible] = useState(false);
  const [selectExerciseModal, setSelectExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(
    props.route.params.workout.exercises[0]
  );
  const [time, setTime] = useState(0);
  const startTimeRef = useRef(0);

  const { gym, name } = props.route.params.workout;

  function getStartTime() {
    //Get Start time of when the screen mounts in format "Month Day, at Time"
    let date = new Date();
    let month = date.getMonth();
    month = Months[month];
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    let minutesString = minutes < 10 ? "0" + minutes : minutes;
    let strTime =
      month + " " + day + ", at " + hours + ":" + minutesString + " " + ampm;
    return strTime;
  }

  function onDiscardPress() {
    Alert.alert("Are you sure you want to discard this workout?", "", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Discard",
        onPress: () => {
          navigation.navigate("HomeScreen");
        },
      },
    ]);
  }

  async function updateStreak() {
    let today = new Date();
    let yesterday = new Date(today - 86400000);

    let userRef = doc(db, "users", auth.currentUser.uid);
    let user = await getUser(auth.currentUser.uid);

    let lastWorkout = new Date(user.lastWorkout);

    // If 2 workouts happen on same day, streak does not increase
    if (lastWorkout.getDate() == today.getDate()) {
      return;
    }

    // If the last workout date is behind yesterday, reset streak to 1
    if (lastWorkout.getDate() < yesterday.getDate()) {
      await updateDoc(userRef, {
        streak: 1,
        lastWorkout: today.toDateString(),
      });
      return;
    }

    // If other conditions are not met, iterate the streak and change lastWorkout date
    await updateDoc(userRef, {
      streak: user.streak + 1,
      lastWorkout: today.toDateString(),
    }).then(() => console.log("Streak Updated"));
  }

  async function finishWorkout() {
    console.log("Workout Finished");

    let workout = {
      gym: gym,
      name: name,
      exercises: exerciseList,
      duration: time,
      creator: auth.currentUser.uid,
      id: "",
      photo: "",
      date: Date.now(),
    };

    let workoutRef = collection(db, "workouts");

    await addDoc(workoutRef, workout).then(async (docRef) => {
      console.log("Document written with ID: ", docRef.id);
      await updateDoc(docRef, { id: docRef.id });
      navigation.navigate("EndWorkout", {
        workout: workout,
        id: docRef.id,
      });
      updateStreak();
    });
  }

  function removeExercise(exercise) {
    Alert.alert("Are you sure you want to delete this exercise?", "", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          let newExercises = exerciseList.filter(
            (item) => item.name !== exercise.name
          );

          setExerciseList(newExercises);
        },
      },
    ]);
  }

  function Timer() {
    // const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef(null);
    // const startTimeRef = useRef(0);

    useEffect(() => {
      startTimeRef.current = Date.now() - time * 1000;
      intervalRef.current = setInterval(() => {
        setTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
      setRunning(true);
    });

    let minutes = time / 60;
    let seconds = time % 60;

    function padNumber(number) {
      return (number < 10 ? "0" : "") + number;
    }

    return (
      <Text
        style={theme === "light" ? styles.timerText : styles.timerTextDark}
      >{`${padNumber(Math.floor(minutes))}:${padNumber(seconds)}`}</Text>
    );
  }

  const renderItem = ({ item }) => {
    //Close swipeable on modal open

    return (
      <View
        style={
          theme === "light"
            ? styles.renderItemContainer
            : styles.renderItemContainerDark
        }
      >
        <View>
          <Text
            style={theme === "light" ? { color: "black" } : { color: "white" }}
          >
            {item.name}
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: 60,
          }}
        >
          <Pressable
            onPress={() => {
              setSelectedExercise(item);
              setChangeModalVisible(true);
            }}
          >
            <MaterialCommunityIcons
              name="find-replace"
              size={20}
              color={theme === "light" ? "black" : "white"}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              setSelectedExercise(item);
              setSelectExerciseModal(true);
            }}
          >
            <MaterialCommunityIcons
              name="view-headline"
              size={20}
              color={theme === "light" ? "black" : "white"}
            />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={theme === "light" ? styles.container : styles.darkContainer}
    >
      <ViewExerciseModal
        exercise={selectedExercise}
        modalVisible={selectExerciseModal}
        setModalVisible={setSelectExerciseModal}
        theme={theme}
        setChangeModalVisible={setChangeModalVisible}
      />

      <ChangeExerciseModal
        modalVisible={changeModalVisible}
        setModalVisible={setChangeModalVisible}
        exercises={exerciseList}
        setExercises={setExerciseList}
        selectedExercise={selectedExercise}
      />

      <View style={styles.header}>
        <Text
          style={theme == "light" ? styles.headerText : styles.headerTextDark}
        >
          {name}
        </Text>
        <Pressable
          style={styles.discardButtonContainer}
          onPress={() => {
            onDiscardPress();
          }}
        >
          <Text style={styles.headerButtonDiscard}>Discard</Text>
        </Pressable>
      </View>

      <View
        style={
          theme === "light"
            ? styles.workoutDataContainer
            : styles.workoutDataContainerDark
        }
      >
        <Timer />
      </View>
      <Pressable style={styles.endWorkoutButton} onPress={finishWorkout}>
        <Text style={styles.endWorkoutButtonText}>End Workout</Text>
      </Pressable>
      <View style={{ width: "95%", height: "70%" }}>
        <FlatList
          data={exerciseList}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.name + index}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
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

  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 50,
    padding: 10,
  },

  title: {
    color: "black",
    fontWeight: "500",
    fontSize: 15,
  },

  titleDark: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },

  headerButton: {
    color: colors.light.accent,
    fontWeight: "700",
  },

  headerButtonDiscard: {
    color: "red",
    fontWeight: "600",
  },

  discardButtonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "20%",
  },

  finishButtonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "20%",
  },

  workoutDataContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    height: 80,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 10,
  },

  workoutDataContainerDark: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    height: 80,
    backgroundColor: "#2c2f33",
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 10,
  },

  workoutData: {
    color: "black",
    fontSize: 15,
    paddingLeft: 5,
  },

  workoutDataDark: {
    color: "white",
    fontSize: 15,
    paddingLeft: 5,
  },

  line: {
    width: "98%",
    height: 0.5,
    backgroundColor: "lightgrey",
    alignSelf: "center",
  },

  lineDark: {
    width: "100%",
    height: 0.5,
    backgroundColor: "whitesmoke",
  },

  renderItemContainer: {
    width: "100%",
    height: 60,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    flexDirection: "row",
    paddingHorizontal: 20,
  },

  renderItemContainerDark: {
    width: "100%",
    height: 60,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#2c2f33",
    borderRadius: 10,
    flexDirection: "row",
    paddingHorizontal: 20,
  },

  rightActionContainer: {
    width: 80,
    height: "100%",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },

  deleteButton: {
    width: "48%",
    height: "100%",
    backgroundColor: "red",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: 10,
  },

  changeButton: {
    width: "40%",
    height: "100%",
    backgroundColor: colors.dark.accent,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: 1,
    borderColor: "white",
    borderWidth: 1,
  },

  viewButton: {
    width: "80%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: 1,
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "20%",
    height: "100%",
  },

  headerText: {
    padding: 10,
    fontSize: 14,
    fontWeight: "600",
  },

  headerTextDark: {
    padding: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },

  endWorkoutButton: {
    width: "95%",
    borderRadius: 10,
    backgroundColor: colors.dark.accent,
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  endWorkoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },

  timerText: {
    fontSize: 30,
    fontWeight: "800",
  },

  timerTextDark: {
    fontSize: 30,
    fontWeight: "800",
    color: "white",
  },
});
