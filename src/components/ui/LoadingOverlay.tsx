import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function LoadingOverlay() {
    return (
        <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#e94560" />
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(26, 26, 46, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
});
