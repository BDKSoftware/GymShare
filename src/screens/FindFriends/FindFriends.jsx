import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import colors from "../../../theme";
import { FontAwesome } from "@expo/vector-icons";
import { auth, db } from "../../../firebase";
import { query, where, collection, getDocs } from "firebase/firestore";

const FindFriends = () => {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  async function getUsers() {
    let temp = [];
    let usersRef = collection(db, "users");
    let q = query(usersRef, where("uid", "!=", auth.currentUser.uid));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      temp.push(doc.data());
    });

    setUsers(temp);
  }

  useEffect(() => {
    let filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(search.toLocaleLowerCase())
    );
    setUsers(filteredUsers);
  }, [search]);

  useEffect(() => {
    getUsers();
  }, []);

  function UserCard({ user }) {
    let tempUser = user.item;
    return (
      <View style={theme === "light" ? styles.userCard : styles.userCardDark}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.profileImage}
            source={{ uri: tempUser.image }}
            alt={`${tempUser.name}'s profile picture`}
          />
        </View>
        <View style={styles.userInfo}>
          <Text
            style={theme === "light" ? styles.userName : styles.userNameDark}
          >
            {tempUser.name}
          </Text>
          <Text style={theme === "light" ? styles.userGym : styles.userGymDark}>
            {tempUser.homeGym.name}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={theme === "light" ? styles.lightContainer : styles.darkContainer}
    >
      <View style={styles.search}>
        <FontAwesome
          name="search"
          size={20}
          color={colors.dark.accent}
          style={{ width: "10%" }}
        />
        <View style={{ width: "90%" }}>
          <TextInput
            value={search}
            onChangeText={(value) => {
              setSearch(value);
            }}
            style={theme === "light" ? styles.input : styles.inputDark}
            placeholder="Search Users"
            clearButtonMode="always"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>
      {users.length >= 1 ? (
        <FlatList
          data={users}
          renderItem={(user) => <UserCard user={user} />}
          style={styles.usersContainer}
          contentContainerStyle={{
            justifyContent: "center",
          }}
        />
      ) : (
        <View style={styles.noUsers}>
          <Text
            style={
              theme == "light" ? styles.noUsersText : styles.noUsersTextDark
            }
          >
            No Users Available
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default FindFriends;

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

  usersContainer: {
    width: "90%",
    height: "50%",
    display: "flex",
  },

  search: {
    width: "95%",
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  input: {
    height: "100%",
    width: "100%",
    fontSize: 18,
    color: "black",
  },

  inputDark: {
    height: "100%",
    width: "100%",
    fontSize: 18,
    color: "white",
  },

  userCard: {},

  userCardDark: {
    width: "100%",
    height: 75,
    borderColor: colors.dark.accent,
    borderWidth: 1,
    backgroundColor: "#2c2f33",
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },

  userName: {},

  userNameDark: {
    fontSize: 18,
    color: "whitesmoke",
    fontWeight: "600",
  },

  userGym: {},

  userGymDark: {
    marginTop: 5,
    fontSize: 16,
    color: "whitesmoke",
    fontWeight: "400",
  },

  imageContainer: {
    width: "20%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  profileImage: {
    height: "80%",
    width: "80%",
    borderRadius: 50,
    resizeMode: "cover",
  },

  userInfo: {
    width: "50%",
    height: "100%",
    padding: 10,
    justifyContent: "center",
  },
});
