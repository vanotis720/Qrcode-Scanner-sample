import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import colors from '../styles/colors';
import { removeFromHistory } from "../utils/history";
import { getHistory } from "../utils/history";

const isUrl = (value) =>
    typeof value === "string" &&
    (value.startsWith("http") || value.startsWith("https") || value.startsWith("www."));

export const History = ({ item, index, setHistory }) => {
    const [openingIndex, setOpeningIndex] = useState(null);
    const [errorIndex, setErrorIndex] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    const clickable = isUrl(item.value);

    const date = item.date
        ? new Date(item.date).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : "";

    const openLink = async (url, setOpening, setError) => {
        setOpening(true);
        setError(null);
        try {
            if (url.startsWith('www.')) {
                url = `https://${url}`;
            }
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                setError("Le lien n'est pas valide ou ne peut pas être ouvert.");
            }
        } catch (e) {
            setError("Une erreur s'est produite lors de la redirection vers le lien");
        } finally {
            setOpening(false);
        }
    };

    const handlePress = clickable ? async () => {
        setOpeningIndex(index);
        setErrorIndex(null);
        setErrorMsg("");
        await openLink(
            item.value,
            (v) => v ? setOpeningIndex(index) : setOpeningIndex(null),
            (msg) => {
                setErrorIndex(index);
                setErrorMsg(msg);
            }
        );
    }
        : undefined;

    return (
        <View style={styles.historyCard}>
            <View style={styles.historyRow}>
                <View style={styles.iconContainer}>
                    <AntDesign name="qrcode" size={35} color="black" />
                </View>
                <TouchableOpacity
                    activeOpacity={clickable ? 0.7 : 1}
                    style={{ flex: 1, justifyContent: "center" }}
                    onPress={handlePress}
                    disabled={!clickable || openingIndex === index}
                >
                    <Text
                        style={[
                            styles.historyValue,
                            clickable && { color: colors.actionButton, textDecorationLine: "underline" }
                        ]}
                        numberOfLines={2}
                        selectable
                    >
                        {item.value}
                    </Text>
                    <Text style={styles.historyType}>
                        {clickable ? 'Lien cliquable' : 'Texte brut'}
                    </Text>
                    {errorIndex === index && (
                        <Text style={styles.historyError}>{errorMsg}</Text>
                    )}
                </TouchableOpacity>
                <View style={{ alignItems: "flex-end", justifyContent: "space-between", marginLeft: 10 }}>
                    <TouchableOpacity
                        style={{ marginBottom: 8 }}
                        onPress={async () => {
                            await removeFromHistory(index);
                            const updated = await getHistory();
                            setHistory(updated);
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="trash-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                    <Text style={styles.historyDate}>{date}</Text>
                    {openingIndex === index && (
                        <ActivityIndicator color={colors.actionButton} style={{ marginTop: 4 }} />
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    historyCard: {
        backgroundColor: colors.surfaceLight,
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2,
    },
    historyRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    iconContainer: {
        width: 35,
        height: 35,
        borderRadius: 20,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    historyValue: {
        fontSize: 16,
        color: colors.text,
        fontWeight: "500",
        marginBottom: 6,
    },
    historyType: {
        fontSize: 14,
        color: colors.lightText,
        marginBottom: 4,
    },
    historyDate: {
        fontSize: 13,
        color: colors.lightText,
        marginBottom: 2,
    },
    historyError: {
        color: colors.error,
        fontSize: 13,
        marginTop: 4,
        fontWeight: "600",
    },
});