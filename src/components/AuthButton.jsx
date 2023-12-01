import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../../theme";

function AuthButton({ theme, title, onPress }) {
  return (
    <TouchableOpacity
      style={theme === "light" ? styles.lightButton : styles.darkButton}
      onPress={onPress}
    >
      <Text
        style={
          theme === "light" ? styles.lightButtonText : styles.darkButtonText
        }
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default AuthButton;

const styles = StyleSheet.create({
  lightButton: {
    width: "90%",
    height: 50,
    backgroundColor: colors.light.accent,
    borderRadius: 10,
    marginTop: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  darkButton: {
    width: "90%",
    height: 50,
    backgroundColor: colors.dark.accent,
    borderRadius: 10,
    marginTop: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  lightButtonText: {
    color: colors.light.background,
    fontSize: 20,
  },

  darkButtonText: {
    color: "white",
    fontSize: 20,
  },
});
