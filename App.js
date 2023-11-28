import AuthNavigation from "./src/navigation/AuthNavigation";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <NavigationContainer>
      <AuthNavigation />
    </NavigationContainer>
  );
}
