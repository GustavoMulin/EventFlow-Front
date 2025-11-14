import React, { useState, useRef, useEffect } from "react";
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
    const [location, setLocation] = useState(null);
    const [optionsLocation, setOptionsLocation] = useState([]);
    const [locationSelected, setLocationSelected] = useState(null);
    const [categories, setCategories] = useState([]);
    const [categorySelected, setCategorySelected] = useState(null);

    const [dropdownCategoryOpen, setDropdownCategoryOpen] = useState(false);
    const [dropdownLocationOpen, setDropdownLocationOpen] = useState(false);

    const mapRef = useRef(null);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Permissão negada", "Precisamos da permissão para acessar suas fotos!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    async function getLocation() {
        const token = await AsyncStorage.getItem("token");

        try {
            const response = await api.get("/locations", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOptionsLocation(response.data);
        } catch (error) {
            console.log("Erro ao buscar locais:", error);
            Alert.alert("Erro", "Não foi possível carregar os locais.");
        }
    }

    async function getCategories() {
        const token = await AsyncStorage.getItem("token");
        try {
            const response = await api.get("/categories", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(response.data);
        } catch (error) {
            console.log("Erro ao buscar categorias:", error);
            Alert.alert("Erro", "Não foi possível carregar as categorias.");
        }
    }

    useEffect(() => {
        getLocation();
        getCategories();
    }, []);

    const handleSelectLocation = (id) => {
        setLocationSelected(id);

        const selected = optionsLocation.find((loc) => loc._id === id);
        if (selected) {
            const coords = {
                latitude: selected.latitude,
                longitude: selected.longitude,
            };

            setLocation(coords);

            mapRef.current?.animateToRegion({
                ...coords,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
    };

    const handleCreateEvent = async () => {
        if (!name || !date || !location || !categorySelected) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");

            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("date", date);
            formData.append("price", price);
            formData.append("latitude", location.latitude);
            formData.append("longitude", location.longitude);
            formData.append("category", categorySelected);
            formData.append("locationId", locationSelected);

            if (image) {
                const fileName = image.split("/").pop();
                const fileType = fileName.split(".").pop();
                formData.append("image", {
                    uri: image,
                    name: fileName,
                    type: `image/${fileType}`,
                });
            }

            await api.post("/events", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            Alert.alert("Sucesso", "Evento criado com sucesso!");
            navigation.replace("Home");
        } catch (error) {
            console.log("Erro ao criar evento:", error.response?.data || error.message);
            Alert.alert("Erro", "Não foi possível criar o evento.");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container} nestedScrollEnabled>
                <Text style={styles.title}>Criar Novo Evento</Text>

                <TouchableOpacity onPress={pickImage}>
                    <Image
                        source={image ? { uri: image } : require("../assets/event-placeholder.jpg")}
                        style={styles.image}
                    />
                    <Text style={styles.imageText}>Selecionar Imagem</Text>
                </TouchableOpacity>

                <TextInput style={styles.input} placeholder="Nome do evento" value={name} onChangeText={setName} />
                <TextInput style={styles.input} placeholder="Descrição" value={description} onChangeText={setDescription} />
                <TextInput style={styles.input} placeholder="Data (ex: 2025-10-23)" value={date} onChangeText={setDate} />
                <TextInput
                    style={styles.input}
                    placeholder="Preço (ex: 30)"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                />

                <TouchableOpacity
                    onPress={() => setDropdownCategoryOpen(!dropdownCategoryOpen)}
                    style={styles.selector}
                >
                    <Text style={styles.selectorText}>
                        {categorySelected
                            ? categories.find((c) => c._id === categorySelected)?.name
                            : "Selecione uma categoria..."}
                    </Text>
                    <Text style={styles.arrowIcon}>▼</Text>
                </TouchableOpacity>

                {dropdownCategoryOpen && (
                    <ScrollView
                        style={styles.dropdownList}
                        nestedScrollEnabled={true}
                        keyboardShouldPersistTaps="handled"
                    >
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat._id}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setCategorySelected(cat._id);
                                    setDropdownCategoryOpen(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}


                <TouchableOpacity
                    onPress={() => setDropdownLocationOpen(!dropdownLocationOpen)}
                    style={styles.selector}
                >
                    <Text style={styles.selectorText}>
                        {locationSelected
                            ? optionsLocation.find((loc) => loc._id === locationSelected)?.name
                            : "Selecione um local..."}
                    </Text>
                    <Text style={styles.arrowIcon}>▼</Text>
                </TouchableOpacity>

                {dropdownLocationOpen && (
                    <ScrollView
                        style={styles.dropdownList}
                        nestedScrollEnabled={true}
                        keyboardShouldPersistTaps="handled"
                    >
                        {optionsLocation.map((loc) => (
                            <TouchableOpacity
                                key={loc._id}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    handleSelectLocation(loc._id);
                                    setDropdownLocationOpen(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>{loc.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                        latitude: -8.76194,
                        longitude: -63.90389,
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
    image: { width: 200, height: 150, borderRadius: 10, marginBottom: 10 },
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

    selector: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        backgroundColor: "#fff",
        width: "90%",
        marginBottom: 10,
    },
    selectorText: { fontSize: 16, color: "#333" },
    arrowIcon: { fontSize: 16, color: "#888" },
    dropdownList: {
        maxHeight: 150,
        width: "90%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        backgroundColor: "#fff",
        marginBottom: 15,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    dropdownItemText: { fontSize: 16, color: "#333" },
});
