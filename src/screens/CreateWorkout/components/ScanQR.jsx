import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
} from "react-native";
//import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import colors from "../../../../theme";
import { useSelector } from "react-redux";

function ScanQR({ modalVisible, setModalVisible, exercises, setExercises }) {
  const [facing, setFacing] = useState("back");
  //   const [permission, requestPermission] = useCameraPermissions();
  const [hasScanned, setHasScanned] = useState(false);
  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);

  //   useEffect(() => {
  //     requestPermission();
  //   }, []);

  function onWorkoutScan(data) {
    if (data) {
      navigation.navigate("Workout", { workoutId: data });
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(!modalVisible)}
      style={{ width: "100%", height: "100%" }}
    >
      <View style={theme === "light" ? styles.container : styles.containerDark}>
        <View style={styles.camera}>
          <View style={styles.square}></View>
        </View>
        <Pressable
          style={styles.cancelScan}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.cancelScanText}>Cancel</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

export default ScanQR;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },

  containerDark: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark.background,
  },
  camera: {
    width: "100%",
    height: "90%",
  },
  square: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: colors.dark.accent,
    borderRadius: 10,
    borderStyle: "dashed",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -100 }, { translateY: -100 }],
  },

  cancelScan: {
    width: "100%",
    height: "10%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark.accent,
  },

  cancelScanText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
});
