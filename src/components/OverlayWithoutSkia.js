import React from 'react';
import { View, Dimensions, StyleSheet, Platform } from 'react-native';

const innerDimension = 300;

export const OverlayWithoutSkia = () => {
    return (
        <View style={styles.container}>
            <View style={styles.overlaySection} />

            <View style={styles.middleSection}>
                <View style={styles.sideOverlay} />
                <View style={styles.transparent} />
                <View style={styles.sideOverlay} />
            </View>

            <View style={styles.overlaySection} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...Platform.OS === 'android' ? { flex: 1 } : StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    overlaySection: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    middleSection: {
        flexDirection: 'row',
        height: innerDimension,
    },
    sideOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    transparent: {
        width: innerDimension,
        height: innerDimension,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'gray',
    },
});