import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Platform, Linking } from 'react-native';

const GenerateScreen = ({ navigation }) => {
    const [data, setData] = useState(null);

    return (
        <View>
            <Text style={styles.buttonText}>Générer un QR Code</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default GenerateScreen;