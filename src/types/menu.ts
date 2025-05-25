export interface Category {
    id: string;
    name: string;
    order: number;
}

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    isAvailable: boolean;
    order: number;
}

export interface MenuData {
    categories: Category[];
    items: MenuItem[];
} 