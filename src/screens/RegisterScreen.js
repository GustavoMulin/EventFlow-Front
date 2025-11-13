import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import api from "../api/api";

export default function RegisterScreen({ navigation }) {
  const [name, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setSenha] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Atenção", "Preencha todos os campos!");
      return;
    }

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   Alert.alert("Erro", "Digite um e-mail válido (exemplo@email.com)");
    //   return;
    // }

    // if (password.length < 8) {
    //   setPasswordError("A senha deve ter no mínimo 8 caracteres.");
    //   return;
    // } else {
    //   setPasswordError("");
    // }

    try {
      if (!name || !email || !password) {
        return Alert.alert("Erro", "Preencha todos os campos!");
      }

      const response = await api.post("/auth/register", { name, email, password });

      Alert.alert("Sucesso", response.data.message || "Usuário registrado com sucesso!", [
        {
          text: "Ir para Login",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } catch (error) {
      console.log("Erro no registro:", error.response?.data || error.message);
      const message = error.response?.data?.message || "Não foi possível registrar o usuário.";
      Alert.alert("Erro", message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Criar Conta</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={[styles.input, passwordError ? styles.inputError : null]}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setSenha(text);
            if (text.length >= 8) setPasswordError("");
          }}
        />

        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Já tem conta? Faça login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    color: "#007AFF",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    padding: 12,
    marginBottom: 15,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: -10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    width: "80%",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { marginTop: 15, color: "#007AFF" },
});
