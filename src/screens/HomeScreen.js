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
import { Menu, Divider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import api from "../api/api";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";

export default function HomeScreen({ route }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const user = route.params?.user;
  const navigation = useNavigation();

  const carregarEventos = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data);
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

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

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
        source={{
          uri:
            item.image ||
            Image.resolveAssetSource(require("../assets/event-placeholder.jpg")).uri,
        }}
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
        {/* HEADER */}
        return (
        <View style={styles.container}>
          <Header navigation={navigation} />

          <FlatList
            data={events}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
        );


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
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingHorizontal: 15 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: { width: 40, height: 40, borderRadius: 10, marginRight: 10 },
  appTitle: { fontSize: 22, fontWeight: "bold", color: "#007AFF" },

  menuButton: {
    padding: 8,
    borderRadius: 50,
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
