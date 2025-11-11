import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://12.0.0.100:3000/api/categories";

export default function CreateCategoryScreen({ navigation }) {
    const [name, setName] = useState("");

    const handleCreate = async () => {
        if (!name.trim()) {
            Alert.alert("Erro", "Por favor, insira o nome da categoria.");
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");
            await axios.post(
                API_URL,
                { name },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Alert.alert("Sucesso", "Categoria criada!");
            navigation.navigate("CategoryList");
        } catch (error) {
            console.error("Erro ao criar categoria:", error.response?.data || error.message);
            Alert.alert("Erro", "Não foi possível criar a categoria.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nome da Categoria</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: Música, Tecnologia..."
                value={name}
                onChangeText={setName}
            />
            <TouchableOpacity style={styles.button} onPress={handleCreate}>
                <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 20 },
    label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
