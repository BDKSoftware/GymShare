import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Pressable,
  Switch,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import colors from "../../../theme";
import { changeTheme } from "../../store/themeSlice";
import { Ionicons } from "@expo/vector-icons";
import { changeUnit } from "../../store/unitSlice";
import { getAuth, updateProfile } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

function Settings() {
  const { logOut } = useAuth();
  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);
  const unit = useSelector((state) => state.unit.value);
  const dispatch = useDispatch();
  const storage = getStorage();
  const auth = getAuth();
  const displayName = auth.currentUser.displayName;
  const [userName, setUsername] = useState(displayName);
  const [loading, setLoading] = useState(false);

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
      <Modal visible={loading} animationType="slide" transparent={true}>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <View style={theme === "light" ? styles.modal : styles.modalDark}>
            <ActivityIndicator size="large" color={colors.dark.accent} />
            <Text style={{ color: colors.dark.accent, marginTop: 20 }}>
              Uploading Image...
            </Text>
          </View>
        </View>
      </Modal>
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
      <View style={styles.logoutButtonContainer}>
        <TouchableOpacity style={styles.updateButton}>
          <Text style={styles.updateText}>Change Password</Text>
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
    width: "80%",
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

  updateUsername: {
    color: colors.dark.accent,
    fontSize: 18,
    borderBottomColor: colors.dark.accent,
    borderBottomWidth: 1,
    width: 175,
    height: 40,
    paddingLeft: 5,
  },

  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },

  modalDark: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors.dark.background,
  },
});

export default Settings;
