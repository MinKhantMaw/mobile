import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Product } from '../../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

interface ProductCardProps {
    product: Product;
    onPress: () => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
    const imageUrl = product.images?.[0]?.url;
    const price = parseFloat(product.price);
    const comparePrice = product.compare_at_price ? parseFloat(product.compare_at_price) : null;
    const hasDiscount = comparePrice !== null && comparePrice > price;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
            <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                contentFit="cover"
                placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
                transition={200}
            />
            {hasDiscount && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>SALE</Text>
                </View>
            )}
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
                <View style={styles.priceRow}>
                    <Text style={styles.price}>${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
                    {hasDiscount && comparePrice && (
                        <Text style={styles.oldPrice}>${comparePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
                    )}
                </View>
                {product.stock <= 0 && <Text style={styles.outOfStock}>Out of Stock</Text>}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#16213e',
        borderRadius: 16,
        overflow: 'hidden',
        margin: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },
    image: { width: '100%', height: CARD_WIDTH * 1.1, backgroundColor: '#0f3460' },
    badge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#e94560', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
    info: { padding: 10 },
    name: { color: '#eee', fontSize: 13, fontWeight: '600', lineHeight: 18 },
    priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
    price: { color: '#e94560', fontSize: 16, fontWeight: '800' },
    oldPrice: { color: '#666', fontSize: 13, textDecorationLine: 'line-through' },
    outOfStock: { color: '#e74c3c', fontSize: 11, fontWeight: '700', marginTop: 4 },
});
