import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { authApi } from '../../api/auth';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import type { User } from '../../types';

export default function ProfileScreen() {
    const { user, logout } = useAuthStore();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await authApi.updateProfile({ name, email } as Partial<User>);
            Alert.alert('Success', 'Profile updated');
            setEditing(false);
        } catch (err: any) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
            {/* Avatar */}
            <View style={styles.avatarSection}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase()}</Text>
                </View>
                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
            </View>

            {/* Profile Form */}
            <Card style={{ marginTop: 20 }}>
                <Input label="Name" value={name} onChangeText={setName} editable={editing} />
                <Input label="Email" value={email} onChangeText={setEmail} editable={editing} keyboardType="email-address" autoCapitalize="none" />

                {editing ? (
                    <View style={styles.btnRow}>
                        <Button title="Cancel" variant="outline" onPress={() => setEditing(false)} style={{ flex: 1 }} />
                        <Button title="Save" onPress={handleSave} loading={saving} style={{ flex: 1, marginLeft: 10 }} />
                    </View>
                ) : (
                    <Button title="Edit Profile" variant="secondary" onPress={() => setEditing(true)} />
                )}
            </Card>

            {/* Logout */}
            <Button title="Logout" variant="danger" onPress={() => {
                Alert.alert('Logout', 'Are you sure?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Logout', style: 'destructive', onPress: logout },
                ]);
            }} style={{ marginTop: 20 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a2e' },
    avatarSection: { alignItems: 'center', marginTop: 10 },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e94560', alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#fff', fontSize: 32, fontWeight: '800' },
    userName: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 12 },
    userEmail: { color: '#888', fontSize: 14, marginTop: 4 },
    btnRow: { flexDirection: 'row' },
});
