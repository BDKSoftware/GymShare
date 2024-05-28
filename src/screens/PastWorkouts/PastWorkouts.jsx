import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  View,
} from "react-native";
import { db } from "../../../firebase";
import { getDocs, doc, where, query, collection } from "firebase/firestore";
import { useSelector } from "react-redux";
import colors from "../../../theme";
import RenderItem from "./components/RenderItem";

function PastWorkouts(props) {
  const theme = useSelector((state) => state.theme.value);
  let user = props.route.params.user;
  const [workouts, setWorkouts] = useState([]);

  async function getWorkouts() {
    let temp = [];
    let workoutsRef = collection(db, "workouts");
    let q = query(workoutsRef, where("creator", "==", user.uid));
    let workouts = await getDocs(q);

    workouts.forEach((workout) => {
      temp.push(workout.data());
    });

    setWorkouts(temp);
  }

  useEffect(() => {
    getWorkouts();
  });

  return (
    <SafeAreaView
      style={theme === "light" ? styles.lightContainer : styles.darkContainer}
    >
      <View style={styles.topArea}>
        <Text style={styles.topAreaText}>Past Workouts: </Text>
      </View>
      {workouts.length > 0 ? (
        <FlatList
          style={{ width: "90%" }}
          contentContainerStyle={{ paddingBottom: 100 }}
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RenderItem item={item} theme={theme} />}
          ItemSeparatorComponent={() => <View style={{ marginVertical: 5 }} />}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.noWorkoutContainer}>
          <Text style={styles.noWorkoutText}>No Workouts Found</Text>
          <Text style={styles.noWorkoutText}>
            Start by adding a new workout!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

export default PastWorkouts;

const styles = StyleSheet.create({
  lightContainer: {
    flex: 1,
    backgroundColor: "#f3f3f5",
    alignItems: "center",
  },

  darkContainer: {
    flex: 1,
    backgroundColor: colors.dark.background,
    alignItems: "center",
    justifyContent: "center",
  },

  noWorkoutContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "40%",
  },

  noWorkoutText: {
    fontSize: 14,
    color: colors.dark.accent,
    fontWeight: "800",
  },

  topArea: {
    width: "90%",
    height: "10%",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 5,
  },

  topAreaText: {
    color: colors.dark.accent,
    fontSize: 20,
    fontWeight: "600",
  },
});
