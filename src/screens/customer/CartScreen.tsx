import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import CartItemComponent from '../../components/shop/CartItem';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import { useCartStore } from '../../store/cartStore';
import type { CustomerStackParamList } from '../../types';

type Props = NativeStackScreenProps<CustomerStackParamList, 'Cart'>;

export default function CartScreen({ navigation }: Props) {
    const { cart, isLoading, fetchCart, updateItem, removeItem } = useCartStore();

    useEffect(() => {
        fetchCart();
    }, []);

    if (isLoading && !cart) return <LoadingOverlay />;

    return (
        <View style={styles.container}>
            <FlatList
                data={cart?.items || []}
                renderItem={({ item }) => (
                    <CartItemComponent
                        item={item}
                        onUpdateQuantity={(qty) => updateItem(item.id, qty)}
                        onRemove={() => removeItem(item.id)}
                    />
                )}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<EmptyState icon="cart-outline" title="Cart is Empty" message="Add some products to get started" />}
            />

            {cart && cart.items.length > 0 && (
                <View style={styles.bottomBar}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalPrice}>${cart.total.toFixed(2)}</Text>
                    </View>
                    <Button title="Proceed to Checkout" onPress={() => navigation.navigate('Checkout')} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a2e' },
    list: { padding: 12, flexGrow: 1 },
    bottomBar: { padding: 16, borderTopWidth: 1, borderTopColor: '#16213e' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    totalLabel: { color: '#ccc', fontSize: 18, fontWeight: '600' },
    totalPrice: { color: '#e94560', fontSize: 22, fontWeight: '800' },
});
