import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { TextInput } from "react-native-paper";

import { useSelector } from "react-redux";
import colors from "../../../theme";
import { auth } from "../../../firebase";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { updateEmail, updateProfile } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useNavigation } from "@react-navigation/native";

function EditProfile() {
  const [displayName, setDisplayName] = useState(auth.currentUser.displayName);
  const [photo, setPhoto] = useState(auth.currentUser.photoURL);
  const [email, setEmail] = useState(auth.currentUser.email);
  const [loading, setLoading] = useState(false);
  const storage = getStorage();
  const navigation = useNavigation();

  const theme = useSelector((state) => state.theme.value);

  function updateUserInFirebase(downloadURL) {
    const userRef = doc(db, "users", auth.currentUser.uid);
    updateDoc(userRef, {
      image: downloadURL,
    });
  }

  const uploadImageToFirebaseStorage = async (uri) => {
    try {
      setLoading(true);
      const response = await fetch(uri);
      const blob = await response.blob();
      const myRef = await uploadBytesResumable(
        ref(storage, `profilePictures/${auth.currentUser.uid}`),
        blob
      );

      await getDownloadURL(myRef.ref)
        .then((downloadURL) => {
          setPhoto(downloadURL);
          updateUserInFirebase(downloadURL);
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          })
            .then(() => {
              setLoading(false);
              alert("Profile Picture Updated!");
              navigation.navigate("User");
            })
            .catch((error) => {
              console.log("Error updating profile picture");
              setLoading(false);
            });
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          Alert("Error Uploading Image, Please try again later");
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
      Alert("Error Uploading Image, Please try again later");
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Sorry, we need camera roll permissions to make this work!");
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        let uri = result.assets[0].uri;
        let uploadUri =
          Platform.OS === "ios" ? uri.replace("file://", "") : uri;
        uploadImageToFirebaseStorage(uploadUri);
      }
    }
  };

  function updateUsername() {
    updateProfile(auth.currentUser, {
      displayName: displayName,
    })
      .then(() => {
        alert("Username Updated!");
      })
      .catch((error) => {
        console.log("Error updating username");
      });
  }

  function updateUserEmail() {
    updateEmail(auth.currentUser, email)
      .then(() => {
        alert("Email Updated!");
      })
      .catch((error) => {
        console.log("Error updating email");
      });
  }

  function saveChanges() {
    if (displayName !== auth.currentUser.displayName) {
      updateUsername();
    }

    if (email !== auth.currentUser.email) {
      updateUserEmail();
    }

    if (
      displayName === auth.currentUser.displayName &&
      email === auth.currentUser.email
    ) {
      alert("No changes were made");
      return;
    }

    navigation.goBack();
  }
  return (
    <SafeAreaView
      style={theme === "light" ? styles.container : styles.containerDark}
    >
      <Modal visible={loading} animationType="slide" transparent={true}>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <View style={theme === "light" ? styles.modal : styles.modalDark}>
            <ActivityIndicator size="large" color={colors.dark.accent} />
            <Text style={{ color: colors.dark.accent, marginTop: 20 }}>
              Uploading Image...
            </Text>
          </View>
        </View>
      </Modal>
      <View style={styles.titleContainer}>
        <View style={styles.iconContainer}>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme === "light" ? "#000" : "#fff"}
            />
          </Pressable>
        </View>
        <View style={styles.titleTextContainer}>
          <Text style={theme === "light" ? styles.title : styles.titleDark}>
            {" "}
            Edit Profile
          </Text>
        </View>
      </View>
      <View style={styles.imageContainer}>
        <Image source={photo} style={styles.image} />
        <TouchableOpacity style={styles.uploadButton} onPress={openCamera}>
          <Text style={styles.imageName}>Upload new Image</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainers}>
        <TextInput
          label={
            <Text
              style={
                theme === "light"
                  ? { color: colors.light.accent }
                  : { color: colors.dark.accent }
              }
            >
              Username
            </Text>
          }
          value={displayName}
          onChangeText={(text) => setDisplayName(text)}
          style={theme === "light" ? styles.input : styles.inputDark}
          mode="outlined"
          activeOutlineColor={colors.light.accent}
          outlineColor={colors.light.accent}
          textColor={theme === "light" ? "#000" : "#fff"}
        />
        <TextInput
          label={
            <Text
              style={
                theme === "light"
                  ? { color: colors.light.accent }
                  : { color: colors.dark.accent }
              }
            >
              Email
            </Text>
          }
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={theme === "light" ? styles.input : styles.inputDark}
          mode="outlined"
          activeOutlineColor={colors.light.accent}
          outlineColor={colors.light.accent}
          textColor={theme === "light" ? "#000" : "#fff"}
        />
      </View>
      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },

  containerDark: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },

  titleContainer: {
    width: "100%",
    height: "10%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },

  title: {
    fontSize: 20,
    color: "#000",
    fontWeight: "600",
  },

  titleDark: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },

  titleTextContainer: {
    width: "90%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: "10%",
  },

  iconContainer: {
    width: "10%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  imageContainer: {
    width: "100%",
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },

  imageName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.light.accent,
  },

  uploadButton: {
    width: "40%",
    height: 40,
    borderColor: colors.dark.accent,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  inputContainers: {
    width: "100%",
    height: "20%",
    padding: 20,
  },

  input: {
    width: "100%",
    height: 60,
    backgroundColor: colors.light.background,
    borderRadius: 10,
    marginBottom: 20,
  },

  inputDark: {
    width: "100%",
    height: 60,
    backgroundColor: colors.dark.background,
    borderRadius: 10,
    marginBottom: 20,
  },

  saveContainer: {
    width: "100%",
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
  },

  saveButton: {
    width: "60%",
    height: 50,
    backgroundColor: colors.light.accent,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  saveText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },

  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },

  modalDark: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors.dark.background,
  },
});
