import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import colors from "../../../theme";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import Logo from "../../../assets/logo.png";

import { auth, db } from "../../../firebase";
import {
  query,
  where,
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

function Explore() {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getWorkouts() {
    let temp = [];
    let workoutsRef = collection(db, "workouts");
    let q = query(workoutsRef, where("creator", "!=", auth.currentUser.uid));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      temp.push(doc.data());
    });

    let sortedWorkouts = temp.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date) - new Date(a.date);
    });

    setWorkouts(sortedWorkouts);
  }

  useEffect(() => {
    getWorkouts();
  }, []);

  function handleFriendPress() {
    navigation.navigate("FindFriends");
  }

  function WorkoutCard({ workout }, key) {
    let workoutDate = new Date(workout.date).toDateString();
    const [user, setUser] = useState(null);

    function handleCardPress(workout) {
      navigation.navigate("ViewWorkout", {
        workout: workout,
      });
    }

    async function getUserName() {
      let docRef = doc(db, "users", workout.creator);
      let userDoc = await getDoc(docRef);

      if (userDoc.exists) {
        setUser(userDoc.data());
      }
    }

    function calculateSets(workout) {
      let sets = 0;
      let exercises = workout.exercises;

      exercises.forEach((exercise) => {
        sets += exercise.sets.length;
      });

      return sets;
    }

    useEffect(() => {
      getUserName();
    }, []);

    return (
      <Pressable key={key} onPress={() => handleCardPress(workout)}>
        <View style={theme === "light" ? styles.card : styles.cardDark}>
          <View style={styles.cardTopArea}>
            <Text
              style={theme === "light" ? styles.cardName : styles.cardNameDark}
            >
              {workout.name}
            </Text>
            {user !== null && (
              <Text style={styles.createdBy}>{`Created by ${user.name}`}</Text>
            )}
          </View>
          <View style={styles.cardDetailsArea}>
            <Image
              style={styles.image}
              source={{ uri: workout.photo }}
              placeholder={Logo}
              contentFit="cover"
              placeholderContentFit="contain"
            />
            <View style={styles.setsContainer}>
              <Text style={styles.setText}>{`${calculateSets(
                workout
              )} Sets`}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView
      style={theme === "light" ? styles.lightContainer : styles.darkContainer}
    >
      <View style={styles.topArea}>
        <Text style={theme === "light" ? styles.title : styles.titleDark}>
          Explore
        </Text>
        <Pressable onPress={handleFriendPress} style={styles.iconContainer}>
          <FontAwesome name="search" size={20} color="white" />
        </Pressable>
      </View>
      <View style={styles.dataContainer}>
        <FlatList
          data={workouts}
          keyExtractor={(workout) => workout.id}
          renderItem={(workout) => (
            <WorkoutCard workout={workout.item} key={workout.item.id} />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

export default Explore;

const styles = StyleSheet.create({
  lightContainer: {
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

  topArea: {
    height: "5%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: colors.dark.accent,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },

  dataContainer: {
    height: "95%",
    width: "100%",
    padding: 5,
  },

  title: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },

  titleDark: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  card: {
    width: "100%",
    height: 100,
    borderColor: colors.dark.accent,
    borderWidth: 3,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: "white",
    overflow: "hidden",
  },

  cardDark: {
    width: "100%",
    height: 250,
    borderColor: colors.dark.accent,
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 5,
    overflow: "hidden",
  },

  cardTopArea: {
    width: "100%",
    height: "20%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.dark.accent,
    paddingHorizontal: 10,
  },

  cardDetailsArea: {
    width: "100%",
    height: "80%",
  },

  cardName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  cardNameDark: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  cardDate: {
    color: "grey",
    fontSize: 14,
  },

  cardDateDark: {
    color: "grey",
    fontSize: 14,
  },

  createdBy: {
    color: "white",
    fontSize: 14,
    fontStyle: "italic",
  },

  exercise: {
    color: "black",
    fontSize: 12,
    marginBottom: 3,
  },

  exerciseDark: {
    color: "white",
    fontSize: 12,
    marginBottom: 3,
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    backgroundColor: "#2c2f33",
  },

  setsContainer: {
    width: 60,
    height: 30,
    backgroundColor: colors.dark.accent,
    position: "absolute",
    bottom: 10,
    right: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "white",
    borderWidth: 1,
  },

  setText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
