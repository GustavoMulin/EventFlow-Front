import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
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

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: [ImagePicker.MediaType.IMAGE],
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleCreateEvent = async () => {
        if (!name || !date) {
            Alert.alert("Erro", "Preencha os campos obrigatórios (nome e data).");
            return;
        }

        try {
            // Buscar o token do AsyncStorage
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Erro", "Usuário não autenticado.");
                return;
            }

            const response = await api.post(
                "/events",
                {
                    name,
                    description,
                    date,
                    price,
                    image: image || null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Evento criado:", response.data);
            Alert.alert("Sucesso", "Evento criado com sucesso!");
            navigation.navigate("Home", { user });
        } catch (error) {
            console.log("Erro ao criar evento:", error.response?.data || error.message);
            Alert.alert("Erro", "Não foi possível criar o evento.");
        }
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Criar Novo Evento</Text>

                <TouchableOpacity onPress={pickImage}>
                    <Image
                        source={
                            image
                                ? { uri: image }
                                : require("../assets/event-placeholder.jpg")
                        }
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
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#007AFF",
        marginBottom: 20,
    },
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
    button: {
        width: "90%",
        backgroundColor: "#007AFF",
        padding: 15,
        borderRadius: 25,
        alignItems: "center",
    },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
