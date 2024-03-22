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
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
    let userRef = doc(db, "users", auth.currentUser.uid);
    await getUser(auth.currentUser.uid).then(async (user) => {
      await updateDoc(userRef, {
        streak: user.streak + 1,
      }).then(() => console.log("Streak Updated"));
    });
  }

  async function finishWorkout() {
    console.log("Workout Finished");

    let workout = {
      gym: gym,
      name: name,
      exercises: exerciseList,
      duration: Date.now() - startTime,
      creator: auth.currentUser.uid,
      id: "",
      photo: "",
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

  const swipeableRef = useRef(null);

  const RenderRightActions = ({ progress, dragX, exercise, swipeableRef }) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.rightActionContainer}>
        <Pressable
          style={styles.viewButton}
          onPress={() => {
            setSelectedExercise(exercise);
            setSelectExerciseModal(true);
            swipeableRef.current.close();
          }}
        >
          <Animated.View
            style={{
              color: "white",
              fontWeight: "600",
              transform: [{ scale }],
              display: "flex",
            }}
          >
            <MaterialCommunityIcons
              name="view-headline"
              size={20}
              color="white"
            />
          </Animated.View>

          <Animated.Text
            style={{
              color: "white",
              fontWeight: "600",
              transform: [{ scale }],
              display: "flex",
            }}
          >
            View
          </Animated.Text>
        </Pressable>
      </View>
    );
  };

  const RenderLeftActions = ({ progress, dragX, exercise, swipeableRef }) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.rightActionContainer}>
        <Pressable
          style={styles.changeButton}
          onPress={() => {
            setSelectedExercise(exercise);
            setChangeModalVisible(true);
            console.log(exercise);
            swipeableRef.current.close();
          }}
        >
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
      </View>
    );
  };

  const renderItem = ({ item }) => {
    //Close swipeable on modal open

    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={(progress, dragX) => (
          <RenderRightActions
            progress={progress}
            dragX={dragX}
            exercise={item}
            swipeableRef={swipeableRef}
          />
        )}
        renderLeftActions={(progress, dragX) => (
          <RenderLeftActions
            progress={progress}
            dragX={dragX}
            exercise={item}
            swipeableRef={swipeableRef}
          />
        )}
        friction={2}
        rightThreshold={40}
        leftThreshold={40}
        overshootRight={false}
        overshootLeft={false}
      >
        <Animated.View
          style={
            theme === "light"
              ? styles.renderItemContainer
              : styles.renderItemContainerDark
          }
        >
          <Text
            style={theme === "light" ? { color: "black" } : { color: "white" }}
          >
            {item.name}
          </Text>
        </Animated.View>
      </Swipeable>
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
      />

      <ChangeExerciseModal
        modalVisible={changeModalVisible}
        setModalVisible={setChangeModalVisible}
        exercises={exerciseList}
        setExercises={setExerciseList}
        selectedExercise={selectedExercise}
      />

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
          <Pressable onPress={() => finishWorkout()}>
            <Text style={styles.headerButton}>End Workout</Text>
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
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    width: "95%",
    height: 80,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 10,
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
    width: "100%",
    height: "100%",
    backgroundColor: colors.dark.accent,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: 5,
    borderColor: "white",
    borderWidth: 1,
  },

  viewButton: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.dark.accent,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: 5,
    borderColor: "white",
    borderWidth: 1,
  },
});
