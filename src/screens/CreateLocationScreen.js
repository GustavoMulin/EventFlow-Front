import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";

export default function CreateLocationScreen({ navigation }) {
    const [name, setName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [address, setAddress] = useState("");

    const handleCreateLocation = async () => {
        if (!name || !latitude || !longitude) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");

            await api.post(
                "/locations",
                {
                    name,
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    address,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            Alert.alert("Sucesso", "Local criado com sucesso!");
            navigation.goBack();
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível criar o local.");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Cadastrar Local</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nome do local"
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Latitude (ex: -23.5505)"
                    keyboardType="numeric"
                    value={latitude}
                    onChangeText={setLatitude}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Longitude (ex: -46.6333)"
                    keyboardType="numeric"
                    value={longitude}
                    onChangeText={setLongitude}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Endereço (opcional)"
                    value={address}
                    onChangeText={setAddress}
                />

                <TouchableOpacity style={styles.button} onPress={handleCreateLocation}>
                    <Text style={styles.buttonText}>Salvar Local</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#007AFF",
        marginBottom: 20
    },
    input: {
        width: "90%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
    },
    button: {
        width: "90%",
        backgroundColor: "#007AFF",
        padding: 15,
        borderRadius: 25,
        alignItems: "center",
    },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    link: { marginTop: 15, color: "#007AFF" },
});
