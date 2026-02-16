import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuthStore } from '../store/authStore';
import AdminNavigator from './AdminNavigator';
import AuthNavigator from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';

export default function RootNavigator() {
    const { isAuthenticated, isAdmin, isLoading, loadToken } = useAuthStore();

    useEffect(() => {
        loadToken();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#e94560" />
            </View>
        );
    }

    if (!isAuthenticated) return <AuthNavigator />;
    if (isAdmin) return <AdminNavigator />;
    return <CustomerNavigator />;
}

const styles = StyleSheet.create({
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' },
});
