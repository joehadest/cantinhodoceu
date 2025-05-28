'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, MenuItem } from '@/types/menu';
import Cookies from 'js-cookie';
import { menuData } from '@/data/menuData';

interface MenuContextType {
    categories: Category[];
    items: MenuItem[];
    updateCategories: (categories: Category[]) => void;
    updateItems: (items: MenuItem[]) => void;
    addCategory: (category: Omit<Category, 'id'>) => void;
    addItem: (item: Omit<MenuItem, 'id'>) => void;
    updateItem: (item: MenuItem) => void;
    deleteItem: (itemId: string) => void;
    deleteCategory: (categoryId: string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<MenuItem[]>([]);

    useEffect(() => {
        // Limpar cookies existentes para garantir dados frescos
        Cookies.remove('categories');
        Cookies.remove('items');

        // Definir dados iniciais
        setCategories(menuData.categories);
        setItems(menuData.items);

        // Salvar no cookie
        Cookies.set('categories', JSON.stringify(menuData.categories));
        Cookies.set('items', JSON.stringify(menuData.items));

        console.log('MenuProvider - Dados iniciais carregados:', {
            categories: menuData.categories,
            items: menuData.items
        });
    }, []);

    const updateCategories = (newCategories: Category[]) => {
        setCategories(newCategories);
        Cookies.set('categories', JSON.stringify(newCategories));
    };

    const updateItems = (newItems: MenuItem[]) => {
        setItems(newItems);
        Cookies.set('items', JSON.stringify(newItems));
    };

    const addCategory = (category: Omit<Category, 'id'>) => {
        const newCategory = {
            ...category,
            id: Date.now().toString(),
        };
        const newCategories = [...categories, newCategory];
        updateCategories(newCategories);
    };

    const addItem = (item: Omit<MenuItem, 'id'>) => {
        const newItem = {
            ...item,
            id: Date.now().toString(),
        };
        const newItems = [...items, newItem];
        updateItems(newItems);
    };

    const updateItem = (updatedItem: MenuItem) => {
        const newItems = items.map(item =>
            item.id === updatedItem.id ? updatedItem : item
        );
        updateItems(newItems);
    };

    const deleteItem = (itemId: string) => {
        const newItems = items.filter(item => item.id !== itemId);
        updateItems(newItems);
    };

    const deleteCategory = (categoryId: string) => {
        const newCategories = categories.filter(category => category.id !== categoryId);
        updateCategories(newCategories);
        // Também remove os itens associados à categoria
        const newItems = items.filter(item => item.categoryId !== categoryId);
        updateItems(newItems);
    };

    return (
        <MenuContext.Provider
            value={{
                categories,
                items,
                updateCategories,
                updateItems,
                addCategory,
                addItem,
                updateItem,
                deleteItem,
                deleteCategory,
            }}
        >
            {children}
        </MenuContext.Provider>
    );
}

export function useMenu() {
    const context = useContext(MenuContext);
    if (context === undefined) {
        throw new Error('useMenu must be used within a MenuProvider');
    }
    return context;
} 