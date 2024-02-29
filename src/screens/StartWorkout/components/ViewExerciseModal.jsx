import React from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  Alert,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from "react-native";
import colors from "../../../../theme";
import { useSelector } from "react-redux";

export default function ViewExerciseModal(props) {
  let { exercise, modalVisible, setModalVisible, theme } = props;
  let unit = useSelector((state) => state.unit.value);

  function checkUnit() {
    if (unit === "kg") {
      return "kg";
    } else {
      return "lbs";
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <SafeAreaView style={theme === "light" ? styles.modal : styles.modalDark}>
        <View style={styles.topArea}>
          <Pressable onPress={() => setModalVisible(false)}>
            <Text style={styles.dismissButton}>Dismiss</Text>
          </Pressable>
        </View>

        <View
          style={[styles.container, { height: 50 + exercise.sets.length * 50 }]}
        >
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
                {exercise.name}
              </Text>
            </View>
            {exercise.sets.map((set, index) => {
              return (
                <View key={index} style={styles.setContainer}>
                  <View style={styles.indexIndicator}>
                    <Text style={styles.indexIndicatorText}>{index + 1}</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={
                        theme === "light" ? styles.input : styles.inputDark
                      }
                      keyboardType="numeric"
                      placeholder="0"
                      value={set.weight.toString()}
                      editable={false}
                    />
                    <Text
                      style={
                        theme === "light"
                          ? styles.infoText
                          : styles.infoTextDark
                      }
                    >
                      {checkUnit()}
                    </Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={
                        theme === "light" ? styles.input : styles.inputDark
                      }
                      keyboardType="numeric"
                      placeholder="0"
                      value={set.reps.toString()}
                      editable={false}
                    />
                    <Text
                      style={
                        theme === "light"
                          ? styles.infoText
                          : styles.infoTextDark
                      }
                    >
                      Reps
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

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
    justifyContent: "center",
    alignItems: "flex-end",
    width: "100%",
    height: 50,
    paddingRight: 10,
    marginBottom: 20,
  },

  dismissButton: {
    fontSize: 16,
    color: "red",
  },

  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    marginBottom: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },

  containerDark: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
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
