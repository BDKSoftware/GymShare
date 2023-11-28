import React from "react";
import { Text, SafeAreaView } from "react-native";
import { auth } from "../../../firebase";

function Home() {
  let displayName = auth.currentUser.email;

  return (
    <SafeAreaView>
      <Text>{displayName}</Text>
    </SafeAreaView>
  );
}

export default Home;
