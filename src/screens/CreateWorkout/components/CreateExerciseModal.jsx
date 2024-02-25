import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  SafeAreaView,
  FlatList,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import colors from "../../../../theme";
import Exercises from "../../../data/Exercises";

function CreateExerciseModal({
  modalVisible,
  setModalVisible,
  exercises,
  setExercises,
}) {
  const theme = useSelector((state) => state.theme.value);
  const exerciseGroups = Object.keys(Exercises);
  const [exerciseName, setExerciseName] = useState("");

  function createExercise(exerciseGroup) {
    if (exerciseName === "")
      return Alert.alert("Please enter a name for the exercise");
    setExercises([
      ...exercises,
      {
        id: exercises.length + 1,
        name: exerciseName,
        group: exerciseGroup,
        sets: [
          {
            reps: 0,
            weight: 0,
          },
        ],
      },
    ]);
    setModalVisible(false);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(!modalVisible)}
      style={{ width: "100%", height: "100%" }}
    >
      <SafeAreaView
        style={theme === "light" ? styles.container : styles.containerDark}
      >
        <View style={styles.header}>
          <Pressable onPress={() => setModalVisible(false)}>
            <Text style={styles.headerButton}>Cancel</Text>
          </Pressable>
          <Text style={theme === "light" ? styles.title : styles.titleDark}>
            Add Exercise
          </Text>
          <Pressable>
            <Text style={styles.headerButton}>Done</Text>
          </Pressable>
        </View>

        <TextInput
          style={theme === "light" ? styles.input : styles.inputDark}
          placeholder="Exercise Name"
          value={exerciseName}
          onChangeText={(text) => setExerciseName(text)}
          placeholderTextColor={theme === "light" ? "grey" : "whitesmoke"}
        />
        <Text
          style={theme === "light" ? styles.listHeader : styles.listHeaderDark}
        >
          Select Muscle Group
        </Text>
        <FlatList
          data={exerciseGroups}
          style={{ width: "100%", height: "60%" }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <Pressable
                onPress={() => createExercise(item)}
                style={
                  theme === "light" ? styles.listItem : styles.listItemDark
                }
              >
                <Text
                  style={
                    theme === "light"
                      ? styles.listItemText
                      : styles.listItemTextDark
                  }
                >
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </SafeAreaView>
    </Modal>
  );
}

export default CreateExerciseModal;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },

  containerDark: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors.dark.background,
  },

  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 50,
    padding: 10,
  },

  headerButton: {
    color: colors.dark.accent,
    fontWeight: "700",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "black",
  },

  titleDark: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },

  input: {
    width: "95%",
    height: 50,
    padding: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "whitesmoke",
  },

  inputDark: {
    width: "95%",
    height: 50,
    padding: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#2c2f33",
    color: "white",
  },

  listHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "black",
    width: "95%",
    padding: 5,
  },

  listHeaderDark: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
    width: "95%",
    padding: 5,
  },

  listItem: {
    width: "100%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    borderBottomColor: "black",
    borderBottomWidth: 0.4,
  },

  listItemDark: {
    width: "95%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 5,
    margin: 10,
    borderRadius: 10,
    borderBottomColor: "white",
    borderBottomWidth: 0.4,
  },

  listItemText: {
    fontSize: 14,
    fontWeight: "500",
  },

  listItemTextDark: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
  },
});
