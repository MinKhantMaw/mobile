import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { adminApi } from '../../api/admin';
import EmptyState from '../../components/ui/EmptyState';
import type { AdminStackParamList, Product } from '../../types';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminProducts'>;

export default function AdminProductsScreen({ navigation }: Props) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadProducts = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true); else setLoading(true);
        try {
            const res = await adminApi.getProducts();
            setProducts(res.data.data.data);
        } catch { } finally { setLoading(false); setRefreshing(false); }
    };

    useEffect(() => { loadProducts(); }, []);

    const handleDelete = (id: number) => {
        Alert.alert('Delete Product', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive',
                onPress: async () => {
                    try {
                        await adminApi.deleteProduct(id);
                        setProducts((prev) => prev.filter((p) => p.id !== id));
                    } catch (err: any) {
                        Alert.alert('Error', err.response?.data?.message || 'Delete failed');
                    }
                },
            },
        ]);
    };

    const renderItem = ({ item }: { item: Product }) => (
        <View style={styles.card}>
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.price}>${parseFloat(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
                <Text style={styles.stock}>Stock: {item.stock}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => navigation.navigate('AdminProductForm', { productId: item.id })}>
                    <Ionicons name="create-outline" size={22} color="#3498db" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash-outline" size={22} color="#e94560" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadProducts(true)} tintColor="#e94560" />}
                ListEmptyComponent={!loading ? <EmptyState icon="cube-outline" title="No Products" /> : null}
                ListFooterComponent={loading ? <ActivityIndicator style={{ margin: 20 }} color="#e94560" /> : null}
            />
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AdminProductForm', {})}>
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a23' },
    list: { padding: 12, flexGrow: 1 },
    card: { flexDirection: 'row', backgroundColor: '#16213e', borderRadius: 12, padding: 14, marginBottom: 10, alignItems: 'center' },
    info: { flex: 1 },
    name: { color: '#eee', fontSize: 15, fontWeight: '700' },
    price: { color: '#e94560', fontSize: 14, fontWeight: '600', marginTop: 2 },
    stock: { color: '#888', fontSize: 12, marginTop: 2 },
    actions: { flexDirection: 'row', gap: 16 },
    fab: {
        position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28,
        backgroundColor: '#e94560', alignItems: 'center', justifyContent: 'center',
        shadowColor: '#e94560', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
    },
});
