import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { adminApi } from '../../api/admin';
import Card from '../../components/ui/Card';
import type { AdminStackParamList, Order, OrderStatus } from '../../types';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminOrderDetail'>;

const statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColors: Record<string, string> = {
    pending: '#f1c40f', processing: '#3498db', shipped: '#9b59b6', delivered: '#2ecc71', cancelled: '#e74c3c',
};

export default function AdminOrderDetailScreen({ route }: Props) {
    const { orderId } = route.params;
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => { loadOrder(); }, []);

    const loadOrder = async () => {
        try {
            const res = await adminApi.getOrder(orderId);
            setOrder(res.data.data);
        } catch { } finally { setLoading(false); }
    };

    const handleStatusUpdate = async (status: string) => {
        setUpdating(true);
        try {
            await adminApi.updateOrderStatus(orderId, status);
            setOrder((prev) => prev ? { ...prev, status: status as OrderStatus } : null);
            Alert.alert('Success', `Order status updated to ${status}`);
        } catch (err: any) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to update status');
        } finally { setUpdating(false); }
    };

    if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color="#e94560" /></View>;
    if (!order) return <View style={styles.loader}><Text style={{ color: '#e94560' }}>Order not found</Text></View>;

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
            <Text style={styles.title}>Order #{order.order_number}</Text>
            <Text style={styles.total}>Total: ${order.total.toFixed(2)}</Text>

            {/* Status Chips */}
            <Card style={{ marginTop: 16 }}>
                <Text style={styles.sectionTitle}>Update Status</Text>
                <View style={styles.chipRow}>
                    {statuses.map((s) => (
                        <TouchableOpacity
                            key={s}
                            style={[styles.chip, order.status === s && { backgroundColor: statusColors[s] }]}
                            onPress={() => handleStatusUpdate(s)}
                            disabled={updating}
                        >
                            <Text style={[styles.chipText, order.status === s && { color: '#fff' }]}>{s}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Card>

            {/* Items */}
            <Card style={{ marginTop: 12 }}>
                <Text style={styles.sectionTitle}>Items</Text>
                {order.items?.map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                        <Text style={styles.itemName}>{item.product?.name}</Text>
                        <Text style={styles.itemPrice}>{item.quantity}x ${item.price.toFixed(2)}</Text>
                    </View>
                ))}
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a23' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a23' },
    title: { color: '#fff', fontSize: 22, fontWeight: '800' },
    total: { color: '#e94560', fontSize: 18, fontWeight: '700', marginTop: 4 },
    sectionTitle: { color: '#ccc', fontSize: 16, fontWeight: '700', marginBottom: 10 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { backgroundColor: '#233554', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
    chipText: { color: '#aaa', fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#233554' },
    itemName: { color: '#eee', fontSize: 14, flex: 1 },
    itemPrice: { color: '#fff', fontWeight: '600' },
});
