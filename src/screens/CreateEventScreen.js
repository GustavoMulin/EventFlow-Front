import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker } from "react-native-maps";
import api from "../api/api";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateEventScreen({ navigation, route }) {
    const user = route.params?.user;
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null); // <- novo estado

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: [ImagePicker.MediaType.IMAGE],
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleCreateEvent = async () => {
        if (!name || !date || !location) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios e escolha um local no mapa.");
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");

            await api.post(
                "/events",
                {
                    name,
                    description,
                    date,
                    price,
                    image: image || null,
                    latitude: location.latitude,
                    longitude: location.longitude,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Alert.alert("Sucesso", "Evento criado com sucesso!");
            navigation.navigate("Home", { user });
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível criar o evento.");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Criar Novo Evento</Text>

                <TouchableOpacity onPress={pickImage}>
                    <Image
                        source={image ? { uri: image } : require("../assets/event-placeholder.jpg")}
                        style={styles.image}
                    />
                    <Text style={styles.imageText}>Selecionar Imagem</Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Nome do evento"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Descrição"
                    value={description}
                    onChangeText={setDescription}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Data (ex: 2025-10-23)"
                    value={date}
                    onChangeText={setDate}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Preço (ex: 30)"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                />

                {/* Mapa */}
                <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Selecione o local no mapa:</Text>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: -23.5505,
                        longitude: -46.6333,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                    onPress={(e) => setLocation(e.nativeEvent.coordinate)}
                >
                    {location && <Marker coordinate={location} />}
                </MapView>

                <TouchableOpacity style={styles.button} onPress={handleCreateEvent}>
                    <Text style={styles.buttonText}>Cadastrar Evento</Text>
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
    title: { fontSize: 22, fontWeight: "bold", color: "#007AFF", marginBottom: 20 },
    image: {
        width: 200,
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    imageText: { color: "#007AFF", marginBottom: 15 },
    input: {
        width: "90%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
    },
    map: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    button: {
        width: "90%",
        backgroundColor: "#007AFF",
        padding: 15,
        borderRadius: 25,
        alignItems: "center",
    },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
