import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://192.168.0.11:3000/api/categories";

export default function EditCategoryScreen({ route, navigation }) {
    const { categoryId, categoryName } = route.params;
    const [name, setName] = useState(categoryName || "");

    const handleUpdate = async () => {
        if (!name.trim()) {
            Alert.alert("Erro", "Por favor, insira o novo nome da categoria.");
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");
            await axios.put(
                `${API_URL}/${categoryId}`,
                { name },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Alert.alert("Sucesso", "Categoria atualizada!");
            navigation.goBack();
        } catch (error) {
            console.error("Erro ao atualizar categoria:", error.response?.data || error.message);
            Alert.alert("Erro", "Não foi possível atualizar a categoria.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Editar Categoria</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Digite o novo nome"
            />
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Salvar Alterações</Text>
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
