import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator, StyleSheet, Alert, Text } from "react-native";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import api from "../api/api";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data);
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        <Header navigation={navigation} />
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
        ) : (
          <ScrollView contentContainerStyle={styles.container}>
            <Text>Eventos Disponíveis</Text>
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onPress={() => navigation.navigate("EventDetails", { event })}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
});
