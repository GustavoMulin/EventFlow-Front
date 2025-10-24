import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal } from "react-native";

export default function Header({ navigation }) {
    const [menuVisible, setMenuVisible] = useState(false);

    return (
        <View style={styles.header}>
            {/* Logo e nome do app */}
            <View style={styles.logoContainer}>
                <Image
                    source={require("../assets/logo.jpg")}
                    style={styles.logo}
                />
                <Text style={styles.title}>EventFlow</Text>
            </View>

            <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
                <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>

            {/* Modal do menu */}
            <Modal visible={menuVisible} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setMenuVisible(false)}
                    activeOpacity={1}
                >
                    <View style={styles.menu}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                setMenuVisible(false);
                                navigation.navigate("Profile");
                            }}
                        >
                            <Text style={styles.menuText}>Ver Perfil</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                setMenuVisible(false);
                                navigation.navigate("CreateEvent");
                            }}
                        >
                            <Text style={styles.menuText}>Cadastrar Evento</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 15,
        paddingHorizontal: 20,
        elevation: 3,
    },
    logoContainer: { flexDirection: "row", alignItems: "center" },
    logo: { width: 40, height: 40, borderRadius: 8, marginRight: 10 },
    title: { fontSize: 20, fontWeight: "bold", color: "#007AFF" },
    menuButton: { padding: 8 },
    menuIcon: { fontSize: 26, color: "#007AFF" },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "flex-end",
    },
    menu: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 20,
    },
    menuItem: { paddingVertical: 10 },
    menuText: { fontSize: 18, color: "#007AFF" },
});
