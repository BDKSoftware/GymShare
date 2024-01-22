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

  useEffect(() => {
    console.log(sets);
  }, [sets]);

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

    async function deleteSet(index) {
      if (sets.length === 1) return;
      // Remove the set from the index, and change id's of the rest of the sets
      let newSets = sets.filter((set) => set.id !== index + 1);
      newSets = newSets.map((set, index) => {
        set.id = index + 1;
        return set;
      });
      setSets(newSets);
    }

    return (
      <View style={styles.setContainer}>
        <View style={styles.indexContainer}>
          <Text
            style={theme === "light" ? styles.setNumber : styles.setNumberDark}
          >
            {index + 1}
          </Text>
        </View>
        <View style={styles.weightContainer}>
          <TextInput
            style={theme === "light" ? styles.formInput : styles.formInputDark}
            placeholderTextColor={theme === "light" ? "#000" : "#fff"}
            onBlur={() => handleUpdate()}
            onChangeText={(value) => setWeight(value)}
            keyboardType="numeric"
            returnKeyType="done"
            value={weight}
            placeholder="0"
          />
          <Text
            style={theme === "light" ? styles.unitText : styles.unitTextDark}
          >
            {unit === "imperial" ? "kg" : "lb"}
          </Text>
        </View>
        <View style={styles.repsContainer}>
          <TextInput
            style={theme === "light" ? styles.formInput : styles.formInputDark}
            placeholderTextColor={theme === "light" ? "#000" : "#fff"}
            onBlur={() => handleUpdate()}
            onChangeText={(value) => setReps(value)}
            keyboardType="numeric"
            returnKeyType="done"
            value={reps}
            placeholder="0"
          />
          <Text
            style={theme === "light" ? styles.unitText : styles.unitTextDark}
          >
            Reps
          </Text>
        </View>
        <View style={styles.deleteContainer}>
          <Pressable onPress={() => deleteSet(index)}>
            <Feather name="x-circle" size={20} color={"red"} />
          </Pressable>
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
          <View
            style={theme === "light" ? styles.container : styles.containerDark}
          >
            <View style={styles.titleContainer}>
              <TextInput
                placeholder="Enter Exercise Name"
                value={exerciseName}
                onChangeText={(value) => {
                  setExerciseName(value);
                }}
                style={theme === "light" ? styles.input : styles.inputDark}
                placeholderTextColor={
                  theme === "light" ? "#000" : colors.dark.accent
                }
              />
            </View>
            <View style={styles.setsContainer}>
              {sets.map((set, index) => {
                return <SetContainer key={index} index={index} id={set.id} />;
              })}
              {sets.length < 12 && (
                <View style={styles.addSetContainer}>
                  <Pressable style={styles.addSet} onPress={() => addSet()}>
                    <Feather name="plus" size={20} color={colors.dark.accent} />
                    <Text style={styles.addSetText}>Add Set</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addExercise()}
            >
              <Text style={styles.addButtonText}>Add Exercises</Text>
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
    padding: 15,
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

  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "75%",
    borderRadius: 10,
    backgroundColor: "#fff",
  },

  containerDark: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "75%",
    borderRadius: 10,
    backgroundColor: "#2c2f33",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "10%",
  },

  addButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 50,
    width: "80%",
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: colors.light.accent,
    borderRadius: 10,
  },

  addButtonText: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.light.background,
  },

  titleContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    height: "10%",
    paddingHorizontal: 15,
  },

  inputDark: {
    width: "100%",
    height: 30,
    backgroundColor: "#2c2f33",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#fff",
    borderBottomColor: colors.dark.accent,
    borderBottomWidth: 1,
  },

  input: {
    width: "100%",
    height: 30,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#000",
    borderBottomColor: colors.dark.accent,
    borderBottomWidth: 1,
  },

  setsContainer: {
    width: "100%",
    height: "90%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  setContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    height: 50,
    paddingHorizontal: 15,
    flexDirection: "row",
  },

  indexContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "20%",
    height: "100%",
  },

  setNumber: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },

  setNumberDark: {
    fontSize: 16,
    fontWeight: "400",
    color: "#fff",
  },

  weightContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "30%",
    height: "100%",
    paddingHorizontal: 15,
  },

  formInput: {
    height: 30,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 5,
    fontSize: 16,
    color: "#000",
  },

  formInputDark: {
    height: 30,
    backgroundColor: "#2c2f33",
    borderRadius: 10,
    paddingHorizontal: 5,
    fontSize: 16,
    color: "#fff",
  },

  unitText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },

  unitTextDark: {
    fontSize: 16,
    fontWeight: "400",
    color: "#fff",
  },

  repsContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "30%",
    height: "100%",
  },

  addSetContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    height: 50,
    paddingHorizontal: 15,
  },

  addSet: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    width: "25%",
    height: "100%",
  },

  addSetText: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.dark.accent,
  },

  deleteContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    width: "10%",
    height: "100%",
  },
});
