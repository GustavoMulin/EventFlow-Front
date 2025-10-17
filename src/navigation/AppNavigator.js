// src/navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { View, Text, TouchableOpacity } from "react-native";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />

        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Registrar" }} />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: "Início",
            headerRight: () => (
              <View style={{ marginRight: 15 }}>
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                  <Text style={{ color: "#007AFF", fontWeight: "bold", fontSize: 16 }}>
                    Ver Perfil
                  </Text>
                </TouchableOpacity>
              </View>
            ),
          })}
        />


        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil" }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
