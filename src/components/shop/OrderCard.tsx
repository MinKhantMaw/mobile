import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Order } from '../../types';

interface OrderCardProps {
    order: Order;
    onPress: () => void;
}

const statusColors: Record<string, string> = {
    pending: '#f1c40f',
    processing: '#3498db',
    shipped: '#9b59b6',
    delivered: '#2ecc71',
    cancelled: '#e74c3c',
};

export default function OrderCard({ order, onPress }: OrderCardProps) {
    const color = statusColors[order.status] || '#888';

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.header}>
                <Text style={styles.orderNumber}>#{order.order_number}</Text>
                <View style={[styles.statusBadge, { backgroundColor: color + '22' }]}>
                    <Text style={[styles.statusText, { color }]}>{order.status.toUpperCase()}</Text>
                </View>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>{order.items?.length || 0} items</Text>
                <Text style={styles.total}>${order.total.toFixed(2)}</Text>
            </View>
            <View style={styles.footer}>
                <Ionicons name="time-outline" size={14} color="#666" />
                <Text style={styles.date}>{new Date(order.created_at).toLocaleDateString()}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: '#16213e', borderRadius: 12, padding: 16, marginBottom: 10 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    orderNumber: { color: '#eee', fontSize: 16, fontWeight: '700' },
    statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
    statusText: { fontSize: 11, fontWeight: '800' },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    label: { color: '#888', fontSize: 14 },
    total: { color: '#e94560', fontSize: 16, fontWeight: '800' },
    footer: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 },
    date: { color: '#666', fontSize: 12 },
});
