import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CreateEventScreen from "../screens/CreateEventScreen";
import EventDetailsScreen from "../screens/EventDetailsScreen";
import EventMapScreen from "../screens/EventMapScreen";



const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen name="Register" component={RegisterScreen} />

        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen
          name="EventMapScreen"
          component={EventMapScreen}
          options={{ title: "Mapa de Eventos" }}
        />

        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />

        <Stack.Screen
          name="EventDetails"
          component={EventDetailsScreen}
          options={{ title: "Detalhes do Evento" }}
        />

        <Stack.Screen name="Profile" component={ProfileScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
