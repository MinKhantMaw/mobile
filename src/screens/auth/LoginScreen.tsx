import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import type { AuthStackParamList } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdminMode, setIsAdminMode] = useState(false);
    const { login, adminLogin, isLoading, error, clearError } = useAuthStore();

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) return;
        if (isAdminMode) {
            await adminLogin(email, password);
        } else {
            await login(email, password);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>🛍️</Text>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>
                        {isAdminMode ? 'Admin Login' : 'Sign in to continue shopping'}
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {error && (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <Input
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={(t) => { setEmail(t); clearError(); }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Input
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={(t) => { setPassword(t); clearError(); }}
                        secureTextEntry
                    />

                    <Button
                        title={isAdminMode ? 'Admin Login' : 'Login'}
                        onPress={handleLogin}
                        loading={isLoading}
                        style={{ marginTop: 8 }}
                    />

                    {/* Toggle admin mode */}
                    <TouchableOpacity style={styles.adminToggle} onPress={() => setIsAdminMode(!isAdminMode)}>
                        <Text style={styles.adminToggleText}>
                            {isAdminMode ? '← Back to Customer Login' : 'Login as Admin'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                {!isAdminMode && (
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.linkText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a2e' },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
    header: { alignItems: 'center', marginBottom: 40 },
    logo: { fontSize: 48, marginBottom: 12 },
    title: { color: '#fff', fontSize: 28, fontWeight: '800' },
    subtitle: { color: '#888', fontSize: 15, marginTop: 6 },
    form: { width: '100%' },
    errorBox: { backgroundColor: '#e94560' + '22', borderRadius: 10, padding: 12, marginBottom: 16 },
    errorText: { color: '#e94560', fontSize: 14, fontWeight: '600', textAlign: 'center' },
    adminToggle: { alignItems: 'center', marginTop: 20 },
    adminToggleText: { color: '#3498db', fontSize: 14, fontWeight: '600' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
    footerText: { color: '#888', fontSize: 14 },
    linkText: { color: '#e94560', fontSize: 14, fontWeight: '700' },
});
