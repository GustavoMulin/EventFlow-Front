import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import api from "../api/api";

const { width } = Dimensions.get("window");

export default function EventMapScreen({ navigation }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null); // Evento selecionado para mostrar tooltip
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

    const centerOnMarker = (event) => {
        setSelectedEvent(event);
        mapRef.current?.animateToRegion(
            {
                latitude: event.latitude,
                longitude: event.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            },
            600
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
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
                {events.map(
                    (event) =>
                        event.latitude &&
                        event.longitude && (
                            <Marker
                                key={event._id}
                                coordinate={{ latitude: event.latitude, longitude: event.longitude }}
                                onPress={() => centerOnMarker(event)}
                            />
                        )
                )}
            </MapView>

            {/* Tooltip custom */}
            {selectedEvent && (
                <View style={styles.tooltip}>
                    <Text style={styles.tooltipTitle}>{selectedEvent.name}</Text>
                    <Text style={styles.tooltipText}>📅 {selectedEvent.date}</Text>
                    <Text style={styles.tooltipText}>
                        🎵 {selectedEvent.category ? selectedEvent.category.name : "Sem categoria"}
                    </Text>
                    <Text style={styles.tooltipText}>💲 R$ {selectedEvent.price}</Text>

                    <TouchableOpacity
                        style={styles.tooltipButton}
                        onPress={() => navigation.navigate("EventDetails", { event: selectedEvent })}
                    >
                        <Text style={styles.tooltipButtonText}>Ver Detalhes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tooltipButton, { backgroundColor: "#ccc", marginTop: 5 }]}
                        onPress={() => setSelectedEvent(null)}
                    >
                        <Text style={styles.tooltipButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
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
    tooltip: {
        position: "absolute",
        bottom: 50,
        left: width * 0.1,
        width: width * 0.8,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        elevation: 6,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    tooltipTitle: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 4,
    },
    tooltipText: {
        fontSize: 14,
        marginVertical: 2,
    },
    tooltipButton: {
        marginTop: 10,
        backgroundColor: "#007AFF",
        paddingVertical: 6,
        borderRadius: 8,
    },
    tooltipButtonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 14,
        fontWeight: "bold",
    },
});
