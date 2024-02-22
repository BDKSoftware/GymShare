import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Pressable,
} from "react-native";
import colors from "../../../../theme";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import Exercises from "../../../data/Exercises";
import { FlatList } from "react-native-gesture-handler";
import CreateExerciseModal from "./CreateExerciseModal";

function AddExerciseModal({
  modalVisible,
  setModalVisible,
  exercises,
  setExercises,
  setAddModal,
}) {
  const theme = useSelector((state) => state.theme.value);
  const unit = useSelector((state) => state.unit.value);
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseGroup, setExerciseGroup] = useState("");

  let exerciseGroups = Object.keys(Exercises);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(!modalVisible)}
      style={{ width: "100%", height: "100%" }}
    >
      <SafeAreaView style={theme === "light" ? styles.modal : styles.modalDark}>
        <View style={styles.topArea}>
          <Pressable style={styles.cancelButton}>
            <Text style={styles.cancelButtonText} numberOfLines={1}>
              Cancel
            </Text>
          </Pressable>
          <Text style={theme === "light" ? styles.title : styles.titleDark}>
            Select Exercise
          </Text>
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => {
                setAddModal(true);
                setModalVisible(false);
              }}
            >
              <Ionicons name="add-sharp" size={28} color={colors.dark.accent} />
            </Pressable>
            <Pressable>
              <Ionicons name="qr-code" size={28} color={colors.dark.accent} />
            </Pressable>
          </View>
        </View>

        {exerciseGroup === "" ? (
          <FlatList
            data={exerciseGroups}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setExerciseGroup(item);
                  }}
                  style={
                    theme === "light" ? styles.exercise : styles.exerciseDark
                  }
                >
                  <Text
                    style={
                      theme === "light" ? styles.itemText : styles.itemTextDark
                    }
                  >
                    {item}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={theme === "light" ? "black" : "white"}
                  />
                </TouchableOpacity>
              );
            }}
            style={{ width: "100%" }}
          />
        ) : (
          <FlatList
            data={Exercises[exerciseGroup]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={
                    theme === "light" ? styles.exercise : styles.exerciseDark
                  }
                  onPress={() => {
                    setExercises([
                      ...exercises,
                      {
                        id: exercises.length + 1,
                        name: item,
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
                    setExerciseGroup("");
                  }}
                >
                  <Text
                    style={
                      theme === "light" ? styles.itemText : styles.itemTextDark
                    }
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
            style={{ width: "100%" }}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

export default AddExerciseModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.light.background,
  },

  modalDark: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.dark.background,
  },

  topArea: {
    width: "100%",
    height: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },

  cancelButton: {
    width: "20%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.light.accent,
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

  buttonContainer: {
    width: "20%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  exercise: {
    width: "100%",
    height: 50,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    borderBottomColor: "black",
    borderBottomWidth: 0.4,
  },

  exerciseDark: {
    width: "100%",
    height: 50,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    borderBottomColor: "grey",
    borderBottomWidth: 0.4,
  },

  itemText: {
    fontSize: 16,
    fontWeight: "400",
    color: "black",
  },

  itemTextDark: {
    fontSize: 16,
    fontWeight: "400",
    color: "white",
  },
});
