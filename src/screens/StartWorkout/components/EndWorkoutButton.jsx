import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import colors from "../../../../theme";

function EndWorkoutButton({ onPress }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const getMinutes = (ms) =>
    ("0" + Math.floor((ms / 60 / 1000) % 60)).slice(-2);
  const getSeconds = (ms) => ("0" + Math.floor((ms / 1000) % 60)).slice(-2);
  const getMilliSeconds = (ms) => ("0" + ((ms / 10) % 100)).slice(-2);

  const formatTime = (ms) => `${getMinutes(ms)}:${getSeconds(ms)}`;

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => setTime((time) => time + 10), 10);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{`End Workout : ${formatTime(
        time
      )}`}</Text>
    </TouchableOpacity>
  );
}

export default EndWorkoutButton;

const styles = StyleSheet.create({
  button: {
    width: "80%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light.accent,
    borderRadius: 10,
  },

  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    padding: 10,
  },
});
