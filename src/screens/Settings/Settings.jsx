import React from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Pressable,
  Switch,
  Touchable,
  TouchableOpacity,
} from "react-native";

import { useAuth } from "../../context/AuthContext";

import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import colors from "../../../theme";
import { changeTheme } from "../../store/themeSlice";

import { Ionicons } from "@expo/vector-icons";
import { changeUnit } from "../../store/unitSlice";

function Settings() {
  const { logOut } = useAuth();
  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);
  const unit = useSelector((state) => state.unit.value);
  const dispatch = useDispatch();

  function changeColorTheme() {
    if (theme === "light") {
      dispatch(changeTheme("dark"));
      return;
    }
    dispatch(changeTheme("light"));
    return;
  }

  function changeUnitValue() {
    if (unit === "imperial") {
      dispatch(changeUnit("metric"));
      return;
    }
    dispatch(changeUnit("imperial"));
    return;
  }

  function userSignOut() {
    logOut();
    navigation.navigate("Login");
  }

  function goBack() {
    navigation.goBack();
  }

  return (
    <SafeAreaView
      style={theme === "light" ? styles.lightContainer : styles.darkContainer}
    >
      <View style={styles.goBack}>
        <Pressable onPress={goBack}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme === "light" ? "#000" : colors.dark.accent}
          />
        </Pressable>
      </View>
      <View style={styles.titleContainer}>
        <Text style={theme === "light" ? styles.titleLight : styles.titleDark}>
          Settings
        </Text>
      </View>
      <View style={styles.settingsContainer}>
        <Text style={theme === "light" ? styles.themeLight : styles.themeDark}>
          Dark Mode
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          onValueChange={changeColorTheme}
          value={theme === "light" ? false : true}
        />
      </View>
      <View style={styles.settingsContainer}>
        <Text style={theme === "light" ? styles.themeLight : styles.themeDark}>
          {`Measurement Unit (${unit === "imperial" ? "lb" : "kg"})`}
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          onValueChange={changeUnitValue}
          value={unit === "imperial" ? false : true}
        />
      </View>
      <View style={styles.settingsContainer}>
        <Text style={theme === "light" ? styles.themeLight : styles.themeDark}>
          Username
        </Text>
        <TouchableOpacity style={styles.updateButton}>
          <Text style={styles.updateText}>Update Username</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.settingsContainer}>
        <Text style={theme === "light" ? styles.themeLight : styles.themeDark}>
          Profile Picture
        </Text>
        <TouchableOpacity style={styles.updateButton}>
          <Text style={styles.updateText}>Update Image</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.logoutButtonContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={userSignOut}>
          <Text style={styles.updateText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  lightContainer: {
    flex: 1,
    backgroundColor: colors.light.background,
  },

  darkContainer: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },

  goBack: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    height: "5%",
    width: "100%",
    padding: 10,
  },

  titleContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    height: "10%",
    width: "100%",
    padding: 15,
  },

  titleLight: {
    color: "#000",
    fontSize: 24,
  },

  titleDark: {
    color: colors.dark.accent,
    fontSize: 24,
  },

  settingsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    height: 60,
    width: "100%",
    paddingHorizontal: 15,
    marginBottom: 10,
  },

  themeLight: {
    color: "#000",
    fontSize: 20,
  },

  themeDark: {
    color: colors.dark.accent,
    fontSize: 20,
  },

  updateButton: {
    backgroundColor: colors.light.accent,
    borderRadius: 5,
    padding: 5,
    width: 175,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  updateText: {
    color: "#fff",
    fontSize: 18,
  },

  logoutButtonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "20%",
    width: "100%",
  },

  logoutButton: {
    backgroundColor: "red",
    borderRadius: 5,
    padding: 5,
    width: "50%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Settings;
