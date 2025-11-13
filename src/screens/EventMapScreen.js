import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import api from "../api/api";

export default function EventMapScreen({ navigation }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [region, setRegion] = useState({
        latitude: -8.76194,
        longitude: -63.90389,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
    });

    const fetchEvents = async () => {
        try {
            const response = await api.get("/events");
            setEvents(response.data);
        } catch (error) {
            console.error("Erro ao carregar eventos:", error);
            Alert.alert("Erro", "Não foi possível carregar os eventos do mapa.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text>Carregando mapa...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView style={styles.map} region={region}>
                {events.map((event) => {
                    if (event.location && event.location.latitude && event.location.longitude) {
                        return (
                            <Marker
                                key={event._id}
                                coordinate={{
                                    latitude: event.location.latitude,
                                    longitude: event.location.longitude,
                                }}
                                title={event.name}
                            >
                                <Callout onPress={() => navigation.navigate("EventDetails", { event })}>
                                    <View style={styles.callout}>
                                        <Text style={styles.eventName}>{event.name}</Text>
                                        <Text>{event.date}</Text>
                                        {event.price !== undefined && <Text>💰 R$ {event.price.toFixed(2)}</Text>}
                                        <TouchableOpacity
                                            style={styles.detailButton}
                                            onPress={() => navigation.navigate("EventDetails", { event })}
                                        >
                                            <Text style={styles.detailText}>Ver Detalhes</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Callout>
                            </Marker>
                        );
                    }
                    return null;
                })}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    callout: {
        width: 180,
        padding: 5,
        borderRadius: 8,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    eventName: { fontWeight: "bold", color: "#007AFF", marginBottom: 3 },
    detailButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        marginTop: 6,
    },
    detailText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
});
