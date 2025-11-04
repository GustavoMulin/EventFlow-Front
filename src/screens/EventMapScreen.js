import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import api from "../api/api";

export default function EventMapScreen({ navigation }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get("/events");
                setEvents(res.data);
            } catch (error) {
                console.log("Erro ao buscar eventos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
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
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }}
        >
            {events.map((event) => (
                <Marker
                    key={event._id}
                    coordinate={{
                        latitude: event.latitude || 0,
                        longitude: event.longitude || 0,
                    }}
                >
                    <Callout
                        onPress={() => navigation.navigate("EventDetails", { event })}
                    >
                        <View style={{ width: 200 }}>
                            <Text style={{ fontWeight: "bold" }}>{event.name}</Text>
                            <Text>{event.date}</Text>
                            <Text>R$ {event.price}</Text>
                            <Text style={{ color: "#007AFF", marginTop: 5 }}>
                                Ver detalhes →
                            </Text>
                        </View>
                    </Callout>
                </Marker>
            ))}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
