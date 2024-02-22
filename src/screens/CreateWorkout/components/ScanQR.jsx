import React from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera/next";
import { useNavigation } from "@react-navigation/native";

function ScanQR({}) {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [hasScanned, setHasScanned] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    requestPermission();
  }, []);

  function onWorkoutScan(data) {
    if (data) {
      navigation.navigate("Workout", { workoutId: data });
    }
  }

  return (
    <View style={styles.container}>
      {/* <CameraView style={styles.camera} facing={facing}>
        <View style={styles.square}></View>
      </CameraView> */}
    </View>
  );
}

export default ScanQR;

const styles = StyleSheet.create({});
