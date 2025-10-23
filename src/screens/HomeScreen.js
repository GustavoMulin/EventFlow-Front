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
import { SafeAreaView } from "react-native-safe-area-context";

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
      onPress={() => Alert.alert("Evento", `Você selecionou: ${item.name}`)}
    >
      <Image
        source={
          item.image
            ? { uri: item.image }
            : require("../assets/event-placeholder.jpg")
        }
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.price}>R$ {item.price}</Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("../assets/logo.jpg")}
            style={styles.logo}
          />
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate("Profile", { user })}
          >
            <Text style={styles.profileText}>Ver Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Subtítulo */}
        <Text style={styles.subtitle}>Bem-vindo ao Aplicativo</Text>

        {/* Lista de eventos */}
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", paddingHorizontal: 15 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 10,
  },
  logo: { width: 80, height: 40, resizeMode: "contain" },
  profileButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  profileText: { color: "#fff", fontWeight: "bold", fontSize: 14 },

  subtitle: {
    textAlign: "center",
    fontSize: 26,
    color: "#555",
    marginBottom: 15,
  },

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
