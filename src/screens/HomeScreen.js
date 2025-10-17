import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, Button } from "react-native";
import api from "../api/api";

export default function HomeScreen({ navigation }) {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { carregarEventos(); }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Carregando eventos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Eventos</Text>

      <FlatList
        data={eventos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{item.nome}</Text>
            <Text>Data: {item.data}</Text>
            <Text>Preço: R$ {item.preco}</Text>
            <Text>Categoria: {item.categoria?.nome || "Sem categoria"}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#007AFF" },
  eventCard: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 10 },
  eventTitle: { fontWeight: "bold", fontSize: 16 },
});
