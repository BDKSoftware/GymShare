import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import colors from "../../../theme";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, auth } from "../../../firebase";
import { collection, where, query, getDocs } from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";
import getUser from "../../utils/getUser";
import { Ionicons } from "@expo/vector-icons";
import RenderItem from "./components/RenderItem";
import { useAuth } from "../../context/AuthContext";

function Home() {
  const [location, setLocation] = useState(null);
  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);

  const [pastWorkouts, setPastWorkouts] = useState([]);
  const isFocused = useIsFocused();
  const [user, setUser] = useState(null);

  async function getData() {
    const user = await getUser(auth.currentUser.uid);
    setUser(user);
    return;
  }

  const getMinutes = (ms) =>
    ("0" + Math.floor((ms / 60 / 1000) % 60)).slice(-2);
  const getSeconds = (ms) => ("0" + Math.floor((ms / 1000) % 60)).slice(-2);
  const formatTime = (ms) => `${getMinutes(ms)}m ${getSeconds(ms)}s`;

  async function getPastWorkouts() {
    const q = query(
      collection(db, "workouts"),
      where("creator", "==", auth.currentUser.uid)
    );

    // getDocs(q).then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     setPastWorkouts((pastWorkouts) => [...pastWorkouts, doc.data()]);
    //   });
    // });

    let workouts = [];
    let workoutSnapshots = await getDocs(q);

    workoutSnapshots.forEach((doc) => {
      // Get all workouts in the past week
      if (doc.data().date >= Date.now() - 604800000) {
        workouts.push(doc.data());
      }
    });

    setPastWorkouts(workouts);
  }

  function navigateToCreateWorkout() {
    navigation.navigate("CreateWorkout");
  }

  function handleGymSelect() {
    navigation.navigate("Profile", {
      screen: "AddGym",
      initial: false,
    });
  }

  useEffect(() => {
    getData();
  }, [isFocused]);

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
      <View style={styles.topBar}>
        <Pressable onPress={navigateToCreateWorkout}>
          <Ionicons name="add-circle" size={24} color={colors.dark.accent} />
        </Pressable>
        {user !== null && (
          <Text style={styles.gymName} numberOfLines={1}>
            {`${user.streak} 🔥`}
          </Text>
        )}
      </View>
      <View style={styles.titleContainer}>
        <Text style={theme === "light" ? styles.title : styles.titleDark}>
          Past 7 Days:
        </Text>
        {pastWorkouts.length > 0 && (
          <Text
            style={theme === "light" ? styles.title2 : styles.title2Dark}
          >{`${pastWorkouts.length} Workouts`}</Text>
        )}
      </View>
      {pastWorkouts.length > 0 ? (
        <FlatList
          style={{ width: "90%" }}
          contentContainerStyle={{ paddingBottom: 100 }}
          data={pastWorkouts}
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

  topBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 20,
  },

  gymName: {
    fontSize: 18,
    color: colors.dark.accent,
    flexWrap: "nowrap",
    fontWeight: "700",
  },

  titleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 20,
  },

  title: {
    fontSize: 14,
    color: "#000",
    fontWeight: "400",
  },

  titleDark: {
    fontSize: 14,
    color: "#8e8d93",
    fontWeight: "bold",
  },

  title2: {
    fontSize: 14,
    color: "#000",
    fontWeight: "400",
  },

  title2Dark: {
    fontSize: 14,
    color: "#8e8d93",
    fontWeight: "bold",
  },

  noGymText: {
    fontSize: 14,
    color: colors.dark.accent,
    fontWeight: "800",
    textDecorationLine: "underline",
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
});
