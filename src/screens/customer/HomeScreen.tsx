import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ProductCard from '../../components/shop/ProductCard';
import EmptyState from '../../components/ui/EmptyState';
import { useProductStore } from '../../store/productStore';
import type { CustomerStackParamList, Product } from '../../types';

type Props = NativeStackScreenProps<CustomerStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    const { products, categories, isLoading, isRefreshing, hasMore, fetchProducts, refreshProducts, loadMore, fetchCategories } = useProductStore();
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>();

    useEffect(() => {
        fetchProducts(1);
        fetchCategories();
    }, []);

    const handleSearch = useCallback(() => {
        fetchProducts(1, search || undefined, selectedCategory);
    }, [search, selectedCategory]);

    const handleCategorySelect = useCallback((catId?: number) => {
        setSelectedCategory(catId);
        fetchProducts(1, search || undefined, catId);
    }, [search]);

    const renderProduct = useCallback(({ item }: { item: Product }) => (
        <ProductCard product={item} onPress={() => navigation.navigate('ProductDetail', { slug: item.slug })} />
    ), [navigation]);

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={18} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products..."
                        placeholderTextColor="#666"
                        value={search}
                        onChangeText={setSearch}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => { setSearch(''); fetchProducts(1, undefined, selectedCategory); }}>
                            <Ionicons name="close-circle" size={18} color="#666" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Category Chips */}
            {categories.length > 0 && (
                <View style={styles.categoryRow}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={[{ id: undefined, name: 'All' }, ...categories]}
                        keyExtractor={(item) => String(item.id ?? 'all')}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.chip, selectedCategory === item.id && styles.chipActive]}
                                onPress={() => handleCategorySelect(item.id as any)}
                            >
                                <Text style={[styles.chipText, selectedCategory === item.id && styles.chipTextActive]}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

            {/* Product Grid */}
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => String(item.id)}
                numColumns={2}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => refreshProducts(search, selectedCategory)} tintColor="#e94560" />}
                onEndReached={() => loadMore(search, selectedCategory)}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                    !isLoading ? <EmptyState icon="bag-outline" title="No Products" message="No products found" /> : null
                }
                ListFooterComponent={isLoading && products.length > 0 ? <ActivityIndicator style={{ margin: 20 }} color="#e94560" /> : null}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a2e' },
    searchRow: { paddingHorizontal: 12, paddingTop: 8 },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#16213e',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
        gap: 8,
    },
    searchInput: { flex: 1, color: '#fff', fontSize: 15 },
    categoryRow: { paddingVertical: 10, paddingLeft: 12 },
    chip: { backgroundColor: '#16213e', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 },
    chipActive: { backgroundColor: '#e94560' },
    chipText: { color: '#aaa', fontSize: 13, fontWeight: '600' },
    chipTextActive: { color: '#fff' },
    list: { padding: 6, paddingBottom: 20 },
});
