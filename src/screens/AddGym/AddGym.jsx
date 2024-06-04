import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  Pressable,
  Alert,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

// External Functions
import getNearbyGyms from "../../utils/getNearbyGyms";
import saveHomeGym from "../../utils/saveHomeGym";
import getUser from "../../utils/getUser";

import colors from "../../../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../../firebase";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";


function AddGym() {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);
  const [startingGym, setStartingGym] = useState("No Gym Selected");
  const [selectedGym, setSelectedGym] = useState(null);

  async function getUserLocationFromStorage() {
    let location = await AsyncStorage.getItem("userLocation");

    return JSON.parse(location);
  }

  async function getData() {
    const user = await getUser(auth.currentUser.uid);

    setStartingGym(user.homeGym.name);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text
          style={styles.title}
          numberOfLines={1}
        >{`Current Gym:  ${startingGym}`}</Text>
      </View>

      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          onPress={(data, details = null) => {
            setSelectedGym(details);
          }}
          query={{
            key: "AIzaSyARolGi2KoKY1iFVwhGATk_UWHp2lrMmvo",
            language: "en",
          }}
          numberOfLines={10}
          autoFocus={true}
          returnKeyType={"default"}
          fetchDetails={true}
          styles={{
            container: {
              width: "90%",
            },
          }}
          GooglePlacesSearchQuery={{
            rankby: "distance",
            type: "gym",
          }}
          GoogleReverseGeocodingQuery={{
            rankby: "distance",
            type: "gym",
          }}
          enablePoweredByContainer={false}
          nearbyPlacesAPI="GooglePlacesSearch"
          style={{
            container: {
              width: "100%",
              height: "100%",
            },

            textInput: {
              borderRadius: 10,
            },

            row: {
              borderRadius: 10,
            },
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={() => {
            if (selectedGym === null) {
              alert("Please select a gym first");
              return;
            }

            saveHomeGym(auth.currentUser.uid, selectedGym).then(() => {
              navigation.navigate("User");
            });
          }}
        >
          <Text style={styles.buttonText}>Update Home Gym</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default AddGym;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },

  darkContainer: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },

  titleContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },

  title2: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.light.accent,
  },

  update: {
    fontSize: 16,
    fontWeight: "500",
    color: "red",
  },

  scrollContainer: {
    display: "flex",
    width: "90%",
    marginTop: 20,
  },

  gymContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    height: 60,
    borderBottomColor: colors.dark.accent,
    borderBottomWidth: 1,
    padding: 10,
    marginBottom: 10,
  },

  gymInfoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "85%",
    height: "100%",
  },

  gymName: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },

  gymNameDark: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },

  gymAddress: {
    fontSize: 16,
    color: "#000",
  },

  gymAddressDark: {
    fontSize: 14,
    color: "#fff",
  },

  buttonContainer: {
    position: "absolute",
    bottom: 100,
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    height: "5%",
    marginTop: 20,
  },

  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: 40,
    backgroundColor: colors.dark.accent,
    borderRadius: 10,
  },

  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },

  searchContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "40%",
    marginTop: 20,
  },
});
