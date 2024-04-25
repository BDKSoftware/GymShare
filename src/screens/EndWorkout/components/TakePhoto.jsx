import { Camera, CameraType } from "expo-camera";
import { useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TakePhoto({ setPhoto, modal, setModal }) {
  const [type, setType] = useState(CameraType.back);
  let cameraRef = useRef();

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }
  async function takePicture() {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
    setModal(false);
  }

  return (
    <Modal style={styles.container} visible={modal}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.topButton} onPress={toggleCameraType}>
            <MaterialCommunityIcons
              name="camera-flip"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <MaterialCommunityIcons name="camera" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </Camera>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    height: 100,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  topButtonContainer: {
    position: "absolute",
    top: 50,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    width: "95%",
  },

  topButton: {
    position: "absolute",
    left: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "whitesmoke",
    height: 50,
    width: 50,
    borderRadius: 50,
  },

  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "whitesmoke",
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
