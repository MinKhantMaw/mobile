// User types
export interface User {
    id: number;
    name: string;
    email: string;
    mobile_country_code?: string;
    mobile_number?: string;
    address?: string;
    profile_image?: string;
    status: string;
    created_at: string;
    updated_at: string;
    roles: Role[];
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions?: Permission[];
}

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

// Product types — matches actual Laravel API response
export interface Product {
    id: number;
    category_id: number;
    sku: string;
    name: string;
    slug: string;
    description: string | null;
    price: string; // API returns string like "1200000.00"
    compare_at_price: string | null; // was sale_price
    stock: number; // was stock_quantity
    is_active: boolean;
    published_at: string | null;
    status: string;
    category?: Category;
    images: ProductImage[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface ProductImage {
    id: number;
    product_id: number;
    url: string;
    sort_order: number;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    is_active: boolean;
    description?: string;
    image?: string;
    products_count?: number;
    created_at: string;
    updated_at: string;
}

// Cart types
export interface Cart {
    id: number;
    items: CartItem[];
    total: number;
    item_count: number;
}

export interface CartItem {
    id: number;
    product_id: number;
    product: Product;
    quantity: number;
    price: number;
    subtotal: number;
}

// Order types
export interface Order {
    id: number;
    order_number: string;
    status: OrderStatus;
    total: number;
    items: OrderItem[];
    shipping_address?: string;
    payment_method?: string;
    created_at: string;
    updated_at: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
    id: number;
    product_id: number;
    product: Product;
    quantity: number;
    price: number;
    subtotal: number;
}

// Analytics types
export interface AnalyticsOverview {
    total_revenue: number;
    total_orders: number;
    total_products: number;
    total_customers: number;
    recent_orders: Order[];
}

// API Response types — matches actual Laravel API
export interface ApiResponse<T> {
    message: string;
    data: T;
}

// Actual pagination: { data: [...], meta: { pagination: { current_page, last_page, per_page, total } } }
export interface PaginatedApiResponse<T> {
    message: string;
    data: T[];
    meta: {
        pagination: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
}

export interface AuthResponse {
    user: User;
    access_token: string;
    token_type: string;
    expires_at: string;
    refresh_token: string;
    refresh_expires_at: string;
}

// Navigation types
export type RootStackParamList = {
    Auth: undefined;
    Customer: undefined;
    Admin: undefined;
};

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

export type CustomerTabParamList = {
    HomeTab: undefined;
    CategoriesTab: undefined;
    CartTab: undefined;
    OrdersTab: undefined;
    ProfileTab: undefined;
};

export type CustomerStackParamList = {
    Home: undefined;
    ProductDetail: { slug: string };
    Categories: undefined;
    Cart: undefined;
    Checkout: undefined;
    Orders: undefined;
    OrderDetail: { orderId: string };
    Profile: undefined;
};

export type AdminTabParamList = {
    DashboardTab: undefined;
    ProductsTab: undefined;
    OrdersTab: undefined;
    UsersTab: undefined;
    ProfileTab: undefined;
};

export type AdminStackParamList = {
    Dashboard: undefined;
    AdminProducts: undefined;
    AdminProductForm: { productId?: number };
    AdminOrders: undefined;
    AdminOrderDetail: { orderId: string };
    AdminUsers: undefined;
    AdminProfile: undefined;
};
