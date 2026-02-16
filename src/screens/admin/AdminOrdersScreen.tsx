import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { adminApi } from '../../api/admin';
import OrderCard from '../../components/shop/OrderCard';
import EmptyState from '../../components/ui/EmptyState';
import type { AdminStackParamList, Order } from '../../types';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminOrders'>;

export default function AdminOrdersScreen({ navigation }: Props) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadOrders = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true); else setLoading(true);
        try {
            const res = await adminApi.getOrders();
            setOrders(res.data.data.data);
        } catch { } finally { setLoading(false); setRefreshing(false); }
    };

    useEffect(() => { loadOrders(); }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                renderItem={({ item }) => (
                    <OrderCard order={item} onPress={() => navigation.navigate('AdminOrderDetail', { orderId: String(item.id) })} />
                )}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadOrders(true)} tintColor="#e94560" />}
                ListEmptyComponent={!loading ? <EmptyState icon="receipt-outline" title="No Orders" /> : null}
                ListFooterComponent={loading ? <ActivityIndicator style={{ margin: 20 }} color="#e94560" /> : null}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a23' },
    list: { padding: 12, flexGrow: 1 },
});
