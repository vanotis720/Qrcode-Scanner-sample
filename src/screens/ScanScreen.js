import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Platform, Linking } from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Overlay } from "../components/Overlay";
import colors from "../styles/colors";
import { shadows } from "../styles/shadows";

const ScanScreen = ({ navigation }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const isPermissionGranted = permission?.granted;
    const [dataScanned, setDataScanned] = useState(null);

    const qrcodeData = (data) => {
        console.log('Scanned data:', data);
        if (data.startsWith('http') || data.startsWith('https')) {
            Linking.openURL(data).catch(err => console.error('Error opening URL:', err));
        }
        else {
            setDataScanned(data);
            console.log('QR Code Data:', data);
        }
    }

    if (!isPermissionGranted) {
        return (
            <SafeAreaView style={styles.permissionContainer}>
                <View style={styles.permissionCard}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="qrcode-scan" size={80} color={colors.primary} />
                    </View>
                    <Text style={styles.permissionTitle}>Accès caméra requis</Text>
                    <Text style={styles.permissionDescription}>
                        Pour scanner des QR codes, l'application a besoin d'accéder à votre caméra.
                    </Text>
                    <TouchableOpacity
                        onPress={requestPermission}
                        style={styles.permissionButton}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.permissionButtonText}>
                            Autoriser l'accès
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (dataScanned) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>QR Code Scanné: {dataScanned}</Text>
                <TouchableOpacity onPress={() => setDataScanned(null)} style={styles.button}>
                    <Text style={styles.buttonText}>Scanner un autre QR Code</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={StyleSheet.absoluteFillObject}>
            {Platform.OS === 'android' && <StatusBar hidden />}
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing='back'
                onBarcodeScanned={({ data }) => {
                    if (data) {
                        qrcodeData(data);
                    }
                }}
            />
            <Overlay />

            <View style={styles.scanInstructionsContainer}>
                <Text style={styles.scanInstructionsText}>
                    Placez le QR code dans le cadre pour scanner
                </Text>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    scanInstructionsContainer: {
        position: "absolute",
        bottom: 100,
        left: 0,
        right: 0,
        alignItems: "center",
    },
    scanInstructionsText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    permissionContainer: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    permissionCard: {
        backgroundColor: colors.background,
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        shadowColor: colors.text,
    },
    iconContainer: {
        backgroundColor: colors.surfaceLight,
        borderRadius: 60,
        padding: 20,
        marginBottom: 24,
        ...shadows.card,
    },
    permissionTitle: {
        fontSize: 22,
        color: colors.text,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    permissionDescription: {
        fontSize: 16,
        color: colors.lightText,
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 22,
    },
    permissionButton: {
        backgroundColor: colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 50,
        width: '100%',
        alignItems: 'center',
        marginTop: 8,
        ...shadows.card,
    },
    permissionButtonText: {
        color: colors.inverseText,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ScanScreen;