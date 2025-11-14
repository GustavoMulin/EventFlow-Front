import React, { useEffect, useState, useRef } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import api from "../api/api";

export default function EventMapScreen({ navigation }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const mapRef = useRef(null);

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

    const centerOnMarker = (lat, lng) => {
        mapRef.current?.animateToRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }, 600);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <MapView
            ref={mapRef}
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
                        onPress={() => centerOnMarker(event.latitude, event.longitude)}
                    >
                        <Callout
                            onPress={() =>
                                navigation.navigate("EventDetails", { event })
                            }
                        >
                            <View style={styles.callout}>
                                <Text style={styles.calloutTitle}>{event.name}</Text>
                                <Text style={styles.calloutText}>📅 {event.date}</Text>

                                {event.category?.name && (
                                    <Text style={styles.calloutText}>🏷 Categoria: {event.category.name}</Text>
                                )}

                                {event.price !== undefined && (
                                    <Text style={styles.calloutText}>💲 Preço: R$ {event.price}</Text>
                                )}

                                <TouchableOpacity
                                    style={styles.calloutButton}
                                    onPress={() =>
                                        navigation.navigate("EventDetails", { event })
                                    }
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
        width: 200,
        padding: 8,
    },
    calloutTitle: {
        fontWeight: "bold",
        fontSize: 15,
        marginBottom: 4,
    },
    calloutText: {
        fontSize: 12,
        color: "#444",
        marginVertical: 2,
    },
    calloutButton: {
        marginTop: 10,
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
