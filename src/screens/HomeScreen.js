import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import api from "../api/api";
import { useNavigation } from "@react-navigation/native";
import eventPlaceholder from "../assets/event-placeholder.jpg";
import profileIcon from "../assets/profile-icon.jpg";

export default function HomeScreen({ route }) {
  const [events, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = route.params?.user;
  const navigation = useNavigation();

  const carregarEventos = async () => {
    try {
      const response = await api.get("/events");
      setEventos(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar os eventos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEventos();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Carregando eventos...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate("EventDetails", { event: item })}
    >
      <Image
        source={item.imagem ? { uri: item.imagem } : eventPlaceholder}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.nome}</Text>
        <Text style={styles.date}>{item.data}</Text>
        <Text style={styles.price}>R$ {item.preco}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcome}>
          Olá, {user?.name || "Usuário"} 👋
        </Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate("Profile", { user })}
        >
          <Image
            source={user?.foto ? { uri: user.foto } : profileIcon}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingHorizontal: 15 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  welcome: { fontSize: 20, fontWeight: "600", color: "#333" },
  profileButton: { borderRadius: 50, overflow: "hidden" },
  profileImage: { width: 45, height: 45, borderRadius: 25 },

  // Cards
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 3,
  },
  image: { width: "100%", height: 180 },
  info: { padding: 12 },
  name: { fontSize: 18, fontWeight: "bold", color: "#333" },
  date: { fontSize: 14, color: "#777", marginTop: 4 },
  price: { fontSize: 16, fontWeight: "600", color: "#007AFF", marginTop: 6 },
});
