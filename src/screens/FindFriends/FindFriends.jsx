import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import colors from "../../../theme";
import { FontAwesome } from "@expo/vector-icons";
import { auth, db } from "../../../firebase";
import { query, where, collection, getDocs } from "firebase/firestore";
import filter from "lodash.filter";

const FindFriends = () => {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.theme.value);
  const [data, setData] = useState([]);
  const [fullData, setFullData] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  async function getUsers() {
    let temp = [];
    let usersRef = collection(db, "users");
    let q = query(usersRef, where("uid", "!=", auth.currentUser.uid));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      temp.push(doc.data());
    });

    setFullData(temp);
    setData(temp);
  }

  function handleSearch(query) {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const filteredData = filter(fullData, (user) => {
      return contains(user, formattedQuery);
    });
    setData(filteredData);
  }

  function contains(user, query) {
    let formattedName = user.name.toLowerCase();
    if (formattedName.includes(query)) {
      return true;
    }

    return false;
  }

  function handleUserPress(user) {
    navigation.navigate("User", {
      user: user,
    });
  }

  useEffect(() => {
    getUsers();
  }, []);

  function UserCard({ user }) {
    return (
      <Pressable onPress={() => handleUserPress(user)}>
        <View style={styles.userCard}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.profileImage}
              source={{ uri: user.image }}
              alt={`${user.name}'s profile picture`}
              contentFit="cover"
              accessible={true}
              cachePolicy="memory-disk"
            />
          </View>
          <View style={styles.userInfo}>
            <Text
              style={theme === "light" ? styles.userName : styles.userNameDark}
            >
              {user.name}
            </Text>
            <Text
              style={theme === "light" ? styles.userGym : styles.userGymDark}
            >
              {user.homeGym.name}
            </Text>
          </View>
        </View>
      </Pressable>
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
            value={searchQuery}
            onChangeText={(query) => handleSearch(query)}
            style={theme === "light" ? styles.input : styles.inputDark}
            placeholder="Search Users"
            clearButtonMode="always"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={"grey"}
          />
        </View>
      </View>
      {data.length >= 1 ? (
        <FlatList
          data={data}
          keyExtractor={(user) => user.uid}
          renderItem={(user) => (
            <UserCard user={user.item} key={user.item.uid} />
          )}
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

  userCard: {
    width: "100%",
    height: 75,

    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },

  userName: {
    fontSize: 18,
    color: "black",
    fontWeight: "600",
  },

  userNameDark: {
    fontSize: 18,
    color: "whitesmoke",
    fontWeight: "600",
  },

  userGym: {
    marginTop: 5,
    fontSize: 16,
    color: "grey",
    fontWeight: "400",
  },

  userGymDark: {
    marginTop: 5,
    fontSize: 16,
    color: "grey",
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
