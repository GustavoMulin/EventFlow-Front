import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";

export default function CreateLocationScreen({ navigation }) {
    const [name, setName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [address, setAddress] = useState("");
    const [loadingLocation, setLoadingLocation] = useState(false);

    const handleGetCurrentLocation = async () => {
        try {
            setLoadingLocation(true);
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permissão negada", "Precisamos da sua permissão para acessar a localização.");
                setLoadingLocation(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setLatitude(location.coords.latitude.toString());
            setLongitude(location.coords.longitude.toString());
            setLoadingLocation(false);

            Alert.alert("Sucesso", "Localização preenchida automaticamente!");
        } catch (error) {
            console.log("Erro ao obter localização:", error);
            Alert.alert("Erro", "Não foi possível obter sua localização.");
            setLoadingLocation(false);
        }
    };

    const handleCreateLocation = async () => {
        if (!name || !latitude || !longitude) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");
            await api.post(
                "/locations",
                { name, latitude: Number(latitude), longitude: Number(longitude), address },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Alert.alert("Sucesso", "Local cadastrado com sucesso!");
            navigation.goBack();
        } catch (error) {
            console.log("Erro ao criar local:", error.response?.data || error.message);
            Alert.alert("Erro", "Não foi possível cadastrar o local.");
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
                    placeholder="Latitude"
                    keyboardType="numeric"
                    value={latitude}
                    onChangeText={setLatitude}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Longitude"
                    keyboardType="numeric"
                    value={longitude}
                    onChangeText={setLongitude}
                />

                <TouchableOpacity
                    style={[styles.buttonOutline, loadingLocation && { opacity: 0.6 }]}
                    onPress={handleGetCurrentLocation}
                    disabled={loadingLocation}
                >
                    {loadingLocation ? (
                        <ActivityIndicator color="#007AFF" />
                    ) : (
                        <Text style={styles.buttonOutlineText}>Usar minha localização atual</Text>
                    )}
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Endereço (opcional)"
                    value={address}
                    onChangeText={setAddress}
                />

                <TouchableOpacity style={styles.button} onPress={handleCreateLocation}>
                    <Text style={styles.buttonText}>Cadastrar Local</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>← Voltar</Text>
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
        marginBottom: 20,
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
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    buttonOutline: {
        width: "90%",
        borderWidth: 1.5,
        borderColor: "#007AFF",
        borderRadius: 25,
        padding: 12,
        alignItems: "center",
        marginBottom: 15,
    },
    buttonOutlineText: {
        color: "#007AFF",
        fontWeight: "bold",
        fontSize: 15,
    },
    backButton: {
        marginTop: 20,
    },
    backText: {
        color: "#007AFF",
        fontSize: 16,
    },
});
