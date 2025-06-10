import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Platform, Linking } from 'react-native';

const HistoryScreen = ({ navigation }) => {
    const [data, setData] = useState(null);

    return (
        <View>
            <Text style={styles.buttonText}>Historique des QR Codes</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default HistoryScreen;