import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditEventScreen({ route, navigation }) {
    const { event } = route.params;
    const [name, setName] = useState(event.name);
    const [description, setDescription] = useState(event.description);
    const [price, setPrice] = useState(event.price);
    const [date, setDate] = useState(event.date);

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            await api.put(
                `/events/${event._id}`,
                { name, description, price, date },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            Alert.alert("Sucesso", "Evento atualizado com sucesso!");
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível atualizar o evento.");
        }
    };

    return (
        <View style={styles.container}>

            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nome do evento"
            />

            <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Descrição"
                multiline
            />

            <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="Data"
            />

            <TextInput
                style={styles.input}
                value={String(price)}
                onChangeText={setPrice}
                placeholder="Preço"
                keyboardType="numeric"
            />

            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvar alterações</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#007AFF",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
