import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  Pressable,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

// External Functions
import getNearbyGyms from "../../utils/getNearbyGyms";
import saveHomeGym from "../../utils/saveHomeGym";
import getUser from "../../utils/getUser";

import colors from "../../../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../../firebase";

function AddGym() {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);
  const [localGyms, setLocalGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);

  async function getUserLocationFromStorage() {
    let location = await AsyncStorage.getItem("userLocation");

    return JSON.parse(location);
  }

  function selectGym(gym) {
    setSelectedGym(gym.place_id);
  }

  function unselectGym(gym) {
    setSelectedGym(null);
  }

  async function getData() {
    const user = await getUser(auth.currentUser.uid);
    setSelectedGym(user.homeGym.place_id);
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getUserLocationFromStorage().then(async (location) => {
      let gyms = await getNearbyGyms(location.latitude, location.longitude);
      setLocalGyms(gyms);
    });
  }, []);

  return (
    <SafeAreaView
      style={theme === "light" ? styles.container : styles.darkContainer}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Gyms In Your Area</Text>
      </View>
      <View
        style={{
          height: "70%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: "flex-start",
            justifyContent: "center",
            paddingBottom: 100,
          }}
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {localGyms.map((gym) => (
            <View key={gym.place_id} style={styles.gymContainer}>
              <View style={styles.gymInfoContainer}>
                <Text
                  style={
                    theme === "light" ? styles.gymName : styles.gymNameDark
                  }
                  numberOfLines={1}
                >
                  {gym.name}
                </Text>
                <Text
                  style={
                    theme === "light"
                      ? styles.gymAddress
                      : styles.gymAddressDark
                  }
                  numberOfLines={1}
                >
                  {gym.vicinity}
                </Text>
              </View>
              <View>
                {selectedGym === gym.place_id ? (
                  <Pressable onPress={() => unselectGym(gym)}>
                    <Ionicons
                      name="star-sharp"
                      size={24}
                      color={colors.dark.accent}
                    />
                  </Pressable>
                ) : (
                  <Pressable onPress={() => selectGym(gym)}>
                    <Ionicons
                      name="star-outline"
                      size={24}
                      color={colors.dark.accent}
                    />
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (selectedGym === null) {
              alert("Please select a gym first");
              return;
            }

            let gym = localGyms.find((gym) => gym.place_id === selectedGym);

            saveHomeGym(auth.currentUser.uid, gym).then(() => {
              navigation.navigate("User");
            });
          }}
        >
          <Text style={styles.buttonText}>Save Home Gym</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Cannot find gym?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default AddGym;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },

  darkContainer: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },

  titleContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.dark.accent,
  },

  scrollContainer: {
    display: "flex",
    width: "90%",
    marginTop: 20,
  },

  gymContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    height: 60,
    borderBottomColor: colors.dark.accent,
    borderBottomWidth: 1,
    padding: 10,
    marginBottom: 10,
  },

  gymInfoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "85%",
    height: "100%",
  },

  gymName: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },

  gymNameDark: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },

  gymAddress: {
    fontSize: 16,
    color: "#000",
  },

  gymAddressDark: {
    fontSize: 14,
    color: "#fff",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    height: "15%",
    marginTop: 20,
  },

  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: 40,
    backgroundColor: colors.dark.accent,
    borderRadius: 10,
  },

  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
