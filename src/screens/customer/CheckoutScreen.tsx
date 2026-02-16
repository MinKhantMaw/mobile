import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ordersApi } from '../../api/orders';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useCartStore } from '../../store/cartStore';
import type { CustomerStackParamList } from '../../types';

type Props = NativeStackScreenProps<CustomerStackParamList, 'Checkout'>;

export default function CheckoutScreen({ navigation }: Props) {
    const { cart, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            await ordersApi.create();
            clearCart();
            Alert.alert('Order Placed!', 'Your order has been placed successfully.', [
                { text: 'View Orders', onPress: () => navigation.getParent()?.navigate('OrdersTab') },
            ]);
        } catch (err: any) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (!cart) return null;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Order Summary</Text>

                <Card style={{ marginBottom: 16 }}>
                    {cart.items.map((item) => (
                        <View key={item.id} style={styles.itemRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
                                <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                            </View>
                            <Text style={styles.itemPrice}>${item.subtotal.toFixed(2)}</Text>
                        </View>
                    ))}
                </Card>

                <Card>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Items ({cart.item_count})</Text>
                        <Text style={styles.summaryValue}>${cart.total.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Shipping</Text>
                        <Text style={[styles.summaryValue, { color: '#2ecc71' }]}>Free</Text>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>${cart.total.toFixed(2)}</Text>
                    </View>
                </Card>
            </ScrollView>

            <View style={styles.bottomBar}>
                <Button title="Place Order" onPress={handlePlaceOrder} loading={loading} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a2e' },
    scroll: { padding: 16 },
    title: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 16 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#233554' },
    itemName: { color: '#eee', fontSize: 14, fontWeight: '600' },
    itemQty: { color: '#888', fontSize: 12, marginTop: 2 },
    itemPrice: { color: '#fff', fontSize: 14, fontWeight: '700' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
    summaryLabel: { color: '#aaa', fontSize: 15 },
    summaryValue: { color: '#fff', fontSize: 15, fontWeight: '600' },
    totalRow: { borderTopWidth: 1, borderTopColor: '#233554', marginTop: 8, paddingTop: 12 },
    totalLabel: { color: '#fff', fontSize: 18, fontWeight: '800' },
    totalValue: { color: '#e94560', fontSize: 20, fontWeight: '800' },
    bottomBar: { padding: 16, borderTopWidth: 1, borderTopColor: '#16213e' },
});
