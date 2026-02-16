import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export default function Input({ label, error, style, ...props }: InputProps) {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, error && styles.inputError, style]}
                placeholderTextColor="#666"
                {...props}
            />
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    label: { color: '#ccc', fontSize: 14, fontWeight: '600', marginBottom: 6 },
    input: {
        backgroundColor: '#16213e',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#233554',
    },
    inputError: { borderColor: '#e94560' },
    error: { color: '#e94560', fontSize: 12, marginTop: 4 },
});
