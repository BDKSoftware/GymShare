import React, { useEffect } from "react";
import {
  Text,
  SafeAreaView,
  Button,
  StyleSheet,
  View,
  Pressable,
} from "react-native";
import { auth } from "../../../firebase";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import colors from "../../../theme";
import { changeTheme } from "../../store/themeSlice";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateProfile } from "firebase/auth";
import { Image } from "expo-image";

function Profile() {
  let userEmail = auth.currentUser.email;
  let displayName = auth.currentUser.displayName;
  let userImage = auth.currentUser.photoURL;
  const { logOut } = useAuth();
  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();

  const handleLogout = () => {
    logOut();
    navigation.navigate("Login");
  };

  const handleSettings = () => {
    navigation.navigate("ProfileNavigation", {
      screen: "Settings",
      initial: false,
    });
  };

  useEffect(() => {}, []);

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
        <Text
          style={
            theme === "light"
              ? styles.pastWorkoutTitleLight
              : styles.pastWorkoutTitleDark
          }
        >
          Past Workouts:
        </Text>
        <View style={styles.pastWorkouts}>
          <Text
            style={
              theme === "light" ? styles.noWorkoutsLight : styles.noWorkoutsDark
            }
          >{`No Workouts Saved :(`}</Text>
        </View>
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
    resizeMode: "contain",
    borderColor: colors.dark.accent,
    borderWidth: 5,
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
});
