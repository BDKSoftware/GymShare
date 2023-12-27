import React from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../../../../theme";

function PastWorkouts() {
  return (
    <View style={styles.container}>
      <Text style={{ color: colors.dark.accent }}>
        You have no past workouts
      </Text>
    </View>
  );
}

export default PastWorkouts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
