import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function ProfileScreen({ route }) {
  const user = route.params?.user;

  return (
    <View style={styles.container}>
      {/* <Image
        source={require("../../assets/logo.png")}
        style={styles.avatar}
      /> */}
      <Text style={styles.name}>{user?.nome || "Usuário"}</Text>
      <Text style={styles.email}>{user?.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
  name: { fontSize: 22, fontWeight: "bold", color: "#007AFF" },
  email: { fontSize: 16, color: "#555" },
});
