import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const BASE_URL = "http://192.168.0.22:3000";

export default function EventCard({ event, onPress }) {
    const imageSource = event.image
        ? { uri: `${BASE_URL}${event.image}` }
        : require("../assets/event-placeholder.jpg");


    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image source={imageSource} style={styles.image} />

            <View style={styles.info}>
                <Text style={styles.title}>{event.name}</Text>
                <Text style={styles.date}>Data: {event.date}</Text>
                <Text numberOfLines={2} style={styles.desc}>
                    {event.description}
                </Text>
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 15,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: { width: "100%", height: 180 },
    info: { padding: 12 },
    title: { fontSize: 18, fontWeight: "bold", color: "#222" },
    date: { fontSize: 14, color: "#666", marginVertical: 4 },
    desc: { fontSize: 13, color: "#555" },
});
