import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import colors from "../../../theme";
import { Foundation } from "@expo/vector-icons";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, auth } from "../../../firebase";
import { collection, where, query, getDocs } from "firebase/firestore";

function Home() {
  const [location, setLocation] = useState(null);
  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();
  const [pastWorkouts, setPastWorkouts] = useState([]);

  const getMinutes = (ms) =>
    ("0" + Math.floor((ms / 60 / 1000) % 60)).slice(-2);
  const getSeconds = (ms) => ("0" + Math.floor((ms / 1000) % 60)).slice(-2);
  const formatTime = (ms) => `${getMinutes(ms)}m ${getSeconds(ms)}s`;

  function getPastWorkouts() {
    const q = query(
      collection(db, "workouts"),
      where("creator", "==", auth.currentUser.uid)
    );

    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setPastWorkouts((pastWorkouts) => [...pastWorkouts, doc.data()]);
      });
    });
  }

  function navigateToCreateWorkout() {
    navigation.navigate("CreateWorkout");
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      return () => {};
    })();
  }, []);

  useEffect(() => {
    if (location !== null) {
      let coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      AsyncStorage.setItem("userLocation", JSON.stringify(coords));
    }
    return () => {};
  }, [location]);

  useEffect(() => {
    if (pastWorkouts.length === 0 && auth.currentUser !== null) {
      getPastWorkouts();
    }
  }, []);

  return (
    <SafeAreaView
      style={theme === "light" ? styles.lightContainer : styles.darkContainer}
    >
      <View style={styles.createWorkoutButtonContainer}>
        <TouchableOpacity
          style={styles.createWorkoutButton}
          onPress={navigateToCreateWorkout}
        >
          <Foundation name="plus" size={20} color="white" />
          <Text style={styles.createWorkoutButtonText}>Create Workout</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Past Workouts</Text>

      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 100,
        }}
        style={styles.pastWorkoutContainer}
        showsVerticalScrollIndicator={false}
      >
        {pastWorkouts.length > 0 &&
          pastWorkouts.map((workout, index) => {
            return (
              <View
                style={
                  theme === "light"
                    ? styles.pastWorkout
                    : styles.pastWorkoutDark
                }
                key={index}
              >
                <View style={styles.pastWorkoutLeft}>
                  <Text
                    style={
                      theme === "light"
                        ? styles.pastWorkoutTitle
                        : styles.pastWorkoutTitleDark
                    }
                  >
                    {`${workout.name}`}
                  </Text>
                  <Text
                    style={
                      theme === "light"
                        ? styles.pastWorkoutsubtext
                        : styles.pastWorkoutsubtextDark
                    }
                  >{`Duration: ${formatTime(workout.duration)}`}</Text>
                  <Text
                    style={
                      theme === "light"
                        ? styles.pastWorkoutsubtext
                        : styles.pastWorkoutsubtextDark
                    }
                  >{`${workout.exercises.length} exercises`}</Text>
                </View>
                <View style={styles.pastWorkoutRight}>
                  <TouchableOpacity style={styles.viewWorkoutButton}>
                    <Text style={styles.viewWorkoutButtonText}>
                      View Workout
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
}

export default Home;

const styles = StyleSheet.create({
  lightContainer: {
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

  createWorkoutButtonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "10%",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    alignSelf: "flex-start",
    marginLeft: 10,
    color: colors.dark.accent,
  },

  createWorkoutButton: {
    backgroundColor: colors.dark.accent,
    borderRadius: 10,
    padding: 10,
    width: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  createWorkoutButtonText: {
    color: "#fff",
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "bold",
  },

  pastWorkoutContainer: {
    display: "flex",
    height: "70%",
    width: "100%",
    padding: 10,
  },

  pastWorkout: {
    display: "flex",
    width: "100%",
    height: 100,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },

  pastWorkoutDark: {
    display: "flex",
    width: "100%",
    height: 100,
    backgroundColor: "#2c2f33",
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: "row",
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },

  pastWorkoutLeft: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    height: "100%",
    width: "50%",
    padding: 10,
  },

  pastWorkoutRight: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "flex-end",
    height: "100%",
    width: "50%",
    padding: 10,
  },

  pastWorkoutTitle: {
    color: "black",
    padding: 10,
    fontWeight: "700",
    fontSize: 16,
  },

  pastWorkoutTitleDark: {
    color: "white",
    padding: 10,
    fontWeight: "700",
    fontSize: 16,
  },

  pastWorkoutsubtext: {
    color: "black",
    padding: 10,
    fontWeight: "500",
    fontSize: 14,
  },

  pastWorkoutsubtextDark: {
    color: "white",
    padding: 10,
    fontWeight: "500",
    fontSize: 14,
  },

  viewWorkoutButton: {
    backgroundColor: colors.dark.accent,
    padding: 10,
    borderRadius: 10,
  },

  viewWorkoutButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
