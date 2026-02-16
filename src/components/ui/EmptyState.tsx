import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EmptyStateProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    message?: string;
}

export default function EmptyState({ icon = 'cube-outline', title, message }: EmptyStateProps) {
    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={64} color="#444" />
            <Text style={styles.title}>{title}</Text>
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    title: { color: '#aaa', fontSize: 18, fontWeight: '600', marginTop: 16 },
    message: { color: '#666', fontSize: 14, textAlign: 'center', marginTop: 8 },
});
