import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

const RenderItem = ({ item, theme }) => {
  const navigation = useNavigation();

  function convertSecondsToTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const newSeconds = Math.floor(seconds % 60);

    return `${minutes}m ${newSeconds < 10 ? "0" : ""}${newSeconds}s`;
  }

  function navigateToViewWorkout() {
    navigation.navigate("ViewWorkout", { workout: item });
  }

  return (
    <Pressable onPress={navigateToViewWorkout}>
      <View style={theme === "light" ? styles.container : styles.containerDark}>
        <View style={styles.left}>
          <Text style={theme === "light" ? styles.title : styles.titleDark}>
            {item.name}
          </Text>
          {item.exercises.map((exercise) => (
            <Text
              style={
                theme === "light" ? styles.tableItem : styles.tableItemDark
              }
              key={exercise.id}
            >
              {`${exercise.sets.length}x ${exercise.name}`}
            </Text>
          ))}
        </View>
        <View style={styles.right}>
          <Text style={styles.rightItem}>
            {convertSecondsToTime(item.duration)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default RenderItem;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    minHeight: 50,
    maxHeight: 150,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },

  containerDark: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    minHeight: 50,
    maxHeight: 150,
    backgroundColor: "#2c2f33",
    borderRadius: 10,
    elevation: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
  },

  titleDark: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  left: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "70%",
    padding: 10,
  },

  right: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    width: "30%",
    height: "100%",
    padding: 10,
  },

  tableItem: {
    fontSize: 14,
    color: "#000",
  },

  tableItemDark: {
    fontSize: 14,
    color: "#fff",
  },

  rightItem: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9898a0",
  },
});
