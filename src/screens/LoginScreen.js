import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import api from "../api/api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setSenha] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      Alert.alert("Sucesso", `Bem-vindo, ${user.name || user.email}!`);
      console.log("Token JWT:", token);

      navigation.replace("Home");
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Falha ao fazer login"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EventFlow</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 25, backgroundColor: "#fff" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 40, textAlign: "center", color: "#007AFF" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: "#007AFF", padding: 14, borderRadius: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 18, fontWeight: "bold" },
  link: { textAlign: "center", marginTop: 15, color: "#007AFF", fontWeight: "500" },
});
