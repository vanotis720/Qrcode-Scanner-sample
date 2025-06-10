import React, { useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
    Linking,
    StatusBar as RNStatusBar
} from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Overlay } from "../components/Overlay";
import colors from "../styles/colors";
import { shadows } from "../styles/shadows";
import { StatusBar } from "expo-status-bar";

const ScanScreen = ({ navigation }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const isPermissionGranted = permission?.granted;
    const [dataScanned, setDataScanned] = useState(null);
    const [flashOn, setFlashOn] = useState(false);

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
            <View style={styles.permissionContainer}>
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
                <StatusBar style="auto" />
            </View>
        );
    }

    if (dataScanned) {
        return (
            <View style={styles.resultContainer}>
                <StatusBar style="auto" />
                <View style={styles.resultHeader}>
                    <Text style={styles.resultTitle}>QR Code Scanné</Text>
                    <MaterialCommunityIcons name="check-circle" size={64} color={colors.success} />
                </View>

                <View style={styles.resultCard}>
                    <Text style={styles.resultLabel}>Résultat:</Text>
                    <Text style={styles.resultData}>{dataScanned}</Text>

                    {dataScanned.startsWith('http') || dataScanned.startsWith('https') ? (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => Linking.openURL(dataScanned)}
                        >
                            <Ionicons name="open-outline" size={20} color={colors.inverseText} />
                            <Text style={styles.actionButtonText}>Ouvrir le lien</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>

                <TouchableOpacity
                    onPress={() => setDataScanned(null)}
                    style={styles.scanAgainButton}
                >
                    <MaterialCommunityIcons name="qrcode-scan" size={24} color={colors.inverseText} />
                    <Text style={styles.scanAgainButtonText}>Scanner à nouveau</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={StyleSheet.absoluteFillObject}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing='back'
                enableTorch={flashOn}
                onBarcodeScanned={({ data }) => {
                    if (data) {
                        qrcodeData(data);
                    }
                }}
            />
            <Overlay />

            {/* Header Bar */}
            <SafeAreaView style={styles.headerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerButton}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Scanner QR Code</Text>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => setFlashOn(!flashOn)}
                    >
                        <MaterialCommunityIcons
                            name={flashOn ? "flash" : "flash-off"}
                            size={24}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Instructions */}
            <View style={styles.scanInstructionsContainer}>
                <View style={styles.scanInstructionsBox}>
                    <MaterialCommunityIcons name="qrcode-scan" size={20} color="white" style={styles.instructionIcon} />
                    <Text style={styles.scanInstructionsText}>
                        Placez le QR code dans le cadre
                    </Text>
                </View>
            </View>
        </View>
    );
};

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
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight + 12 : 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
    scanInstructionsContainer: {
        position: "absolute",
        bottom: 80,
        left: 0,
        right: 0,
        alignItems: "center",
    },
    scanInstructionsBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
    },
    instructionIcon: {
        marginRight: 8,
    },
    scanInstructionsText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
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
    resultContainer: {
        flex: 1,
        backgroundColor: colors.primary,
        padding: 20,
    },
    resultHeader: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 30,
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.inverseText,
        marginBottom: 20,
    },
    resultCard: {
        backgroundColor: colors.background,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        ...shadows.card,
    },
    resultLabel: {
        fontSize: 16,
        color: colors.lightText,
        marginBottom: 8,
    },
    resultData: {
        fontSize: 18,
        color: colors.text,
        fontWeight: '500',
        marginBottom: 20,
    },
    scanAgainButton: {
        backgroundColor: colors.accent,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 30,
        ...shadows.button,
    },
    scanAgainButtonText: {
        color: colors.inverseText,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    actionButton: {
        backgroundColor: colors.actionButton,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    actionButtonText: {
        color: colors.inverseText,
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
});

export default ScanScreen;