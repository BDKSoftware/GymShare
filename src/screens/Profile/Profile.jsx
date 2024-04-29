import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Pressable,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { auth } from "../../../firebase";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import colors from "../../../theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useAuth } from "../../context/AuthContext";
import NavigationButton from "./components/NavigationButton";

//External Functions
import getUser from "../../utils/getUser";

function Profile() {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);
  const { logOut } = useAuth();
  const isFocused = useIsFocused();

  // State
  const [user, setUser] = useState(null);

  const handleSettings = () => {
    navigation.navigate("Settings");
  };

  function userSignOut() {
    navigation.navigate("Login");
    logOut();
  }

  async function getData() {
    const user = await getUser(auth.currentUser.uid);
    setUser(user);
    return;
  }

  useEffect(() => {
    getData();
  }, [isFocused]);

  return (
    <SafeAreaView
      style={theme === "light" ? styles.lightContainer : styles.darkContainer}
    >
      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={userSignOut}>
          <Ionicons
            name="log-out-outline"
            size={30}
            color={theme === "light" ? colors.light.accent : colors.dark.accent}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        {auth.currentUser && (
          <>
            <Image source={auth.currentUser.photoURL} style={styles.image} />

            <Text style={theme === "light" ? styles.name : styles.nameDark}>
              {auth.currentUser.displayName}
            </Text>
          </>
        )}
        {user && (
          <>
            <View style={styles.infoView}>
              <Ionicons
                name="people-circle-sharp"
                size={20}
                color={colors.dark.accent}
              />
              <Text
                style={styles.friendsText}
              >{`${user?.friends.length} friends`}</Text>
            </View>
            <View style={styles.infoView}>
              <Ionicons
                name="location-sharp"
                size={20}
                color={colors.dark.accent}
              />
              <Text style={styles.gymText}>{user.homeGym.name}</Text>
            </View>
          </>
        )}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            navigation.navigate("EditProfile");
          }}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <View
        style={
          theme === "light"
            ? styles.navigationContainer
            : styles.navigationContainerDark
        }
      >
        <NavigationButton
          icon="calendar-outline"
          text="Past Workouts"
          onPress={() => {}}
        />
        <NavigationButton
          icon="barbell-sharp"
          text="Find My Gym"
          onPress={() => navigation.navigate("AddGym")}
        />

        <NavigationButton
          icon="settings-sharp"
          text="Settings"
          onPress={handleSettings}
        />
      </View>
    </SafeAreaView>
  );
}

export default Profile;

const styles = StyleSheet.create({
  lightContainer: {
    flex: 1,
    backgroundColor: "#f3f3f5",
  },

  darkContainer: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },

  logoutContainer: {
    width: "100%",
    height: 50,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 20,
  },

  imageContainer: {
    width: "100%",
    height: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 40,
  },

  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },

  nameDark: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },

  friendsText: {
    fontSize: 16,
    color: colors.dark.accent,
    marginLeft: 10,
  },

  gymText: {
    fontSize: 16,
    color: colors.dark.accent,
    marginLeft: 10,
  },

  editButton: {
    width: "50%",
    height: 30,
    backgroundColor: colors.light.accent,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  editButtonDark: {
    width: "40%",
    height: 30,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  editButtonText: {
    fontSize: 16,
    color: "#fff",
  },

  editButtonTextDark: {
    fontSize: 16,
    color: "#fff",
  },

  navigationContainer: {
    width: "100%",
    height: "50%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  navigationContainerDark: {
    width: "100%",
    height: "50%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "#2c2f33",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  infoView: {
    width: "80%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
