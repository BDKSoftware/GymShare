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
    console.log(user);
    return;
  }

  useEffect(() => {
    getData();
  }, [isFocused]);

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
    console.log(location);
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
        {user && (
          <Text style={styles.gymName} numberOfLines={1}>
            {user.homeGym.name}
          </Text>
        )}
      </View>
      <View style={styles.titleContainer}>
        <Text style={theme === "light" ? styles.title : styles.titleDark}>
          Past Workouts:{" "}
        </Text>
        <Text
          style={theme === "light" ? styles.title2 : styles.title2Dark}
        >{`${pastWorkouts.length} Workouts`}</Text>
      </View>
      <FlatList
        style={{ width: "90%" }}
        contentContainerStyle={{ paddingBottom: 100 }}
        data={pastWorkouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RenderItem item={item} theme={theme} />}
        ItemSeparatorComponent={() => <View style={{ marginVertical: 5 }} />}
        showsVerticalScrollIndicator={false}
      />
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
    fontSize: 14,
    color: colors.dark.accent,
    flexWrap: "nowrap",
    fontWeight: "800",
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
});
