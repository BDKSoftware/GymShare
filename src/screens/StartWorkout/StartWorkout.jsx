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

function StartWorkout(props) {
  const theme = useSelector((state) => state.theme.value);
  const startTime = Date.now();
  const navigation = useNavigation();
  const [exerciseList, setExerciseList] = useState(
    props.route.params.workout.exercises
  );

  const { gym, name } = props.route.params.workout;

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
        <Animated.View style={styles.renderItemContainer}>
          <Text>{item.name}</Text>
        </Animated.View>
      </Swipeable>
    );
  };

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
        <FlatList
          data={exerciseList}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          ItemSeparatorComponent={() => <View style={{ marginBottom: 20 }} />}
        />
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

  renderItemContainer: {
    width: "100%",
    height: 80,
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
