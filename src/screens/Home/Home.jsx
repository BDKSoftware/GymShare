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

function Home() {
  const [location, setLocation] = useState(null);
  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();

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
        <View style={styles.pastWorkout}>
          <Text>Workout Data: 123456789</Text>
        </View>
        <View style={styles.pastWorkout}>
          <Text>Workout Data: 123456789</Text>
        </View>
        <View style={styles.pastWorkout}>
          <Text>Workout Data: 123456789</Text>
        </View>
        <View style={styles.pastWorkout}>
          <Text>Workout Data: 123456789</Text>
        </View>
        <View style={styles.pastWorkout}>
          <Text>Workout Data: 123456789</Text>
        </View>
        <View style={styles.pastWorkout}>
          <Text>Workout Data: 123456789</Text>
        </View>
        <View style={styles.pastWorkout}>
          <Text>Workout Data: 123456789</Text>
        </View>
        <View style={styles.pastWorkout}>
          <Text>Workout Data: 123456789</Text>
        </View>
        <View style={styles.pastWorkout}>
          <Text>Workout Data: 123456789</Text>
        </View>
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
  },
});
