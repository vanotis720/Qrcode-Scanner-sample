import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList, Linking } from 'react-native';
import colors from "../styles/colors";
import { getHistory } from "../utils/history";
import { History } from "../components/History";

const HistoryScreen = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getHistory().then(setHistory).finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historique des QR Codes</Text>
            {history.length === 0 ? (
                <Text style={styles.emptyText}>Aucun historique pour le moment.</Text>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(_, idx) => idx.toString()}
                    renderItem={({ item, index }) => (
                        <History item={item} index={index} setHistory={setHistory} />
                    )}
                    contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: colors.text,
        marginTop: 24,
        marginBottom: 12,
        alignSelf: "center",
    },
    emptyText: {
        color: colors.lightText,
        fontSize: 16,
        textAlign: "center",
        marginTop: 40,
    },
});

export default HistoryScreen;