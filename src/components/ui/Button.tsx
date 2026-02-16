import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export default function Button({ title, onPress, variant = 'primary', loading, disabled, style, textStyle }: ButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            style={[styles.base, styles[variant], isDisabled && styles.disabled, style]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? '#e94560' : '#fff'} />
            ) : (
                <Text style={[styles.text, variant === 'outline' && styles.outlineText, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    primary: { backgroundColor: '#e94560' },
    secondary: { backgroundColor: '#16213e' },
    outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#e94560' },
    danger: { backgroundColor: '#ff4757' },
    disabled: { opacity: 0.6 },
    text: { color: '#fff', fontSize: 16, fontWeight: '700' },
    outlineText: { color: '#e94560' },
});
