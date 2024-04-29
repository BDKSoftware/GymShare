import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from "react-native";

import colors from "../../../theme";
import { useSelector } from "react-redux";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db, storage } from "../../../firebase";
import getUser from "../../utils/getUser";
import TakePhoto from "./components/TakePhoto";
import { Camera, CameraType } from "expo-camera";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { updateDoc, doc } from "firebase/firestore";

function EndWorkout(props) {
  // Workout is the workout object
  // ID is the workout ID in Firebase
  const { workout, id } = props.route.params;
  const theme = useSelector((state) => state.theme.value);
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Camera.requestCameraPermissionsAsync();
    console.log("workout", workout);
  }, [permission]);

  async function handleUpload() {
    let data = await fetch(photo.uri);
    let blob = await data.blob();

    let storageRef = ref(storage, `workoutPhotos/${id}.jpg`);
    await uploadBytesResumable(storageRef, blob).then(async (snapshot) => {
      await getDownloadURL(snapshot.ref).then(async (downloadURL) => {
        await addUrlToDoc(downloadURL);
      });
    });
  }

  async function addUrlToDoc(url) {
    let docRef = doc(db, "workouts", id);
    await updateDoc(docRef, {
      photo: url,
    });
    setLoading(false);
  }

  const finishHandler = () => {
    if (photo !== null) {
      setLoading(true);
      handleUpload().then(() => {
        navigation.navigate("HomeScreen");
      });
    } else {
      navigation.navigate("HomeScreen");
    }
  };

  //get current date
  const date = new Date();

  //get current date in format: mm/dd/yyyy
  const currentDate = `${Months[date.getMonth()]} ${
    date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  }`;

  function handleAddPhotoPress() {
    if (permission.granted) {
      setModal(true);
    }
  }

  useEffect(() => {
    if (user === null) {
      getUser(auth.currentUser.uid).then((user) => setUser(user));
    } else {
      console.log(user);
    }
  }, [user]);

  function Content() {
    return (
      <SafeAreaView
        style={theme === "light" ? styles.container : styles.darkContainer}
      >
        <TakePhoto setPhoto={setPhoto} modal={modal} setModal={setModal} />
        <View style={styles.topArea}>
          <Text style={styles.headerText}>{currentDate}</Text>

          <Pressable onPress={finishHandler}>
            <Text style={styles.finish}>Finish</Text>
          </Pressable>
        </View>
        <View style={styles.iconContainer}>
          <View style={styles.circle}>
            <Ionicons name="checkmark" size={25} color="white" />
          </View>
        </View>
        <Text style={styles.text}>Workout Completed!</Text>
        <View style={styles.dataContainer}>
          {user !== null && (
            <>
              <Text
                style={
                  theme === "light" ? { color: "black" } : { color: "white" }
                }
              >{`You are currently on a ${user.streak} day workout streak! `}</Text>
            </>
          )}
          <Pressable
            style={styles.addPhotoButton}
            onPress={handleAddPhotoPress}
          >
            {photo == null ? (
              <Text style={styles.addPhotoButtonText}>Add a photo</Text>
            ) : (
              <Text style={styles.addPhotoButtonText}>Retake Photo</Text>
            )}
          </Pressable>
          {photo !== null && (
            <>
              <Image style={styles.photo} src={photo.uri} />
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  function ContentLoading() {
    return (
      <View
        style={
          theme === "light" ? styles.loadingStyles : styles.loadingStylesDark
        }
      >
        <ActivityIndicator size={"large"} color={colors.dark.accent} />
        <Text style={styles.loadingText}>Image Uploading</Text>
      </View>
    );
  }

  return loading == false ? <Content /> : <ContentLoading />;
}

export default EndWorkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  darkContainer: {
    flex: 1,
    backgroundColor: colors.dark.background,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  text: {
    fontSize: 20,
    color: colors.dark.accent,
    fontWeight: "500",
  },

  button: {
    width: "80%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light.accent,
    borderRadius: 10,
    marginTop: 20,
  },

  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    padding: 10,
  },

  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    height: "10%",
    width: "100%",
  },

  circle: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: colors.light.accent,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  topArea: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 20,
  },

  headerText: {
    fontSize: 16,
    fontWeight: "500",
  },

  finish: {
    fontSize: 16,
    fontWeight: "600",
    color: "red",
  },

  dataContainer: {
    height: "50%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
  },

  addPhotoButton: {
    width: "80%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light.accent,
    borderRadius: 10,
    marginTop: 20,
  },

  addPhotoButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    padding: 10,
  },

  photo: {
    marginTop: 50,
    width: "90%",
    height: "90%",
    borderRadius: 10,
    borderColor: colors.dark.accent,
    borderWidth: 3,
  },

  loadingStyles: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingStylesDark: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.dark.background,
  },

  loadingText: {
    color: colors.dark.accent,
    fontSize: 16,
    fontWeight: "500",
    marginTop: 20,
  },
});
