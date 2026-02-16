import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { CartItem as CartItemType } from '../../types';

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (quantity: number) => void;
    onRemove: () => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: item.product.images?.[0]?.url }}
                style={styles.image}
                contentFit="cover"
            />
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>{item.product.name}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                <View style={styles.quantityRow}>
                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
                    >
                        <Ionicons name="remove" size={18} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => onUpdateQuantity(item.quantity + 1)}
                    >
                        <Ionicons name="add" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.right}>
                <TouchableOpacity onPress={onRemove}>
                    <Ionicons name="trash-outline" size={20} color="#e94560" />
                </TouchableOpacity>
                <Text style={styles.subtotal}>${item.subtotal.toFixed(2)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', backgroundColor: '#16213e', borderRadius: 12, padding: 12, marginBottom: 10 },
    image: { width: 80, height: 80, borderRadius: 10, backgroundColor: '#0f3460' },
    info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
    name: { color: '#eee', fontSize: 14, fontWeight: '600' },
    price: { color: '#888', fontSize: 13, marginTop: 2 },
    quantityRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 10 },
    qtyBtn: { backgroundColor: '#233554', borderRadius: 6, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
    qtyText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    right: { alignItems: 'flex-end', justifyContent: 'space-between' },
    subtotal: { color: '#e94560', fontSize: 15, fontWeight: '700' },
});
