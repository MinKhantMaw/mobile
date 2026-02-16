import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { adminApi } from '../../api/admin';
import Card from '../../components/ui/Card';
import type { AnalyticsOverview } from '../../types';

export default function DashboardScreen() {
    const [data, setData] = useState<AnalyticsOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true); else setLoading(true);
        try {
            const res = await adminApi.getOverview();
            setData(res.data.data);
        } catch { } finally { setLoading(false); setRefreshing(false); }
    };

    useEffect(() => { loadData(); }, []);

    if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color="#e94560" /></View>;

    const stats = [
        { label: 'Revenue', value: `$${data?.total_revenue?.toFixed(2) || '0'}`, icon: 'cash-outline' as const, color: '#2ecc71' },
        { label: 'Orders', value: String(data?.total_orders || 0), icon: 'receipt-outline' as const, color: '#3498db' },
        { label: 'Products', value: String(data?.total_products || 0), icon: 'cube-outline' as const, color: '#e94560' },
        { label: 'Customers', value: String(data?.total_customers || 0), icon: 'people-outline' as const, color: '#f1c40f' },
    ];

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ padding: 16 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} tintColor="#e94560" />}
        >
            <Text style={styles.title}>Dashboard</Text>

            <View style={styles.grid}>
                {stats.map((s) => (
                    <Card key={s.label} style={styles.statCard}>
                        <Ionicons name={s.icon} size={28} color={s.color} />
                        <Text style={styles.statValue}>{s.value}</Text>
                        <Text style={styles.statLabel}>{s.label}</Text>
                    </Card>
                ))}
            </View>

            {/* Recent Orders */}
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            {data?.recent_orders?.map((order) => (
                <Card key={order.id} style={{ marginBottom: 8 }}>
                    <View style={styles.orderRow}>
                        <Text style={styles.orderNum}>#{order.order_number}</Text>
                        <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
                    </View>
                    <Text style={styles.orderStatus}>{order.status}</Text>
                </Card>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a23' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a23' },
    title: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 16 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    statCard: { width: '48%', alignItems: 'center', paddingVertical: 20 },
    statValue: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 8 },
    statLabel: { color: '#888', fontSize: 13, marginTop: 4 },
    sectionTitle: { color: '#ccc', fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 12 },
    orderRow: { flexDirection: 'row', justifyContent: 'space-between' },
    orderNum: { color: '#eee', fontSize: 14, fontWeight: '600' },
    orderTotal: { color: '#e94560', fontWeight: '700' },
    orderStatus: { color: '#888', fontSize: 12, marginTop: 4, textTransform: 'capitalize' },
});
