import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Animated,
  Pressable,
  Alert,
} from "react-native";

import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import colors from "../../../theme";
import EndWorkoutButton from "./components/EndWorkoutButton";
import { auth, db } from "../../../firebase";
import { addDoc, doc, collection, updateDoc } from "firebase/firestore";
import { Swipeable } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import Months from "../../data/Months";

function StartWorkout(props) {
  const theme = useSelector((state) => state.theme.value);
  const startTime = Date.now();
  const navigation = useNavigation();
  const [exerciseList, setExerciseList] = useState(
    props.route.params.workout.exercises
  );

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

  const RenderRightActions = ({ progress, dragX, exercise }) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.rightActionContainer}>
        <Pressable style={styles.changeButton}>
          <Animated.View
            style={{
              color: "white",
              fontWeight: "600",
              transform: [{ scale }],
              display: "flex",
            }}
          >
            <FontAwesome name="exchange" size={20} color="white" />
          </Animated.View>
          <Animated.Text
            style={{
              color: "white",
              fontWeight: "600",
              transform: [{ scale }],
              display: "flex",
            }}
          >
            Change
          </Animated.Text>
        </Pressable>
        <Pressable
          style={styles.deleteButton}
          onPress={() => removeExercise(exercise)}
        >
          <Animated.View
            style={{
              color: "white",
              fontWeight: "600",
              transform: [{ scale }],
              display: "flex",
            }}
          >
            <AntDesign name="delete" size={20} color="white" />
          </Animated.View>

          <Animated.Text
            style={{
              color: "white",
              fontWeight: "600",
              transform: [{ scale }],
              display: "flex",
            }}
          >
            Delete
          </Animated.Text>
        </Pressable>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <Swipeable
        renderRightActions={(progress, dragX) => (
          <RenderRightActions
            progress={progress}
            dragX={dragX}
            exercise={item}
          />
        )}
        friction={2}
      >
        <Animated.View
          style={
            theme === "light"
              ? styles.renderItemContainer
              : styles.renderItemContainerDark
          }
        >
          <Text>{item.name}</Text>
        </Animated.View>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView
      style={theme === "light" ? styles.container : styles.darkContainer}
    >
      <View style={styles.header}>
        <View style={styles.discardButtonContainer}>
          <Pressable onPress={onDiscardPress}>
            <Text style={styles.headerButtonDiscard}>Discard</Text>
          </Pressable>
        </View>
        <Text style={theme === "light" ? styles.title : styles.titleDark}>
          Workout
        </Text>
        <View style={styles.finishButtonContainer}>
          <Pressable>
            <Text style={styles.headerButton}>Finish</Text>
          </Pressable>
        </View>
      </View>
      <View
        style={
          theme === "light"
            ? styles.workoutDataContainer
            : styles.workoutDataContainerDark
        }
      >
        <Text
          style={
            theme === "light" ? styles.workoutData : styles.workoutDataDark
          }
        >
          {name}
        </Text>
        <View style={theme === "light" ? styles.line : styles.lineDark} />

        <Text
          style={
            theme === "light" ? styles.workoutData : styles.workoutDataDark
          }
        >
          {getStartTime()}
        </Text>
      </View>
      <View style={{ width: "95%", height: "70%" }}>
        <FlatList
          data={exerciseList}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
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
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    width: "95%",
    height: 80,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
  },

  workoutDataContainerDark: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    width: "95%",
    height: 80,
    backgroundColor: "#2c2f33",
    borderRadius: 10,
    marginBottom: 20,
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
    width: "98%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 10,
  },

  renderItemContainerDark: {
    width: "98%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#2c2f33",
    borderRadius: 10,
  },

  rightActionContainer: {
    width: 200,
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
    width: "48%",
    height: "100%",
    backgroundColor: "green",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: 10,
  },
});
