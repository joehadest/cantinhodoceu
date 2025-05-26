'use client';
import React, { useState, useEffect } from 'react';
import { Category, MenuItem } from '@/types/menu';
import { Cart, CartItem, Address } from '@/types/cart';
import ItemModal from './ItemModal';
import CartComponent from './Cart';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa';
import { useMenu } from '@/contexts/MenuContext';

interface MenuDisplayProps {
    categories: Category[];
    items: MenuItem[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const titleAnimation = {
    hidden: {
        opacity: 0,
        y: -50,
        scale: 0.8
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 300,
            duration: 0.8
        }
    }
};

const subtitleAnimation = {
    hidden: {
        opacity: 0,
        y: 20
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.3,
            duration: 0.6
        }
    }
};

export default function MenuDisplay() {
    const { categories, items } = useMenu();
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [cart, setCart] = useState<Cart>({
        items: [],
        subtotal: 0,
        total: 0,
    });
    const [cartMinimized, setCartMinimized] = useState(true);
    const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const initialExpandedState = categories.reduce((acc, category) => {
            acc[category.id] = false;
            return acc;
        }, {} as { [key: string]: boolean });
        setExpandedCategories(initialExpandedState);
    }, [categories]);

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const handleAddToCart = (item: MenuItem, quantity: number) => {
        const existingItem = cart.items.find((cartItem) => cartItem.item.id === item.id);
        let newItems: CartItem[];

        if (existingItem) {
            newItems = cart.items.map((cartItem) =>
                cartItem.item.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + quantity }
                    : cartItem
            );
        } else {
            newItems = [...cart.items, { item, quantity }];
        }

        const subtotal = newItems.reduce(
            (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
            0
        );

        setCart({
            ...cart,
            items: newItems,
            subtotal,
            total: subtotal + (cart.deliveryInfo?.deliveryFee || 0),
        });
        setSelectedItem(null);
    };

    const handleUpdateQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            handleRemoveItem(itemId);
            return;
        }

        const newItems = cart.items.map((cartItem) =>
            cartItem.item.id === itemId ? { ...cartItem, quantity } : cartItem
        );

        const subtotal = newItems.reduce(
            (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
            0
        );

        setCart({
            ...cart,
            items: newItems,
            subtotal,
            total: subtotal + (cart.deliveryInfo?.deliveryFee || 0),
        });
    };

    const handleRemoveItem = (itemId: string) => {
        const newItems = cart.items.filter((cartItem) => cartItem.item.id !== itemId);
        const subtotal = newItems.reduce(
            (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
            0
        );

        setCart({
            ...cart,
            items: newItems,
            subtotal,
            total: subtotal + (cart.deliveryInfo?.deliveryFee || 0),
        });
    };

    const handleUpdateAddress = (address: Address) => {
        // Aqui você pode implementar a lógica para calcular a taxa de entrega
        // e o tempo estimado com base no endereço
        const deliveryFee = 5.0; // Exemplo fixo
        const estimatedTime = '30-45 min'; // Exemplo fixo

        setCart({
            ...cart,
            deliveryInfo: {
                address,
                deliveryFee,
                estimatedTime,
            },
            total: cart.subtotal + deliveryFee,
        });
    };

    const handleCheckout = () => {
        // Implementar lógica de checkout
        alert('Pedido realizado com sucesso!');
        setCart({
            items: [],
            subtotal: 0,
            total: 0,
        });
    };

    const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

    // Debug: logar categorias e itens
    console.log('Categorias:', categories);
    console.log('Itens:', items);

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4 sm:space-y-6"
            >
                {sortedCategories.map((category) => {
                    const categoryItems = items
                        .filter((item) => item.categoryId === category.id)
                        .sort((a, b) => a.order - b.order);

                    // Log para debug
                    console.log(`Categoria: ${category.name} (${category.id}) - Itens:`, categoryItems);

                    if (categoryItems.length === 0) return (
                        <motion.section
                            key={category.id}
                            variants={itemAnimation}
                            className="bg-white rounded-xl shadow-lg overflow-hidden"
                        >
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full p-4 sm:p-6 flex justify-between items-center hover:bg-orange-100 transition-colors"
                            >
                                <motion.h2
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-2xl sm:text-3xl font-bold text-orange-600"
                                >
                                    {category.name}
                                </motion.h2>
                                <motion.div
                                    animate={{ rotate: expandedCategories[category.id] ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center"
                                >
                                    <FaChevronDown className="text-gray-500 text-xl" />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {expandedCategories[category.id] && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 sm:p-6 pt-0 text-gray-500 text-center">
                                            Nenhum item nesta categoria.
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.section>
                    );

                    return (
                        <motion.section
                            key={category.id}
                            variants={itemAnimation}
                            className="bg-white rounded-xl shadow-lg overflow-hidden"
                        >
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full p-4 sm:p-6 flex justify-between items-center hover:bg-orange-100 transition-colors"
                            >
                                <motion.h2
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-2xl sm:text-3xl font-bold text-orange-600"
                                >
                                    {category.name}
                                </motion.h2>
                                <motion.div
                                    animate={{ rotate: expandedCategories[category.id] ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center"
                                >
                                    <FaChevronDown className="text-gray-500 text-xl" />
                                </motion.div>
                            </button>
                            
                            <AnimatePresence>
                                {expandedCategories[category.id] && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 sm:p-6 pt-0">
                                            {categoryItems.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
                                                    {categoryItems.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="bg-orange-50 rounded-lg p-5 sm:p-6 border border-orange-200 hover:border-orange-400 transition-colors cursor-pointer"
                                                            onClick={() => setSelectedItem(item)}
                                                        >
                                                            <div className="flex justify-between items-start mb-1 sm:mb-2">
                                                                <h3 className="text-lg sm:text-xl font-semibold text-orange-600">
                                                                    {item.name}
                                                                </h3>
                                                                <span className="text-base sm:text-lg font-bold text-orange-500">
                                                                    R$ {item.price.toFixed(2)}
                                                                </span>
                                                            </div>
                                                            <p className="text-yellow-700 mb-2 sm:mb-4 text-sm sm:text-base">
                                                                {item.description}
                                                            </p>
                                                            {!item.isAvailable && (
                                                                <div className="text-red-500 text-xs sm:text-sm font-medium">
                                                                    Indisponível
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-gray-500 text-center">Nenhum item nesta categoria.</div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.section>
                    );
                })}
            </motion.div>

            {/* Carrinho flutuante em todas as telas */}
            <div>
                {cartMinimized ? (
                    <button
                        className="fixed bottom-4 right-4 z-50 bg-orange-500 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none"
                        onClick={() => setCartMinimized(false)}
                        aria-label="Expandir carrinho"
                    >
                        <FaShoppingCart size={28} className="text-white" />
                        {cart.items.length > 0 && (
                            <span className="ml-2 bg-white text-orange-600 rounded-full px-2 py-0.5 text-xs font-bold">
                                {cart.items.length}
                            </span>
                        )}
                    </button>
                ) : (
                    <div className="fixed bottom-4 right-4 z-50 w-[95vw] max-w-xs sm:max-w-sm lg:max-w-md">
                        <div className="relative">
                            <div className="absolute top-2 right-2 z-10">
                                <button
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-1 shadow focus:outline-none"
                                    onClick={() => setCartMinimized(true)}
                                    aria-label="Minimizar carrinho"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <CartComponent
                                cart={cart}
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemoveItem={handleRemoveItem}
                                onUpdateAddress={handleUpdateAddress}
                                onCheckout={handleCheckout}
                            />
                        </div>
                    </div>
                )}
            </div>

            {selectedItem && (
                <ItemModal
                    item={selectedItem}
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onAddToCart={(quantity) => handleAddToCart(selectedItem, quantity)}
                />
            )}
        </div>
    );
} 