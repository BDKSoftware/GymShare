import AuthNavigation from "./src/navigation/AuthNavigation";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import themeReducer from "./src/store/themeSlice";
import { AuthProvider } from "./src/context/AuthContext";

const reducer = combineReducers({
  theme: themeReducer,
});

const store = configureStore({ reducer });

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <NavigationContainer>
          <AuthNavigation />
        </NavigationContainer>
      </AuthProvider>
    </Provider>
  );
}
