import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditEventScreen({ route, navigation }) {
    const { event } = route.params;

    const [name, setName] = useState(event.name);
    const [description, setDescription] = useState(event.description);
    const [date, setDate] = useState(event.date);
    const [price, setPrice] = useState(event.price?.toString() || "");
    const [image, setImage] = useState(event.image);

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permissão negada", "Precisamos acessar suas fotos!");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Erro ao selecionar imagem:", error);
        }
    };

    const handleUpdateEvent = async () => {
        if (!name || !date) {
            Alert.alert("Erro", "Preencha os campos obrigatórios.");
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");
            const formData = new FormData();

            formData.append("name", name);
            formData.append("description", description);
            formData.append("date", date);
            formData.append("price", price);

            // Se o usuário selecionou uma nova imagem
            if (image && !image.includes("/uploads/")) {
                const fileName = image.split("/").pop();
                const fileType = fileName.split(".").pop();
                formData.append("image", {
                    uri: image,
                    name: fileName,
                    type: `image/${fileType}`,
                });
            }

            await api.put(`/events/${event._id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            Alert.alert("Sucesso", "Evento atualizado com sucesso!");
            navigation.navigate("Home");
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível atualizar o evento.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Editar Evento</Text>

            <TouchableOpacity onPress={pickImage}>
                <Image
                    source={
                        image
                            ? { uri: image.includes("/uploads/") ? `http://12.0.0.85:3000${image}` : image }
                            : require("../assets/event-placeholder.jpg")
                    }
                    style={styles.image}
                />
                <Text style={styles.imageText}>Alterar Imagem</Text>
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder="Nome"
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
                placeholder="Data (ex: 23/11/2025)"
                value={date}
                onChangeText={setDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Preço"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
            />

            <TouchableOpacity style={styles.button} onPress={handleUpdateEvent}>
                <Text style={styles.buttonText}>Salvar Alterações</Text>
            </TouchableOpacity>
        </ScrollView>
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
    imageText: {
        color: "#007AFF",
        marginBottom: 15,
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
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
