import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import colors from "../../../../theme";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";

function AddExerciseModal({
  modalVisible,
  setModalVisible,
  exercises,
  setExercises,
}) {
  const theme = useSelector((state) => state.theme.value);
  const unit = useSelector((state) => state.unit.value);
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState([
    {
      id: 1,
      weight: "",
      reps: "",
    },
  ]);

  function addSet() {
    setSets([
      ...sets,
      {
        id: sets.length + 1,
        weight: "",
        reps: "",
      },
    ]);
  }

  function addExercise() {
    setExercises([
      ...exercises,
      {
        id: exercises.length + 1,
        name: exerciseName,
        sets: sets,
      },
    ]);
    clearState();
    setModalVisible(false);
  }

  function clearState() {
    setExerciseName("");
    setSets([
      {
        id: 1,
        weight: "",
        reps: "",
      },
    ]);
  }

  //   let set = {
  //     weight: "",
  //     reps: "",
  //   };

  const SetContainer = ({ index }) => {
    const [weight, setWeight] = useState(sets[index].weight);
    const [reps, setReps] = useState(sets[index].reps);

    async function handleUpdate() {
      // Replace the set at the index with the new set
      setSets(
        sets.map((set) => {
          if (set.id === index + 1) {
            set.weight = weight;
            set.reps = reps;
          }
          return set;
        })
      );
    }
    return (
      <View style={styles.setContainer}>
        <View style={styles.tableItem2}>
          <Text
            style={
              theme === "light"
                ? styles.tableHeadingText
                : styles.tableHeadingTextDark
            }
          >
            {index + 1}
          </Text>
        </View>
        <View style={styles.tableItem}>
          <TextInput
            style={theme === "light" ? styles.setInput : styles.setInputDark}
            placeholderTextColor={theme === "light" ? "#000" : "#fff"}
            onBlur={() => handleUpdate()}
            onChangeText={(value) => setWeight(value)}
            keyboardType="numeric"
            returnKeyType="done"
            value={weight}
            placeholder="0"
          />
        </View>

        <View style={styles.tableItem}>
          <TextInput
            style={theme === "light" ? styles.setInput : styles.setInputDark}
            placeholderTextColor={theme === "light" ? "#000" : "#fff"}
            onBlur={() => handleUpdate()}
            onChangeText={(value) => setReps(value)}
            keyboardType="numeric"
            returnKeyType="done"
            value={reps}
            placeholder="0"
          />
        </View>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(!modalVisible)}
      style={{ width: "100%", height: "100%" }}
    >
      <View style={styles.centeredView}>
        <View
          style={theme === "light" ? styles.modalView : styles.modalViewDark}
        >
          <View style={styles.exitView}>
            <Pressable
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Feather
                name="x"
                size={24}
                color={theme === "light" ? colors.dark.accent : "#fff"}
              />
            </Pressable>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Exercise Name"
              style={theme === "light" ? styles.input : styles.inputDark}
              placeholderTextColor={theme === "light" ? "#000" : "#fff"}
              value={exerciseName}
              onChangeText={(value) => setExerciseName(value)}
            />
          </View>
          <View style={styles.tableHeading}>
            <View style={styles.tableItem2}>
              <Text
                style={
                  theme === "light"
                    ? styles.tableHeadingText
                    : styles.tableHeadingTextDark
                }
              >
                Set
              </Text>
            </View>
            <View style={styles.tableItem}>
              <Text
                style={
                  theme === "light"
                    ? styles.tableHeadingText
                    : styles.tableHeadingTextDark
                }
              >
                Weight
              </Text>
            </View>
            <View style={styles.tableItem}>
              <Text
                style={
                  theme === "light"
                    ? styles.tableHeadingText
                    : styles.tableHeadingTextDark
                }
              >
                Reps
              </Text>
            </View>
          </View>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 50 }}
            style={styles.scroll}
          >
            {sets.map((set, index) => {
              return <SetContainer key={index} index={index} id={set.id} />;
            })}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addButton} onPress={() => addSet()}>
              <Text style={styles.addButtonText}>Add Set </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addExercise()}
            >
              <Text style={styles.addButtonText}>Add Exercise </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default AddExerciseModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.light.background,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    width: "100%",
    height: "100%",
  },
  modalViewDark: {
    margin: 20,
    backgroundColor: colors.dark.background,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    width: "100%",
    height: "100%",
  },

  exitView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    width: "100%",
    height: "10%",
  },

  inputContainer: {
    width: "100%",
    height: "5%",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    color: "#000",
  },

  inputDark: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderBottomColor: colors.dark.accent,
    borderBottomWidth: 1,
    color: "#fff",
  },

  setContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "space-evenly",
    flexDirection: "row",
    height: 50,
    width: "100%",
  },

  setInput: {
    width: "100%",
    height: 30,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#000",
  },

  setInputDark: {
    width: "100%",
    height: 30,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderBottomColor: colors.dark.accent,
    borderBottomWidth: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },

  tableHeading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "space-evenly",
    flexDirection: "row",
    width: "100%",
    height: 50,
  },

  tableItem: {
    width: "40%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  tableItem2: {
    width: "20%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  tableHeadingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },

  tableHeadingTextDark: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  scroll: {
    width: "100%",
    height: "50%",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    height: "15%",
    marginTop: 20,
  },

  addButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 40,
    width: "100%",
    backgroundColor: colors.light.accent,
    borderRadius: 10,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "500",
  },
});
