import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import type { AuthStackParamList } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const { register, isLoading, error, clearError } = useAuthStore();

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) return;
        await register({ name, email, password, password_confirmation: passwordConfirmation });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join us and start shopping</Text>

                {error && (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <Input label="Full Name" placeholder="John Doe" value={name} onChangeText={(t) => { setName(t); clearError(); }} />
                <Input label="Email" placeholder="john@example.com" value={email} onChangeText={(t) => { setEmail(t); clearError(); }} keyboardType="email-address" autoCapitalize="none" />
                <Input label="Password" placeholder="Min 8 characters" value={password} onChangeText={(t) => { setPassword(t); clearError(); }} secureTextEntry />
                <Input label="Confirm Password" placeholder="Re-enter password" value={passwordConfirmation} onChangeText={(t) => { setPasswordConfirmation(t); clearError(); }} secureTextEntry />

                <Button title="Create Account" onPress={handleRegister} loading={isLoading} style={{ marginTop: 8 }} />

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.linkText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a2e' },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
    title: { color: '#fff', fontSize: 28, fontWeight: '800', textAlign: 'center' },
    subtitle: { color: '#888', fontSize: 15, textAlign: 'center', marginTop: 6, marginBottom: 30 },
    errorBox: { backgroundColor: '#e94560' + '22', borderRadius: 10, padding: 12, marginBottom: 16 },
    errorText: { color: '#e94560', fontSize: 14, fontWeight: '600', textAlign: 'center' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    footerText: { color: '#888', fontSize: 14 },
    linkText: { color: '#e94560', fontSize: 14, fontWeight: '700' },
});
