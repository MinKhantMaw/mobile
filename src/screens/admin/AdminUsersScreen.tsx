import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { adminApi } from '../../api/admin';
import EmptyState from '../../components/ui/EmptyState';
import type { User } from '../../types';

export default function AdminUsersScreen() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadUsers = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true); else setLoading(true);
        try {
            const res = await adminApi.getUsers();
            setUsers(res.data.data.data);
        } catch { } finally { setLoading(false); setRefreshing(false); }
    };

    useEffect(() => { loadUsers(); }, []);

    const handleDelete = (id: number) => {
        Alert.alert('Delete User', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive',
                onPress: async () => {
                    try {
                        await adminApi.deleteUser(id);
                        setUsers((prev) => prev.filter((u) => u.id !== id));
                    } catch (err: any) {
                        Alert.alert('Error', err.response?.data?.message || 'Delete failed');
                    }
                },
            },
        ]);
    };

    const renderUser = ({ item }: { item: User }) => (
        <View style={styles.card}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
                <View style={styles.rolesRow}>
                    {item.roles?.map((r) => (
                        <View key={r.id} style={styles.roleBadge}>
                            <Text style={styles.roleText}>{r.name}</Text>
                        </View>
                    ))}
                </View>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#e94560" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                renderItem={renderUser}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadUsers(true)} tintColor="#e94560" />}
                ListEmptyComponent={!loading ? <EmptyState icon="people-outline" title="No Users" /> : null}
                ListFooterComponent={loading ? <ActivityIndicator style={{ margin: 20 }} color="#e94560" /> : null}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a23' },
    list: { padding: 12, flexGrow: 1 },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', borderRadius: 12, padding: 14, marginBottom: 10 },
    avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0f3460', alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
    info: { flex: 1, marginLeft: 12 },
    name: { color: '#eee', fontSize: 15, fontWeight: '700' },
    email: { color: '#888', fontSize: 13, marginTop: 2 },
    rolesRow: { flexDirection: 'row', marginTop: 4, gap: 4 },
    roleBadge: { backgroundColor: '#3498db' + '33', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
    roleText: { color: '#3498db', fontSize: 10, fontWeight: '700' },
});
