import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AdminOrderDetailScreen from '../screens/admin/AdminOrderDetailScreen';
import AdminOrdersScreen from '../screens/admin/AdminOrdersScreen';
import AdminProductFormScreen from '../screens/admin/AdminProductFormScreen';
import AdminProductsScreen from '../screens/admin/AdminProductsScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import DashboardScreen from '../screens/admin/DashboardScreen';
import type { AdminStackParamList, AdminTabParamList } from '../types';

const Tab = createBottomTabNavigator<AdminTabParamList>();
const Stack = createNativeStackNavigator<AdminStackParamList>();

function DashboardStack() {
    return (
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#0f3460' }, headerTintColor: '#fff' }}>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
        </Stack.Navigator>
    );
}

function ProductsStack() {
    return (
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#0f3460' }, headerTintColor: '#fff' }}>
            <Stack.Screen name="AdminProducts" component={AdminProductsScreen} options={{ title: 'Products' }} />
            <Stack.Screen name="AdminProductForm" component={AdminProductFormScreen} options={{ title: 'Product Form' }} />
        </Stack.Navigator>
    );
}

function OrdersStack() {
    return (
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#0f3460' }, headerTintColor: '#fff' }}>
            <Stack.Screen name="AdminOrders" component={AdminOrdersScreen} options={{ title: 'Orders' }} />
            <Stack.Screen name="AdminOrderDetail" component={AdminOrderDetailScreen} options={{ title: 'Order Detail' }} />
        </Stack.Navigator>
    );
}

function UsersStack() {
    return (
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#0f3460' }, headerTintColor: '#fff' }}>
            <Stack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ title: 'Users' }} />
        </Stack.Navigator>
    );
}

function ProfileStack() {
    return (
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#0f3460' }, headerTintColor: '#fff' }}>
            <Stack.Screen name="AdminProfile" component={AdminProfileScreen} options={{ title: 'Profile' }} />
        </Stack.Navigator>
    );
}

export default function AdminNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#e94560',
                tabBarInactiveTintColor: '#8e8e93',
                tabBarStyle: { backgroundColor: '#0f3460', borderTopColor: '#16213e', paddingBottom: 5, height: 60 },
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
                tabBarIcon: ({ color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'analytics';
                    if (route.name === 'DashboardTab') iconName = 'analytics';
                    else if (route.name === 'ProductsTab') iconName = 'cube';
                    else if (route.name === 'OrdersTab') iconName = 'receipt';
                    else if (route.name === 'UsersTab') iconName = 'people';
                    else if (route.name === 'ProfileTab') iconName = 'person';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="DashboardTab" component={DashboardStack} options={{ title: 'Dashboard' }} />
            <Tab.Screen name="ProductsTab" component={ProductsStack} options={{ title: 'Products' }} />
            <Tab.Screen name="OrdersTab" component={OrdersStack} options={{ title: 'Orders' }} />
            <Tab.Screen name="UsersTab" component={UsersStack} options={{ title: 'Users' }} />
            <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profile' }} />
        </Tab.Navigator>
    );
}
