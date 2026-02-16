import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { productsApi } from '../../api/products';
import Button from '../../components/ui/Button';
import { useCartStore } from '../../store/cartStore';
import type { CustomerStackParamList, Product } from '../../types';

const { width } = Dimensions.get('window');
type Props = NativeStackScreenProps<CustomerStackParamList, 'ProductDetail'>;

export default function ProductDetailScreen({ route }: Props) {
    const { slug } = route.params;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [imageIndex, setImageIndex] = useState(0);
    const { addItem, isLoading: cartLoading } = useCartStore();

    useEffect(() => {
        loadProduct();
    }, [slug]);

    const loadProduct = async () => {
        try {
            const res = await productsApi.getBySlug(slug);
            setProduct(res.data.data);
        } catch (err: any) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!product) return;
        await addItem(product.id);
        Alert.alert('Success', 'Added to cart!');
    };

    if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color="#e94560" /></View>;
    if (!product) return <View style={styles.loader}><Text style={styles.errorText}>Product not found</Text></View>;

    const price = parseFloat(product.price);
    const comparePrice = product.compare_at_price ? parseFloat(product.compare_at_price) : null;
    const hasDiscount = comparePrice !== null && comparePrice > price;

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Image Carousel */}
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(e) => setImageIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
                >
                    {(product.images?.length ? product.images : [{ id: 0, url: '', product_id: 0, sort_order: 0, is_primary: true, created_at: '', updated_at: '' }]).map((img) => (
                        <Image key={img.id} source={{ uri: img.url }} style={styles.image} contentFit="cover" />
                    ))}
                </ScrollView>

                {/* Dots */}
                {product.images?.length > 1 && (
                    <View style={styles.dots}>
                        {product.images.map((_, i) => (
                            <View key={i} style={[styles.dot, i === imageIndex && styles.dotActive]} />
                        ))}
                    </View>
                )}

                {/* Info */}
                <View style={styles.info}>
                    <Text style={styles.name}>{product.name}</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
                        {hasDiscount && comparePrice && (
                            <Text style={styles.oldPrice}>${comparePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
                        )}
                    </View>
                    {product.category && <Text style={styles.category}>{product.category.name}</Text>}
                    <Text style={styles.stock}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </Text>
                    {product.description && (
                        <>
                            <Text style={styles.descTitle}>Description</Text>
                            <Text style={styles.description}>{product.description}</Text>
                        </>
                    )}
                </View>
            </ScrollView>

            {/* Bottom CTA */}
            <View style={styles.bottomBar}>
                <Button
                    title="Add to Cart"
                    onPress={handleAddToCart}
                    loading={cartLoading}
                    disabled={product.stock <= 0}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a2e' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' },
    errorText: { color: '#e94560', fontSize: 16 },
    image: { width, height: width, backgroundColor: '#0f3460' },
    dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 12, gap: 6 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#333' },
    dotActive: { backgroundColor: '#e94560', width: 20 },
    info: { padding: 20 },
    name: { color: '#fff', fontSize: 22, fontWeight: '800' },
    priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 10 },
    price: { color: '#e94560', fontSize: 24, fontWeight: '800' },
    oldPrice: { color: '#666', fontSize: 16, textDecorationLine: 'line-through' },
    category: { color: '#3498db', fontSize: 14, marginTop: 8 },
    stock: { color: '#2ecc71', fontSize: 13, marginTop: 4 },
    descTitle: { color: '#ccc', fontSize: 16, fontWeight: '700', marginTop: 20, marginBottom: 8 },
    description: { color: '#999', fontSize: 14, lineHeight: 22 },
    bottomBar: { padding: 16, borderTopWidth: 1, borderTopColor: '#16213e' },
});
