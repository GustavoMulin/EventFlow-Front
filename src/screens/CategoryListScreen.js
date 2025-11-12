import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://192.168.0.11:3000/api/categories";

export default function CategoryListScreen({ navigation }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(API_URL);
            setCategories(response.data);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
            Alert.alert("Erro", "Não foi possível carregar as categorias.");
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = await AsyncStorage.getItem("token");
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert("Sucesso", "Categoria excluída!");
            fetchCategories();
        } catch (error) {
            console.error("Erro ao excluir categoria:", error);
            Alert.alert("Erro", "Falha ao excluir categoria.");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("CreateCategory")}
            >
                <Text style={styles.addButtonText}>+ Nova Categoria</Text>
            </TouchableOpacity>

            <FlatList
                data={categories}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item.name}</Text>

                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() =>
                                    navigation.navigate("EditCategory", {
                                        categoryId: item._id,
                                        categoryName: item.name,
                                    })
                                }
                            >
                                <Text style={styles.actionText}>Editar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDelete(item._id)}
                            >
                                <Text style={[styles.actionText, { color: "red" }]}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    addButton: {
        backgroundColor: "#007AFF",
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: "center",
    },
    addButtonText: { color: "#fff", fontWeight: "bold" },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#f5f5f5",
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    itemText: { fontSize: 16, fontWeight: "500" },
    actions: { flexDirection: "row", gap: 10 },
    editButton: {},
    deleteButton: {},
    actionText: { fontWeight: "bold", color: "#007AFF" },
});
