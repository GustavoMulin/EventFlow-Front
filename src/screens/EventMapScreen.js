import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import api from "../api/api";

export default function EventMapScreen({ navigation }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get("/events");
                setEvents(response.data);
            } catch (error) {
                console.log("Erro ao carregar eventos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <MapView
            style={styles.map}
            initialRegion={{
                latitude: -8.76194,
                longitude: -63.90389,
                latitudeDelta: 0.08,
                longitudeDelta: 0.08,
            }}
        >
            {events.map((event) => (
                event.latitude && event.longitude && (
                    <Marker
                        key={event._id}
                        coordinate={{
                            latitude: event.latitude,
                            longitude: event.longitude,
                        }}
                        title={event.name}
                    >
                        <Callout
                            onPress={() =>
                                navigation.navigate("EventDetails", { event })
                            }
                        >
                            <View style={styles.callout}>
                                <Text style={styles.calloutTitle}>{event.name}</Text>
                                <Text style={styles.calloutText}>{event.date}</Text>

                                <TouchableOpacity
                                    style={styles.calloutButton}
                                >
                                    <Text style={styles.calloutButtonText}>
                                        Ver Detalhes
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Callout>
                    </Marker>
                )
            ))}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    callout: {
        width: 180,
        padding: 8,
    },
    calloutTitle: {
        fontWeight: "bold",
        fontSize: 14,
    },
    calloutText: {
        marginTop: 3,
        fontSize: 12,
        color: "#666",
    },
    calloutButton: {
        marginTop: 8,
        backgroundColor: "#007AFF",
        paddingVertical: 6,
        borderRadius: 8,
    },
    calloutButtonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 12,
        fontWeight: "bold",
    },
});
