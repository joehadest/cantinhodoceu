import { MenuItem } from './menu';

export interface Address {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface CartItem {
    item: MenuItem;
    quantity: number;
}

export interface DeliveryInfo {
    address: Address;
    deliveryFee: number;
    estimatedTime: string;
}

export interface Cart {
    items: CartItem[];
    deliveryInfo?: DeliveryInfo;
    subtotal: number;
    total: number;
} 