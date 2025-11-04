import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../api/api";

export default function EventListScreen({ route }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = route.params?.user;
    const navigation = useNavigation();

    const carregarEventos = async () => {
        try {
            const response = await api.get("/events");
            setEvents(response.data);
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível carregar os eventos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarEventos();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("EventDetails", { event: item })}
        >
            <Image
                source={
                    item.image
                        ? { uri: item.image }
                        : require("../assets/event-placeholder.jpg")
                }
                style={styles.image}
            />
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.date}>{item.date}</Text>
                {item.price !== undefined && (
                    <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
                )}

                {/* 📍 Endereço do evento */}
                {item.location?.address && (
                    <Text style={styles.address}>📍 {item.location.address}</Text>
                )}
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text>Carregando eventos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image source={require("../assets/logo.jpg")} style={styles.logo} />
                    <Text style={styles.logoText}>EventFlow</Text>
                </View>

                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate("Profile", { user })}
                >
                    <Image
                        source={require("../assets/profile-icon.jpg")}
                        style={styles.profileImage}
                    />
                    <Text style={styles.profileText}>Ver Perfil</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>Bem vindo ao Aplicativo</Text>

            <FlatList
                data={events}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 15 },
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },

    // Header
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
    },
    logoContainer: { flexDirection: "row", alignItems: "center" },
    logo: { width: 32, height: 32, marginRight: 8 },
    logoText: { fontSize: 18, fontWeight: "bold", color: "#000" },
    profileButton: { flexDirection: "row", alignItems: "center" },
    profileImage: { width: 24, height: 24, marginRight: 6 },
    profileText: { fontSize: 15, color: "#007AFF", fontWeight: "500" },
    subtitle: {
        fontSize: 16,
        color: "#555",
        textAlign: "center",
        marginBottom: 10,
    },

    // Cards
    card: {
        backgroundColor: "#f9f9f9",
        borderRadius: 15,
        marginBottom: 15,
        overflow: "hidden",
        elevation: 2,
    },
    image: { width: "100%", height: 180 },
    info: { padding: 12 },
    name: { fontSize: 18, fontWeight: "bold", color: "#333" },
    date: { fontSize: 14, color: "#777", marginTop: 4 },
    price: { fontSize: 16, fontWeight: "600", color: "#007AFF", marginTop: 6 },
    address: {
        fontSize: 14,
        color: "#555",
        marginTop: 4,
    },

});
