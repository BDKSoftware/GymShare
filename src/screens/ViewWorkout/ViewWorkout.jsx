import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import colors from "../../../theme";
import RenderItem from "./component/RenderItem";

const ViewWorkout = (props) => {
  let workout = props.route.params.workout;
  let exercises = workout.exercises;
  console.log(workout);
  const theme = useSelector((state) => state.theme.value);
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={theme === "light" ? styles.container : styles.darkContainer}
    >
      <View style={styles.topArea}>
        <Text style={styles.text}>{workout.name}</Text>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.dismiss}>Dismiss</Text>
        </Pressable>
      </View>
      <View style={styles.content}>
        <FlatList
          data={exercises}
          renderItem={({ item }) => <RenderItem item={item} theme={theme} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ViewWorkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.light.background,
  },

  darkContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.dark.background,
  },
  content: {
    alignItems: "center",
  },

  topArea: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 50,
    paddingHorizontal: 20,
  },

  text: {
    fontSize: 15,
    color: colors.dark.accent,
    fontWeight: "bold",
  },

  dismiss: {
    color: "red",
    fontSize: 15,
  },
});
