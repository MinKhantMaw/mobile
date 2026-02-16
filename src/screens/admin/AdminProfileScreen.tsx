import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuthStore } from '../../store/authStore';

export default function AdminProfileScreen() {
    const { user, logout } = useAuthStore();

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
            <View style={styles.avatarSection}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase()}</Text>
                </View>
                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
                <View style={styles.adminBadge}>
                    <Text style={styles.adminText}>ADMIN</Text>
                </View>
            </View>

            <Card style={{ marginTop: 24 }}>
                <View style={styles.row}>
                    <Text style={styles.label}>Roles</Text>
                    <Text style={styles.value}>{user?.roles?.map((r) => r.name).join(', ') || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Status</Text>
                    <Text style={styles.value}>{user?.status || 'Active'}</Text>
                </View>
            </Card>

            <Button title="Logout" variant="danger" onPress={() => {
                Alert.alert('Logout', 'Are you sure?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Logout', style: 'destructive', onPress: logout },
                ]);
            }} style={{ marginTop: 24 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a23' },
    avatarSection: { alignItems: 'center', marginTop: 10 },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#0f3460', alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#fff', fontSize: 32, fontWeight: '800' },
    userName: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 12 },
    userEmail: { color: '#888', fontSize: 14, marginTop: 4 },
    adminBadge: { backgroundColor: '#e94560', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 4, marginTop: 8 },
    adminText: { color: '#fff', fontSize: 12, fontWeight: '800' },
    row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#233554' },
    label: { color: '#888', fontSize: 14 },
    value: { color: '#eee', fontSize: 14, fontWeight: '600' },
});
