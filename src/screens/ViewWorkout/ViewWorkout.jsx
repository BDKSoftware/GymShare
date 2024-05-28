import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import colors from "../../../theme";
import RenderItem from "./component/RenderItem";
import getUser from "../../utils/getUser";
import { auth } from "../../../firebase";

const ViewWorkout = (props) => {
  let workout = props.route.params.workout;

  const theme = useSelector((state) => state.theme.value);
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [gym, setGym] = useState("");
  const [exercises, setExercises] = useState(
    props.route.params.workout.exercises
  );

  useEffect(() => {
    getUser(auth.currentUser.uid).then((user) => {
      setUser(user);
      setGym(user.homeGym.name);
    });
  }, []);

  function handleTryWorkout() {
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

    let copiedWorkout = {
      workout: workout.name,
      exercises: exercises,
      gym: gym,
    };

    navigation.navigate("StartWorkout", { workout: copiedWorkout });
  }

  return (
    <SafeAreaView
      style={theme === "light" ? styles.container : styles.darkContainer}
    >
      <View style={styles.topArea}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.dismiss}>Dismiss</Text>
        </Pressable>
        <Pressable onPress={handleTryWorkout}>
          <Text style={styles.text}>Start Workout</Text>
        </Pressable>
      </View>
      <View style={styles.content}>
        <FlatList
          data={exercises}
          renderItem={({ item }) => <RenderItem item={item} theme={theme} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ViewWorkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.light.background,
  },

  darkContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.dark.background,
  },
  content: {
    alignItems: "center",
  },

  topArea: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 50,
    paddingHorizontal: 20,
  },

  text: {
    fontSize: 15,
    color: colors.dark.accent,
    fontWeight: "bold",
  },

  dismiss: {
    color: "red",
    fontSize: 15,
  },
});
