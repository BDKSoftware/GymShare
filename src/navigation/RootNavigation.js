import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import colors from "../../theme";

import HomeNavigation from "./HomeNavigation";
import Social from "../screens/Social/Social";
import ProfileNavigation from "./ProfileNavigation";

const Tabs = createBottomTabNavigator();

const RootNavigation = () => {
  const theme = useSelector((state) => state.theme.value);

  return (
    <Tabs.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        unmountOnBlur: true,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          backgroundColor: theme == "light" ? "#ffffff" : "#2c2f33",
          borderTopWidth: 0.25,
          borderTopColor: "grey",
        },
      }}
    >
      <Tabs.Screen
        name="Social"
        component={Social}
        options={{
          // unmountOnBlur: true,
          gestureEnabled: false,
          fullScreenGestureEnabled: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="users" size={24} color={color} />
          ),
          tabBarActiveTintColor:
            theme === "light" ? colors.light.accent : colors.dark.accent,
          tabBarInactiveTintColor: theme === "light" ? "grey" : "#fff",
        }}
      />
      <Tabs.Screen
        name="Home"
        component={HomeNavigation}
        options={{
          // unmountOnBlur: true,
          gestureEnabled: false,
          fullScreenGestureEnabled: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={24} color={color} />
          ),
          tabBarActiveTintColor:
            theme === "light" ? colors.light.accent : colors.dark.accent,
          tabBarInactiveTintColor: theme === "light" ? "grey" : "#fff",
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileNavigation}
        options={{
          // unmountOnBlur: true,
          gestureEnabled: false,
          fullScreenGestureEnabled: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-circle" size={24} color={color} />
          ),
          tabBarActiveTintColor:
            theme === "light" ? colors.light.accent : colors.dark.accent,
          tabBarInactiveTintColor: theme === "light" ? "grey" : "#fff",
        }}
      />
    </Tabs.Navigator>
  );
};

export default RootNavigation;
