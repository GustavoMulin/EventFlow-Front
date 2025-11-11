import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";

const BASE_URL = "http://12.0.0.100:3000";

export default function EventDetailsScreen({ route, navigation }) {
    const { event } = route.params;

    const handleDelete = async () => {
        Alert.alert(
            "Excluir evento",
            "Tem certeza que deseja excluir este evento?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem("token");

                            if (!token) {
                                Alert.alert("Erro", "Usuário não autenticado.");
                                return;
                            }

                            const response = await api.delete(`/events/${event._id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            Alert.alert("Sucesso", "Evento excluído com sucesso!");
                            navigation.goBack();
                        } catch (error) {
                            if (error.response) {
                                Alert.alert("Erro", error.response.data?.message || "Erro no servidor");
                            } else {
                                Alert.alert("Erro", "Falha de rede ou servidor inacessível.");
                            }
                        }
                    },
                },
            ]
        );
    };

    const imageSource = event.image
        ? { uri: `${BASE_URL}${event.image}` }
        : require("../assets/event-placeholder.jpg");

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#007AFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Detalhes do Evento</Text>
                </View>

                <Image source={imageSource} style={styles.image} />

                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{event.name}</Text>
                    {event.date && <Text style={styles.date}>📅 {event.date}</Text>}
                    {event.price ? (
                        <Text style={styles.price}>💰 R$ {event.price}</Text>
                    ) : (
                        <Text style={styles.price}>Evento gratuito</Text>
                    )}
                    <Text style={styles.description}>
                        {event.description || "Sem descrição disponível."}
                    </Text>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: "#007AFF" }]}
                            onPress={() => navigation.navigate("EditEvent", { event })}
                        >
                            <Ionicons name="create-outline" size={20} color="#fff" />
                            <Text style={styles.buttonText}>Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: "#FF3B30" }]}
                            onPress={handleDelete}
                        >
                            <Ionicons name="trash-outline" size={20} color="#fff" />
                            <Text style={styles.buttonText}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#007AFF",
    },
    image: {
        width: "100%",
        height: 220,
        resizeMode: "cover",
    },
    infoContainer: {
        padding: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    date: {
        fontSize: 16,
        color: "#666",
        marginBottom: 8,
    },
    price: {
        fontSize: 16,
        color: "#007AFF",
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: "#444",
        lineHeight: 22,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 25,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 10,
        width: "48%",
        justifyContent: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 8,
    },
});
