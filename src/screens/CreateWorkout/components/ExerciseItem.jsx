import React from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";
import colors from "../../../../theme";
import { useSelector } from "react-redux";

function ExerciseItem({ item, theme, updateExercise, addSet }) {
  const unit = useSelector((state) => state.unit.value);

  function checkUnit() {
    if (unit === "kg") {
      return "kg";
    } else {
      return "lbs";
    }
  }

  return (
    <View style={[styles.container, { height: 100 + item.sets.length * 50 }]}>
      <View
        style={
          theme === "light" ? styles.exerciseItem : styles.exerciseItemDark
        }
      >
        <View style={styles.header}>
          <Text
            style={
              theme === "light" ? styles.headerText : styles.headerTextDark
            }
          >
            {item.name}
          </Text>
        </View>
        {item.sets.map((set, index) => {
          return (
            <View key={index} style={styles.setContainer}>
              <View style={styles.indexIndicator}>
                <Text style={styles.indexIndicatorText}>{index + 1}</Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={theme === "light" ? styles.input : styles.inputDark}
                  keyboardType="numeric"
                  placeholder="0"
                  value={set.weight.toString()}
                  onChangeText={(text) => {
                    const newSets = [...item.sets];
                    newSets[index].weight = text;
                    updateExercise(item.name, newSets);
                  }}
                  placeholderTextColor={
                    theme === "light" ? "lightgrey" : "whitesmoke"
                  }
                />
                <Text
                  style={
                    theme === "light" ? styles.infoText : styles.infoTextDark
                  }
                >
                  {checkUnit()}
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={theme === "light" ? styles.input : styles.inputDark}
                  keyboardType="numeric"
                  placeholder="0"
                  value={set.reps.toString()}
                  onChangeText={(text) => {
                    const newSets = [...item.sets];
                    newSets[index].reps = text;
                    updateExercise(item.name, newSets);
                  }}
                  placeholderTextColor={
                    theme === "light" ? "lightgrey" : "whitesmoke"
                  }
                />
                <Text
                  style={
                    theme === "light" ? styles.infoText : styles.infoTextDark
                  }
                >
                  Reps
                </Text>
              </View>
            </View>
          );
        })}
        <View style={styles.footer}>
          <Pressable onPress={() => addSet(item)}>
            <Text style={styles.addSetText}>Add Set</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default ExerciseItem;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },

  containerDark: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  exerciseItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 10,
  },

  exerciseItemDark: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
    height: "100%",
    backgroundColor: "#2c2f33",
    borderRadius: 10,
  },

  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
    height: 50,
  },

  indexIndicator: {
    fontSize: 16,
    fontWeight: "400",
    color: "black",
    borderColor: colors.dark.accent,
    borderWidth: 1,
    borderRadius: 50,
    padding: 5,
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
  },

  indexIndicatorText: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.dark.accent,
  },

  setContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
    height: 50,
  },

  inputContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "20%",
  },

  input: {
    height: "100%",
    fontSize: 14,
  },

  inputDark: {
    height: "100%",
    color: "white",
    fontSize: 14,
  },

  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    padding: 10,
    height: 50,
  },

  addSetText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.light.accent,
  },

  headerText: {
    fontSize: 16,
    fontWeight: "700",
    color: "black",
  },

  headerTextDark: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },

  infoText: {
    fontSize: 14,
    fontWeight: "400",
    color: "black",
    marginLeft: 5,
  },

  infoTextDark: {
    fontSize: 14,
    fontWeight: "400",
    color: "white",
    marginLeft: 5,
  },
});
