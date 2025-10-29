import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function EventDetailsScreen({ route, navigation }) {
    const { event } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#007AFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Detalhes do Evento</Text>
                </View>

                {/* Imagem do evento */}
                <Image
                    source={
                        event.image
                            ? { uri: event.image }
                            : require("../assets/event-placeholder.jpg")
                    }
                    style={styles.image}
                />

                {/* Informações do evento */}
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{event.name}</Text>

                    {event.date && (
                        <Text style={styles.date}>📅 {new Date(event.date).toLocaleDateString()}</Text>
                    )}

                    {event.price ? (
                        <Text style={styles.price}>💰 R$ {event.price.toFixed(2)}</Text>
                    ) : (
                        <Text style={styles.price}>Evento gratuito</Text>
                    )}

                    {event.description ? (
                        <Text style={styles.description}>{event.description}</Text>
                    ) : (
                        <Text style={styles.description}>Sem descrição disponível.</Text>
                    )}
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
});
