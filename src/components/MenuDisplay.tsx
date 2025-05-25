'use client';
import React, { useState } from 'react';
import { Category, MenuItem } from '@/types/menu';
import { Cart, CartItem, Address } from '@/types/cart';
import ItemModal from './ItemModal';
import CartComponent from './Cart';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';

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

export default function MenuDisplay({ categories, items }: MenuDisplayProps) {
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [cart, setCart] = useState<Cart>({
        items: [],
        subtotal: 0,
        total: 0,
    });
    const [cartMinimized, setCartMinimized] = useState(true);

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

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8 sm:space-y-12"
            >
                {sortedCategories.map((category) => {
                    const categoryItems = items
                        .filter((item) => item.categoryId === category.id)
                        .sort((a, b) => a.order - b.order);

                    if (categoryItems.length === 0) return null;

                    return (
                        <motion.section
                            key={category.id}
                            variants={itemAnimation}
                            className="bg-white rounded-xl shadow-lg p-4 sm:p-6"
                        >
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6"
                            >
                                {category.name}
                            </motion.h2>
                            <motion.div
                                variants={container}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                            >
                                <AnimatePresence>
                                    {categoryItems.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            variants={itemAnimation}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedItem(item)}
                                            className={`bg-gray-50 rounded-lg p-3 sm:p-4 cursor-pointer ${!item.isAvailable ? 'opacity-50' : ''}`}
                                        >
                                            <div className="flex justify-between items-start mb-1 sm:mb-2">
                                                <motion.h3
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-lg sm:text-xl font-semibold text-gray-900"
                                                >
                                                    {item.name}
                                                </motion.h3>
                                                <motion.span
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="text-base sm:text-lg font-bold text-gray-900"
                                                >
                                                    R$ {item.price.toFixed(2)}
                                                </motion.span>
                                            </div>
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="text-gray-600 mb-2 sm:mb-4 text-sm sm:text-base"
                                            >
                                                {item.description}
                                            </motion.p>
                                            {!item.isAvailable && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-red-500 text-xs sm:text-sm font-medium"
                                                >
                                                    Indisponível
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        </motion.section>
                    );
                })}
            </motion.div>

            {/* Carrinho flutuante em todas as telas */}
            <div>
                {cartMinimized ? (
                    <button
                        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none"
                        onClick={() => setCartMinimized(false)}
                        aria-label="Expandir carrinho"
                    >
                        <FaShoppingCart size={28} />
                        {cart.items.length > 0 && (
                            <span className="ml-2 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-bold">
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