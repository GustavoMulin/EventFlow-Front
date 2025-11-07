import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { useIsFocused } from "@react-navigation/native";

export default function LocationListScreen({ navigation }) {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    const fetchLocations = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
                return;
            }

            const response = await api.get("/locations", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setLocations(response.data);
        } catch (error) {
            console.log("Erro ao carregar locais:", error);
            Alert.alert("Erro", "Não foi possível carregar os locais.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) fetchLocations();
    }, [isFocused]);

    const handleDelete = async (id) => {
        Alert.alert(
            "Confirmar",
            "Deseja realmente excluir este local?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem("token");
                            await api.delete(`/locations/${id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            fetchLocations();
                        } catch (error) {
                            console.log("Erro ao excluir:", error);
                            Alert.alert("Erro", "Não foi possível excluir o local.");
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            {item.address ? (
                <Text style={styles.address}>{item.address}</Text>
            ) : (
                <Text style={styles.address}>Sem endereço</Text>
            )}
            <Text style={styles.coords}>
                {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
            </Text>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() =>
                        navigation.navigate("EditLocation", { location: item })
                    }
                >
                    <Text style={styles.editText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item._id)}
                >
                    <Text style={styles.deleteText}>Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Locais Cadastrados</Text>

            <TouchableOpacity
                style={styles.addBtn}
                onPress={() => navigation.navigate("CreateLocation")}
            >
                <Text style={styles.addBtnText}>+ Adicionar Local</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 30 }} />
            ) : (
                <FlatList
                    data={locations}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 30 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#007AFF",
        textAlign: "center",
        marginBottom: 15,
    },
    addBtn: {
        backgroundColor: "#007AFF",
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
    },
    addBtnText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
        fontWeight: "bold",
    },
    card: {
        backgroundColor: "#f8f8f8",
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    address: {
        color: "#555",
        marginTop: 3,
    },
    coords: {
        color: "#777",
        marginTop: 3,
        fontSize: 12,
    },
    buttonRow: {
        flexDirection: "row",
        marginTop: 10,
        justifyContent: "space-between",
    },
    editBtn: {
        backgroundColor: "#FFA500",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    editText: {
        color: "#fff",
        fontWeight: "bold",
    },
    deleteBtn: {
        backgroundColor: "#FF3B30",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    deleteText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
