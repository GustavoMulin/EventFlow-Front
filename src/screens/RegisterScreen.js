import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import api from "../api/api";

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleRegister = async () => {
    try {
      const response = await api.post("/auth/register", { nome, email, senha });
      Alert.alert("Sucesso", response.data.message || "Usuário registrado!");
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Falha ao registrar usuário."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="E-mail" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 25, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 40, textAlign: "center", color: "#007AFF" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: "#007AFF", padding: 14, borderRadius: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 18, fontWeight: "bold" },
  link: { textAlign: "center", marginTop: 15, color: "#007AFF", fontWeight: "500" },
});
