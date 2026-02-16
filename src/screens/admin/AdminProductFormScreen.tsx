import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { adminApi } from '../../api/admin';
import { productsApi } from '../../api/products';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import type { AdminStackParamList } from '../../types';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminProductForm'>;

export default function AdminProductFormScreen({ route, navigation }: Props) {
    const productId = route.params?.productId;
    const isEditing = !!productId;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [sku, setSku] = useState('');
    const [stock, setStock] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditing);

    useEffect(() => {
        if (productId) loadProduct();
    }, [productId]);

    const loadProduct = async () => {
        try {
            const res = await productsApi.getBySlug(String(productId));
            const p = res.data.data;
            setName(p.name);
            setDescription(p.description || '');
            setPrice(String(p.price));
            setSalePrice(p.compare_at_price ? String(p.compare_at_price) : '');
            setSku(p.sku || '');
            setStock(String(p.stock));
        } catch { } finally { setFetching(false); }
    };

    const handleSubmit = async () => {
        if (!name.trim() || !price.trim()) {
            Alert.alert('Error', 'Name and price are required');
            return;
        }
        setLoading(true);
        try {
            const data = {
                name, description, price: parseFloat(price),
                compare_at_price: salePrice ? parseFloat(salePrice) : null,
                sku, stock: parseInt(stock) || 0,
            };
            if (isEditing) {
                await adminApi.updateProduct(productId!, data);
                Alert.alert('Success', 'Product updated');
            } else {
                const formData = new FormData();
                Object.entries(data).forEach(([key, val]) => {
                    if (val !== null) formData.append(key, String(val));
                });
                await adminApi.createProduct(formData);
                Alert.alert('Success', 'Product created');
            }
            navigation.goBack();
        } catch (err: any) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to save product');
        } finally { setLoading(false); }
    };

    if (fetching) return <View style={styles.loader}><Text style={{ color: '#888' }}>Loading...</Text></View>;

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
            <Text style={styles.title}>{isEditing ? 'Edit Product' : 'New Product'}</Text>
            <Input label="Name" placeholder="Product name" value={name} onChangeText={setName} />
            <Input label="Description" placeholder="Product description" value={description} onChangeText={setDescription} multiline numberOfLines={4} style={{ height: 100, textAlignVertical: 'top' }} />
            <Input label="Price" placeholder="0.00" value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
            <Input label="Sale Price (optional)" placeholder="0.00" value={salePrice} onChangeText={setSalePrice} keyboardType="decimal-pad" />
            <Input label="SKU" placeholder="ABC-123" value={sku} onChangeText={setSku} />
            <Input label="Stock Quantity" placeholder="0" value={stock} onChangeText={setStock} keyboardType="number-pad" />
            <Button title={isEditing ? 'Update Product' : 'Create Product'} onPress={handleSubmit} loading={loading} style={{ marginTop: 8 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a23' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a23' },
    title: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 20 },
});
