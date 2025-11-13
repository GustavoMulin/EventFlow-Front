import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import api from "../api/api";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data);
      setFilteredEvents(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar os eventos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchEvents);
    return unsubscribe;
  }, [navigation]);

  const handleSearch = (text) => {
    setSearch(text);

    if (text.trim() === "") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) =>
        event.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        <Header navigation={navigation} />

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
        ) : (
          <ScrollView contentContainerStyle={styles.container}>
            <TextInput
              style={styles.searchBar}
              placeholder="🔍 Buscar evento..."
              placeholderTextColor="#888"
              value={search}
              onChangeText={handleSearch}
            />

            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => navigation.navigate("EventMap")}
            >
              <Text style={styles.mapButtonText}>🗺️ Ver Mapa de Eventos</Text>
            </TouchableOpacity>

            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onPress={() => navigation.navigate("EventDetails", { event })}
                />
              ))
            ) : (
              <Text style={styles.noResults}>Nenhum evento encontrado.</Text>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    color: "#007AFF",
    textAlign: "center",
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  noResults: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  mapButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  mapButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
