import React, { useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
    Linking,
    StatusBar as RNStatusBar,
    ActivityIndicator
} from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Overlay } from "../components/Overlay";
import colors from "../styles/colors";
import { shadows } from "../styles/shadows";
import { StatusBar } from "expo-status-bar";
import { addToHistory } from "../utils/history";
import { useIsFocused } from '@react-navigation/native';

const ScanScreen = ({ navigation }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const isPermissionGranted = permission?.granted;
    const [dataScanned, setDataScanned] = useState(null);
    const [flashOn, setFlashOn] = useState(false);
    const [isUrl, setIsUrl] = useState(false);
    const [opening, setOpening] = useState(false);
    const [error, setError] = useState(null);
    const isFocused = useIsFocused();

    const qrcodeData = (data) => {
        console.log('Scanned data:', data);
        setDataScanned(data);
        addToHistory({ value: data });
        if (data.startsWith('http') || data.startsWith('https') || data.startsWith('www.')) {
            setDataScanned(data);
            setIsUrl(true);
        }
        else {
            setDataScanned(data);
        }
    }

    const openLink = async (url) => {
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

    if (permission === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
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

    return (
        <View style={StyleSheet.absoluteFillObject}>
            {isFocused && (
                <CameraView
                    style={StyleSheet.absoluteFillObject}
                    facing='back'
                    enableTorch={flashOn}
                    onBarcodeScanned={({ data }) => {
                        if (data && !dataScanned) {
                            qrcodeData(data);
                        }
                    }}
                />
            )}
            <Overlay />

            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Historique')}>
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
            </View>

            <View style={styles.scanInstructionsContainer}>
                <View style={styles.scanInstructionsBox}>
                    <MaterialCommunityIcons name="qrcode-scan" size={20} color="white" style={styles.instructionIcon} />
                    <Text style={styles.scanInstructionsText}>
                        Placez le QR code dans le cadre
                    </Text>
                </View>
            </View>

            {/* Show result overlay if scanned */}
            {dataScanned && (
                <View style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: 'rgba(255,255,255,0.98)',
                    zIndex: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={styles.resultModernWrapper}>
                        <View style={styles.resultModernIconCircle}>
                            <MaterialCommunityIcons name="check-circle" size={56} color={colors.success} />
                        </View>
                        <Text style={styles.resultModernTitle}>Code scanné !</Text>
                        <View style={styles.resultModernCard}>
                            <Text style={styles.resultModernLabel}>Résultat</Text>
                            <View style={styles.resultModernDivider} />
                            <Text
                                style={styles.resultModernData}
                                selectable
                                numberOfLines={10}
                            >
                                {dataScanned}
                            </Text>
                            {isUrl ? (
                                <>
                                    {error ? (
                                        <Text style={styles.resultModernError}>{error}</Text>
                                    ) : null}
                                    <TouchableOpacity
                                        style={styles.resultModernActionButton}
                                        onPress={() => openLink(dataScanned)}
                                        disabled={opening}
                                    >
                                        {opening ? (
                                            <ActivityIndicator color={colors.inverseText} size="small" style={{ marginRight: 8 }} />
                                        ) : (
                                            <Ionicons name="open-outline" size={18} color={colors.inverseText} />
                                        )}
                                        <Text style={styles.resultModernActionButtonText}>
                                            {opening ? "Ouverture..." : "Ouvrir le lien"}
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            ) : null}
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            setDataScanned(null);
                            setIsUrl(false);
                            setError(null);
                        }}
                        style={styles.resultModernScanAgainButton}
                        activeOpacity={0.85}
                    >
                        <MaterialCommunityIcons name="qrcode-scan" size={30} color={colors.inverseText} />
                    </TouchableOpacity>
                </View>
            )}
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
    resultModernWrapper: {
        flex: 1,
        alignItems: 'center',
        padding: 24,
        backgroundColor: colors.background,
        width: '100%',
    },
    resultModernIconCircle: {
        backgroundColor: "#E8F8EF",
        borderRadius: 40,
        padding: 14,
        marginBottom: 18,
    },
    resultModernTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 22,
        textAlign: 'center',
    },
    resultModernCard: {
        width: '100%',
        backgroundColor: colors.surfaceLight,
        borderRadius: 16,
        padding: 20,
        ...shadows.card,
        marginBottom: 16,
    },
    resultModernLabel: {
        fontSize: 13,
        color: colors.lightText,
        fontWeight: "600",
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    resultModernDivider: {
        height: 1,
        backgroundColor: "#ECECEC",
        marginVertical: 8,
        borderRadius: 1,
    },
    resultModernData: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
        marginBottom: 18,
        lineHeight: 22,
    },
    resultModernActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        backgroundColor: colors.actionButton,
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 22,
        marginTop: 4,
    },
    resultModernActionButtonText: {
        color: colors.inverseText,
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 6,
    },
    resultModernScanAgainButton: {
        position: 'absolute',
        bottom: 40,
        right: 20,
        alignSelf: 'flex-end',
        backgroundColor: colors.accent,
        padding: 18,
        borderRadius: 20,
        alignItems: 'center',
        ...shadows.card,
    },
    resultModernError: {
        color: colors.error,
        fontSize: 14,
        marginBottom: 8,
        fontWeight: "600",
    },
});

export default ScanScreen;