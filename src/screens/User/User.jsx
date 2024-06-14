import React, { useEffect, useState } from "react";
import { SafeAreaView, View, StyleSheet, Text, FlatList } from "react-native";
import { useSelector } from "react-redux";
import colors from "../../../theme";
import { Image } from "expo-image";
import FollowButton from "./components/FollowButton";
import RenderItem from "./components/RenderItem";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDocs,
  query,
  where,
  collection,
  getDoc,
} from "firebase/firestore";
import getUser from "../../utils/getUser";
import { auth, db } from "../../../firebase";
import { Ionicons } from "@expo/vector-icons";

function User(props) {
  const user = props.route.params.user;
  const theme = useSelector((state) => state.theme.value);
  const [isFollowing, setIsFollowing] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const currentUser = auth.currentUser.uid;

  async function getUsersPastWorkouts() {
    let temp = [];
    let q = query(collection(db, "workouts"), where("creator", "==", user.uid));
    let workouts = await getDocs(q);

    workouts.forEach((workout) => {
      temp.push(workout.data());
    }, []);

    setWorkouts(temp);
  }

  async function checkFollowStatus(uid) {
    let user = await getUser(currentUser);
    let usersFollowed = user.following; // This is an array

    let status = usersFollowed.includes(uid);

    setIsFollowing(status);
  }

  async function followUser() {
    //follow user in db
    setIsFollowing(true);

    await updateDoc(doc(db, "users", currentUser), {
      following: arrayUnion(user.uid),
    });
  }

  async function unfollowUser() {
    //unfollow user in db
    setIsFollowing(false);
    await updateDoc(doc(db, "users", currentUser), {
      following: arrayRemove(user.uid),
    });
  }

  async function handlePress() {
    isFollowing ? unfollowUser() : followUser();
  }

  useEffect(() => {
    getUsersPastWorkouts();
    checkFollowStatus(user.uid);
  }, []);

  return (
    <SafeAreaView
      style={theme === "light" ? styles.container : styles.containerDark}
    >
      <View style={styles.topArea}>
        <Image
          style={styles.image}
          source={user.image}
          alt={`${user.name} profile Image`}
        />
        <Text style={theme === "light" ? styles.username : styles.usernameDark}>
          {user.name}
        </Text>
        <View style={styles.infoView}>
          <Ionicons
            name="location-sharp"
            size={20}
            color={colors.dark.accent}
          />
          <Text style={styles.gymText}>{user.homeGym.name}</Text>
        </View>
      </View>
      <View style={styles.buttonArea}>
        <FollowButton isFollowing={isFollowing} handlePress={handlePress} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={theme === "light" ? styles.title : styles.titleDark}>
          Past Workouts:
        </Text>
      </View>
      <View style={styles.pastworkouts}>
        {workouts.length > 0 ? (
          <FlatList
            style={{ width: "100%" }}
            contentContainerStyle={{ paddingBottom: 500 }}
            data={workouts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <RenderItem item={item} theme={theme} />}
            ItemSeparatorComponent={() => (
              <View style={{ marginVertical: 5 }} />
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noWorkoutContainer}>
            <Text style={styles.noWorkoutText}>
              This user has no past workouts!
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

export default User;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    padding: 5,
  },

  containerDark: {
    flex: 1,
    backgroundColor: colors.dark.background,
    padding: 5,
  },

  topArea: {
    height: "30%",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },

  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },

  usernameDark: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },

  buttonArea: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  titleContainer: {
    width: "100%",
    height: "10%",
    alignItems: "flex-start",
    justifyContent: "center",
  },

  title: {
    color: "black",
    fontSize: 20,
    fontWeight: "700",
  },

  titleDark: {
    color: "white",
    fontSize: "20%",
    fontWeight: "700",
  },

  noWorkoutContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "40%",
  },

  noWorkoutText: {
    fontSize: 14,
    color: colors.dark.accent,
    fontWeight: "800",
  },

  infoView: {
    width: "80%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  gymText: {
    fontSize: 16,
    color: colors.dark.accent,
    marginLeft: 10,
  },

  pastworkouts: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});
