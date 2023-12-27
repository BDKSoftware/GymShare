import React from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../../../../theme";

function Stats() {
  return (
    <View style={styles.container}>
      <Text style={{ color: colors.dark.accent }}>
        You have no statistics currently
      </Text>
    </View>
  );
}

export default Stats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
