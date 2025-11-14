import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps";
import api from "../api/api";

const BASE_URL = "http://192.168.0.22:3000";

export default function EventDetailsScreen({ route, navigation }) {
    const { event: initialEvent } = route.params;
    const [event, setEvent] = useState(initialEvent);
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                if (event.category?.name) {
                    // Categoria já veio populada
                    setCategoryName(event.category.name);
                } else if (event.category) {
                    // Se só veio o ID, buscar na API
                    const token = await AsyncStorage.getItem("token");
                    const res = await api.get(`/categories/${event.category}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setCategoryName(res.data.name);
                } else {
                    setCategoryName("Não definida");
                }
            } catch (error) {
                console.log("Erro ao buscar categoria:", error);
                setCategoryName("Não definida");
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [event]);

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

                            await api.delete(`/events/${event._id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });

                            Alert.alert("Sucesso", "Evento excluído com sucesso!");
                            navigation.goBack();
                        } catch (error) {
                            console.log(error);
                            Alert.alert("Erro", "Falha ao excluir o evento.");
                        }
                    },
                },
            ]
        );
    };

    const imageSource = event.image
        ? { uri: `${BASE_URL}/${event.image.replace(/^\/+/, "")}` }
        : require("../assets/event-placeholder.jpg");

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#007AFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Detalhes do Evento</Text>
                </View>

                {/* Imagem */}
                <Image source={imageSource} style={styles.image} />

                {/* Informações */}
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{event.name}</Text>

                    {event.date && <Text style={styles.date}>📅 {event.date}</Text>}

                    {event.price ? (
                        <Text style={styles.price}>💰 R$ {event.price}</Text>
                    ) : (
                        <Text style={styles.price}>Evento gratuito</Text>
                    )}

                    <Text style={styles.infoText}>🏷 Categoria: {categoryName}</Text>

                    {event.location && (
                        <Text style={styles.infoText}>📍 Local: {event.location.address || "Não definido"}</Text>
                    )}

                    <Text style={styles.description}>
                        {event.description || "Sem descrição disponível."}
                    </Text>

                    {/* Mapa */}
                    {event.latitude && event.longitude && (
                        <>
                            <Text style={styles.mapLabel}>Localização do Evento</Text>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: Number(event.latitude),
                                    longitude: Number(event.longitude),
                                    latitudeDelta: 0.005,
                                    longitudeDelta: 0.005,
                                }}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: Number(event.latitude),
                                        longitude: Number(event.longitude),
                                    }}
                                    title={event.name}
                                />
                            </MapView>
                        </>
                    )}

                    {/* Botões */}
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
        backgroundColor: "#fff"
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee"
    },
    backButton: {
        marginRight: 10
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#007AFF"
    },
    image: {
        width: "100%",
        height: 220,
        resizeMode: "cover"
    },
    infoContainer: {
        padding: 20
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10
    },
    date: {
        fontSize: 16,
        color: "#666",
        marginBottom: 8
    },
    price: {
        fontSize:
            16, color: "#007AFF",
        marginBottom: 12
    },
    infoText: {
        fontSize: 16,
        color: "#555",
        marginBottom: 8
    },
    description: {
        fontSize: 16,
        color: "#444",
        lineHeight: 22,
        marginTop: 10
    },
    mapLabel: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
        color: "#333"
    },
    map: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        marginBottom: 20
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 25
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 10,
        width: "48%",
        justifyContent: "center"
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 8
    },
});
