import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ordersApi } from '../../api/orders';
import Card from '../../components/ui/Card';
import type { CustomerStackParamList, Order } from '../../types';

type Props = NativeStackScreenProps<CustomerStackParamList, 'OrderDetail'>;

const statusColors: Record<string, string> = {
    pending: '#f1c40f', processing: '#3498db', shipped: '#9b59b6', delivered: '#2ecc71', cancelled: '#e74c3c',
};

export default function OrderDetailScreen({ route }: Props) {
    const { orderId } = route.params;
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrder();
    }, []);

    const loadOrder = async () => {
        try {
            const res = await ordersApi.getById(orderId);
            setOrder(res.data.data);
        } catch { } finally { setLoading(false); }
    };

    if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color="#e94560" /></View>;
    if (!order) return <View style={styles.loader}><Text style={{ color: '#e94560' }}>Order not found</Text></View>;

    const color = statusColors[order.status] || '#888';

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
            <View style={styles.header}>
                <Text style={styles.orderNumber}>Order #{order.order_number}</Text>
                <View style={[styles.badge, { backgroundColor: color + '22' }]}>
                    <Text style={[styles.badgeText, { color }]}>{order.status.toUpperCase()}</Text>
                </View>
            </View>

            <Card style={{ marginTop: 16 }}>
                <Text style={styles.sectionTitle}>Items</Text>
                {order.items?.map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.itemName}>{item.product?.name}</Text>
                            <Text style={styles.itemQty}>Qty: {item.quantity} × ${item.price.toFixed(2)}</Text>
                        </View>
                        <Text style={styles.itemSubtotal}>${item.subtotal.toFixed(2)}</Text>
                    </View>
                ))}
            </Card>

            <Card style={{ marginTop: 12 }}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
                </View>
                <Text style={styles.date}>Placed on {new Date(order.created_at).toLocaleDateString()}</Text>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a2e' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    orderNumber: { color: '#fff', fontSize: 20, fontWeight: '800' },
    badge: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
    badgeText: { fontSize: 12, fontWeight: '800' },
    sectionTitle: { color: '#ccc', fontSize: 16, fontWeight: '700', marginBottom: 10 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#233554' },
    itemName: { color: '#eee', fontSize: 14, fontWeight: '600' },
    itemQty: { color: '#888', fontSize: 12, marginTop: 2 },
    itemSubtotal: { color: '#fff', fontSize: 14, fontWeight: '700' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
    totalLabel: { color: '#ccc', fontSize: 18, fontWeight: '700' },
    totalValue: { color: '#e94560', fontSize: 20, fontWeight: '800' },
    date: { color: '#666', fontSize: 12, marginTop: 8 },
});
