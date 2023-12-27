import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { auth } from "../../../firebase";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import colors from "../../../theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

//Components
import PastWorkouts from "./components/PastWorkouts";
import Stats from "./components/Stats";

function Profile() {
  let userEmail = auth.currentUser.email;
  let displayName = auth.currentUser.displayName;
  let userImage = auth.currentUser.photoURL;

  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);

  // State
  const [view, setView] = useState("pw"); // pastWorkouts, Stats

  const handleSettings = () => {
    navigation.navigate("Profile", {
      screen: "Settings",
      initial: false,
    });
  };

  return (
    <SafeAreaView
      style={theme === "light" ? styles.lightContainer : styles.darkContainer}
    >
      <View style={styles.settingsContainer}>
        <Pressable onPress={handleSettings}>
          <Ionicons
            name="settings-sharp"
            size={24}
            color={colors.dark.accent}
            contentFit="contain"
            transition={1000}
          />
        </Pressable>
      </View>
      <View style={styles.userInfoContainer}>
        <Image source={userImage} style={styles.userImage} />
        <View>
          <Text
            style={
              theme === "light" ? styles.userNameLight : styles.userNameDark
            }
          >
            {displayName}
          </Text>
          <Text
            style={
              theme === "light" ? styles.userEmailLight : styles.userEmailDark
            }
          >
            {userEmail}
          </Text>
        </View>
      </View>
      <View style={styles.pastWorkoutContainer}>
        <View
          style={
            theme === "light"
              ? styles.switchButtonContainerLight
              : styles.switchButtonContainerDark
          }
        >
          <TouchableOpacity
            style={view === "pw" ? styles.active : styles.inactive}
            onPress={() => setView("pw")}
          >
            <Text
              style={view === "pw" ? styles.activeText : styles.inactiveText}
            >
              Past Workouts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={view === "stats" ? styles.active : styles.inactive}
            onPress={() => setView("stats")}
          >
            <Text
              style={view === "stats" ? styles.activeText : styles.inactiveText}
            >
              My Statistics
            </Text>
          </TouchableOpacity>
        </View>
        {view === "pw" ? <PastWorkouts /> : <Stats />}
      </View>
    </SafeAreaView>
  );
}

export default Profile;

const styles = StyleSheet.create({
  lightContainer: {
    flex: 1,
    backgroundColor: colors.light.background,
  },

  darkContainer: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },

  settingsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    width: "100%",
    height: "5%",
    paddingHorizontal: 20,
  },

  userInfoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "15%",
    padding: 10,
  },

  userImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderColor: colors.dark.accent,
    borderWidth: 3,
    marginRight: 30,
  },

  userNameLight: {
    color: "#000",
    fontSize: 24,
  },

  userNameDark: {
    color: colors.dark.accent,
    fontSize: 24,
  },

  userEmailLight: {
    color: "#000",
    fontSize: 16,
  },

  userEmailDark: {
    color: colors.dark.accent,
    fontSize: 16,
  },
  pastWorkoutContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "80%",
    padding: 10,
  },

  pastWorkoutTitleLight: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },

  pastWorkoutTitleDark: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: colors.dark.accent,
  },

  pastWorkouts: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: 10,
    marginTop: 10,
  },

  noWorkoutsLight: {
    fontSize: 16,
    color: "#000",
  },

  noWorkoutsDark: {
    fontSize: 16,
    color: colors.dark.accent,
  },

  switchButtonContainerLight: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    height: 40,
    borderColor: colors.dark.accent,
    borderWidth: 1,
    borderRadius: 50,
  },

  switchButtonContainerDark: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "80%",
    backgroundColor: "#48494b",
    borderRadius: 50,
    height: 40,
  },

  active: {
    backgroundColor: colors.dark.accent,
    width: "50%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },

  inactive: {
    backgroundColor: "transparent",
    width: "50%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },

  activeText: {
    color: "#fff",
    fontSize: 16,
  },

  inactiveText: {
    color: colors.dark.accent,
    fontSize: 16,
  },
});
