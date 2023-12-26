import React from "react";
import { Text, SafeAreaView, StyleSheet, View, Pressable } from "react-native";

import { useAuth } from "../../context/AuthContext";

import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import colors from "../../../theme";
import { changeTheme } from "../../store/themeSlice";

import { Ionicons } from "@expo/vector-icons";

function Settings() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Settings</Text>
    </SafeAreaView>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
});
