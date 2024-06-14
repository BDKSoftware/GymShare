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
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import colors from "../../../theme";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import Logo from "../../../assets/logo.png";

import { auth, db } from "../../../firebase";
import getUser from "../../utils/getUser";
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
  const isFocused = useIsFocused();
  const theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getData() {
    const user = await getUser(auth.currentUser.uid);
    getWorkouts(user);
    return;
  }

  async function getWorkouts(user) {
    if (user.following.length == 0) {
      setWorkouts([]);
      setLoading(false);
      return;
    }
    let temp = [];
    let workoutsRef = collection(db, "workouts");
    let q = query(workoutsRef, where("creator", "in", [...user.following]));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setWorkouts([]);
      setLoading(false);
      return;
    }

    querySnapshot.forEach((doc) => {
      temp.push(doc.data());
    });

    let sortedWorkouts = temp.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date) - new Date(a.date);
    });

    setWorkouts(sortedWorkouts);
    setLoading(false);
    return;
  }

  useEffect(() => {
    getData();
  }, [isFocused]);

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

      if (exercises == undefined) {
        return 0;
      }

      exercises.forEach((exercise) => {
        sets += exercise.sets.length;
      });

      return sets;
    }

    function getMostCommonGroup(workout) {
      let tags = [];

      let exercises = workout.exercises;

      exercises.forEach((exercise) => {
        if (!tags.includes(exercise.group)) {
          tags.push(exercise.group);
        }
      });

      if (tags.length < 1) {
        return null;
      }

      if (tags.length < 2) {
        return (
          <View style={styles.setContainer}>
            <Text style={styles.setText}>{tags[0]}</Text>
          </View>
        );
      }

      if (tags.length >= 2) {
        return (
          <>
            <View style={styles.setContainer}>
              <Text style={styles.setText}>{tags[0]}</Text>
            </View>
            <View style={styles.setContainer}>
              <Text style={styles.setText}>{tags[1]}</Text>
            </View>
          </>
        );
      }
    }

    useEffect(() => {
      getUserName();
    }, []);

    return (
      user !== null &&
      workout.photo !== "" && (
        <>
          <Pressable key={key} onPress={() => handleCardPress(workout)}>
            <View style={theme === "light" ? styles.card : styles.cardDark}>
              <View style={styles.cardTopArea}>
                <View style={styles.cardUserArea}>
                  <Image
                    placeholder={Logo}
                    source={{ uri: user.image }}
                    style={styles.userImage}
                  />
                  <View>
                    <Text style={styles.userName}>{user.name}</Text>
                  </View>
                </View>
                <View style={styles.dateContainer}>
                  <Text style={styles.date}>{workoutDate}</Text>
                </View>
              </View>
              <View style={styles.body}>
                <View style={styles.bodyContent}>
                  <View style={styles.bodyContentTextArea}>
                    <Text style={styles.bodyTitle}>{workout.name}</Text>
                    <Text style={styles.bodySubText}>{`${
                      workout.exercises.length
                    } Exercises, ${calculateSets(workout)} Sets`}</Text>
                  </View>
                  <View style={styles.bodyContentTagsArea}>
                    {getMostCommonGroup(workout)}
                  </View>
                </View>
                <View style={styles.bodyImage}>
                  <Image source={workout.photo} style={styles.workoutPhoto} />
                </View>
              </View>
            </View>
          </Pressable>
          <View style={theme === "light" ? styles.line : styles.lineDark} />
        </>
      )
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

      {workouts.length > 0 && loading == false ? (
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
      ) : loading == false ? (
        <View style={styles.noWorkoutsContainer}>
          <Text style={styles.noWorkouts}>
            You currently do not follow any users, use the search function above
            to find your friends!
          </Text>
        </View>
      ) : (
        <View style={styles.noWorkoutsContainer}>
          <ActivityIndicator color={colors.dark.accent} size="large" />
        </View>
      )}
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
    marginBottom: 10,
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
    width: "95%",
    padding: 2,
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
    height: 150,
    overflow: "hidden",
  },

  cardDark: {
    width: "100%",
    height: 150,
    overflow: "hidden",
  },

  cardTopArea: {
    width: "100%",
    height: "30%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
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

  nameContainer: {
    width: 100,
    height: 30,
    backgroundColor: colors.dark.accent,
    position: "absolute",
    bottom: 50,
    right: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "white",
    borderWidth: 1,
  },

  nameText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  setContainer: {
    width: "30%",
    height: 30,
    backgroundColor: colors.dark.accent,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    padding: 5,
    overflow: "hidden",
  },

  setText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },

  userImage: {
    height: 30,
    width: 30,
    borderRadius: 100,
    marginRight: 10,
  },

  cardUserArea: {
    width: "30%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingLeft: 10,
  },

  workoutName: {
    color: colors.dark.accent,
    fontWeight: "500",
    fontStyle: "italic",
  },

  userName: {
    color: colors.dark.accent,
    fontWeight: "700",
  },

  cardFooter: {
    position: "absolute",
    bottom: 0,
    height: "5%",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 10,
  },

  dateContainer: {
    width: "30%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  date: {
    color: colors.dark.accent,
    fontSize: 14,
    fontWeight: "400",
  },

  body: {
    width: "100%",
    height: "70%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  postImage: {
    width: "98%",
    height: "100%",
    borderRadius: 10,
  },

  bodyContent: {
    width: "70%",
    height: "100%",
  },

  bodyImage: {
    width: "30%",
    height: "100%",

    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },

  workoutPhoto: {
    height: "90%",
    width: "90%",
    borderRadius: 10,
  },

  bodyTitle: {
    color: colors.dark.accent,
    fontWeight: "700",
    padding: 5,
  },

  bodySubText: {
    color: colors.dark.accent,
    fontWeight: "500",
    padding: 5,
  },

  bodyContentTextArea: {
    height: "50%",
    width: "100%",
  },

  bodyContentTagsArea: {
    height: "50%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    padding: 5,
  },

  lineDark: {
    marginVertical: 20,
    height: 1,
    borderColor: "#2c2f33",
    borderWidth: 0.2,
  },

  line: {
    marginVertical: 10,
    height: 1,
    borderColor: "lightgrey",
    borderWidth: 0.2,
  },

  noWorkoutsContainer: {
    flex: 1,
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
  },

  noWorkouts: {
    alignSelf: "center",
    justifyContent: "center",
    color: colors.dark.accent,
    textAlign: "center",
  },
});
