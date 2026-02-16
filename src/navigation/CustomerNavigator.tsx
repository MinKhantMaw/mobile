import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import CartScreen from '../screens/customer/CartScreen';
import CategoriesScreen from '../screens/customer/CategoriesScreen';
import CheckoutScreen from '../screens/customer/CheckoutScreen';
import HomeScreen from '../screens/customer/HomeScreen';
import OrderDetailScreen from '../screens/customer/OrderDetailScreen';
import OrdersScreen from '../screens/customer/OrdersScreen';
import ProductDetailScreen from '../screens/customer/ProductDetailScreen';
import ProfileScreen from '../screens/customer/ProfileScreen';
import { useCartStore } from '../store/cartStore';
import type { CustomerStackParamList, CustomerTabParamList } from '../types';

const Tab = createBottomTabNavigator<CustomerTabParamList>();
const Stack = createNativeStackNavigator<CustomerStackParamList>();

function HomeStack() {
    return (
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff' }}>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Shop' }} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product' }} />
        </Stack.Navigator>
    );
}

function CategoriesStack() {
    return (
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff' }}>
            <Stack.Screen name="Categories" component={CategoriesScreen} />
        </Stack.Navigator>
    );
}

function CartStack() {
    return (
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff' }}>
            <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'My Cart' }} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
        </Stack.Navigator>
    );
}

function OrdersStack() {
    return (
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff' }}>
            <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'My Orders' }} />
            <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Order Details' }} />
        </Stack.Navigator>
    );
}

function ProfileStack() {
    return (
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff' }}>
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
        </Stack.Navigator>
    );
}

export default function CustomerNavigator() {
    const cart = useCartStore((s) => s.cart);
    const cartCount = cart?.item_count || 0;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#e94560',
                tabBarInactiveTintColor: '#8e8e93',
                tabBarStyle: { backgroundColor: '#1a1a2e', borderTopColor: '#16213e', paddingBottom: 5, height: 60 },
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
                tabBarIcon: ({ color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';
                    if (route.name === 'HomeTab') iconName = 'home';
                    else if (route.name === 'CategoriesTab') iconName = 'grid';
                    else if (route.name === 'CartTab') iconName = 'cart';
                    else if (route.name === 'OrdersTab') iconName = 'receipt';
                    else if (route.name === 'ProfileTab') iconName = 'person';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
            <Tab.Screen name="CategoriesTab" component={CategoriesStack} options={{ title: 'Categories' }} />
            <Tab.Screen
                name="CartTab"
                component={CartStack}
                options={{ title: 'Cart', tabBarBadge: cartCount > 0 ? cartCount : undefined }}
            />
            <Tab.Screen name="OrdersTab" component={OrdersStack} options={{ title: 'Orders' }} />
            <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profile' }} />
        </Tab.Navigator>
    );
}
