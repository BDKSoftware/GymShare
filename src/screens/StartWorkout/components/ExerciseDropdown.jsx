import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Animated,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { useSelector } from "react-redux";

function ExerciseDropdown(props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useSelector((state) => state.theme.value);
  const unit = useSelector((state) => state.unit.value);

  const { exercise } = props;

  useEffect(() => {
    console.log("Exercise: ", exercise);
  }, []);

  const ExpandableView = ({ expanded = false }) => {
    const [height] = useState(new Animated.Value(0));

    const calculatedHeight = exercise.sets.length * 35;

    useEffect(() => {
      if (expanded) {
        Animated.timing(height, {
          toValue: expanded === true ? calculatedHeight : 0,
          duration: 150,
          useNativeDriver: false,
        }).start();
      }
    }, [expanded, height]);

    // console.log('rerendered');

    return (
      <Animated.View
        style={
          theme === "light"
            ? { ...styles.expandedView, height: height }
            : { ...styles.expandedViewDark, height: height }
        }
      >
        {exercise.sets.map((set, index) => {
          return (
            <View style={styles.exerciseRow}>
              <Text>{`Set ${index + 1}`}</Text>
              <Text>{`Reps: ${set.reps}`}</Text>
              <Text>{`Weight: ${set.weight} ${
                unit === "metric" ? "kgs" : "lbs"
              }`}</Text>
            </View>
          );
        })}
      </Animated.View>
    );
  };

  return (
    <View style={styles.app}>
      <TouchableOpacity
        style={theme === "light" ? styles.container : styles.containerDark}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={1}
      >
        <Text
          style={
            theme === "light" ? styles.exerciseText : styles.exerciseTextDark
          }
        >
          {exercise.name}
        </Text>
      </TouchableOpacity>
      <ExpandableView expanded={isExpanded} />
    </View>
  );
}

export default ExerciseDropdown;

const styles = StyleSheet.create({
  app: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginBottom: 10,
  },

  container: {},

  containerDark: {
    width: "95%",
    backgroundColor: "#2c2f33",
    height: 50,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
  },

  exerciseText: {
    fontSize: 20,
    color: "black",
  },

  exerciseTextDark: {
    fontSize: 20,
    color: "white",
  },

  expandedView: {
    backgroundColor: "orange",
    height: 200,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  expandedViewDark: {
    backgroundColor: "#d3d3d3",
    height: 200,
    width: "95%",
    display: "flex",
    justifyContent: "",
    alignItems: "center",
  },

  exerciseRow: {
    width: "100%",
    height: 35,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
});
