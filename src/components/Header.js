import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from "react-native";

export default function Header({ navigation, handleLogout }) {
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => setMenuVisible(!menuVisible);

    return (
        <View style={styles.header}>
            {/* Logo e nome */}
            <View style={styles.logoContainer}>
                <Image source={require("../assets/logo.jpg")} style={styles.logo} />
                <Text style={styles.appName}>EventFlow</Text>
            </View>

            {/* Botão de menu (⋯) */}
            <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                <Text style={styles.menuText}>⋯</Text>
            </TouchableOpacity>

            {/* Menu dropdown */}
            <Modal
                transparent
                visible={menuVisible}
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setMenuVisible(false)}
                    activeOpacity={1}
                >
                    <View style={styles.menu}>
                        <TouchableOpacity
                            onPress={() => {
                                setMenuVisible(false);
                                navigation.navigate("Profile");
                            }}
                            style={styles.menuItem}
                        >
                            <Text style={styles.menuItemText}>Ver Perfil</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setMenuVisible(false);
                                navigation.navigate("CreateEvent");
                            }}
                            style={styles.menuItem}
                        >
                            <Text style={styles.menuItemText}>Cadastrar Evento</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setMenuVisible(false);
                                navigation.navigate("CreateLocation");
                            }}
                            style={styles.menuItem}
                        >
                            <Text style={styles.menuItemText}>Cadastrar Local</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setMenuVisible(false);
                                navigation.navigate("LocationList");
                            }}
                            style={styles.menuItem}
                        >
                            <Text style={styles.menuItemText}>Ver Locais Cadastrados</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setMenuVisible(false);
                                if (handleLogout) handleLogout();
                            }}
                            style={[styles.menuItem, styles.logoutItem]}
                        >
                            <Text style={[styles.menuItemText, styles.logoutText]}>Sair</Text>
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
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: "#fff",
        elevation: 4,
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    logo: {
        width: 40,
        height: 40,
        resizeMode: "contain",
        marginRight: 8,
    },
    appName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#007AFF",
    },
    menuButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    menuText: {
        fontSize: 28,
        color: "#007AFF",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.1)",
    },
    menu: {
        position: "absolute",
        top: 70,
        right: 15,
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    menuItemText: {
        fontSize: 16,
        color: "#007AFF",
    },
    logoutItem: {
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    logoutText: {
        color: "red",
    },
});
