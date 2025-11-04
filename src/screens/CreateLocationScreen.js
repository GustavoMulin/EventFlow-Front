import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";

export default function CreateLocationScreen({ navigation }) {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleMapPress = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
    };

    const handleCreateLocation = async () => {
        if (!name || !selectedLocation) {
            Alert.alert("Erro", "Informe o nome e selecione um local no mapa.");
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
                return;
            }

            await api.post(
                "/locations",
                {
                    name,
                    address,
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            Alert.alert("Sucesso", "Local cadastrado com sucesso!");
            navigation.goBack();
        } catch (error) {
            console.log("Erro ao criar local:", error);
            Alert.alert("Erro", "Não foi possível cadastrar o local.");
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

            <View style={styles.container}>
                <Text style={styles.title}>Cadastrar Local</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nome do Local"
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Endereço (opcional)"
                    value={address}
                    onChangeText={setAddress}
                />

                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: -8.76194,
                        longitude: -63.90389,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                    onPress={handleMapPress}
                >
                    {selectedLocation && (
                        <Marker coordinate={selectedLocation} title="Local Selecionado" />
                    )}
                </MapView>

                <TouchableOpacity style={styles.button} onPress={handleCreateLocation}>
                    <Text style={styles.buttonText}>Salvar Local</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#007AFF",
        textAlign: "center",
        marginVertical: 10,
    },
    map: {
        width: "100%",
        height: 300,
        borderRadius: 10,
        marginBottom: 15,
    },
    input: {
        width: "100%",
        height: 45,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#007AFF",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    backButton: {
        alignSelf: "center",
        marginTop: 15,
    },
    backText: {
        color: "#007AFF",
        fontSize: 16,
    },
});
