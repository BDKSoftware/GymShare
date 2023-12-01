import React from "react";
import { TextInput, StyleSheet } from "react-native";
import colors from "../../theme";

function AuthInput({
  theme,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  onFocus,
  textContentType,
}) {
  return (
    <TextInput
      style={theme === "light" ? styles.lightInput : styles.darkInput}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      onFocus={onFocus}
      placeholderTextColor={theme === "light" ? colors.light.accent : "white"}
      textContentType={textContentType}
    />
  );
}

export default AuthInput;

const styles = StyleSheet.create({
  lightInput: {
    width: "90%",
    height: 50,
    backgroundColor: "#fff",
    color: colors.light.accent,
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 20,
    borderColor: colors.light.accent,
    borderWidth: 1,
  },

  darkInput: {
    width: "90%",
    height: 50,
    backgroundColor: colors.dark.background,
    color: "white",
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 20,
    borderColor: colors.dark.accent,
    borderWidth: 1,
  },
});
