import React from "react";

import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../theme";

function NavigationButton({ icon, text, onPress }) {
  const theme = useSelector((state) => state.theme.value);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <View
          style={
            theme === "light"
              ? styles.iconBackground
              : styles.iconBackgroundDark
          }
        >
          <Ionicons
            name={icon}
            size={20}
            color={theme === "light" ? "#000" : "#fff"}
          />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text
          style={theme === "light" ? styles.textStyle : styles.textStyleDark}
        >
          {text}
        </Text>
      </View>
      <View style={styles.chevronContainer}>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={theme === "light" ? "#000" : "#fff"}
        />
      </View>
    </TouchableOpacity>
  );
}

export default NavigationButton;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    height: 80,
    marginTop: 10,
  },

  iconContainer: {
    width: "10%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f3f3f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  iconBackgroundDark: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.dark.background,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  textContainer: {
    width: "70%",
    height: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 20,
  },

  textStyle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },

  textStyleDark: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },

  chevronContainer: {
    width: "10%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
