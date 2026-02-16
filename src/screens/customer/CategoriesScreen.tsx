import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EmptyState from '../../components/ui/EmptyState';
import { useProductStore } from '../../store/productStore';
import type { Category } from '../../types';

export default function CategoriesScreen() {
    const { categories, fetchCategories, isLoading } = useProductStore();

    useEffect(() => {
        fetchCategories();
    }, []);

    const renderCategory = ({ item }: { item: Category }) => (
        <TouchableOpacity style={styles.card}>
            <View style={styles.iconBox}>
                <Ionicons name="grid-outline" size={28} color="#e94560" />
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                {item.description && <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>}
                {item.products_count !== undefined && (
                    <Text style={styles.count}>{item.products_count} products</Text>
                )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#444" />
        </TouchableOpacity>
    );

    if (isLoading && categories.length === 0) {
        return <View style={styles.loader}><ActivityIndicator size="large" color="#e94560" /></View>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<EmptyState icon="grid-outline" title="No Categories" />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a2e' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' },
    list: { padding: 12 },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', borderRadius: 12, padding: 16, marginBottom: 10 },
    iconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#e94560' + '22', alignItems: 'center', justifyContent: 'center' },
    info: { flex: 1, marginLeft: 14 },
    name: { color: '#fff', fontSize: 16, fontWeight: '700' },
    desc: { color: '#888', fontSize: 13, marginTop: 2 },
    count: { color: '#e94560', fontSize: 12, fontWeight: '600', marginTop: 4 },
});
