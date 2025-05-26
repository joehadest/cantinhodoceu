'use client';
import React, { useState } from 'react';
import { MenuItem } from '@/types/menu';
import { motion, AnimatePresence } from 'framer-motion';

interface ItemModalProps {
    item: MenuItem;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (quantity: number) => void;
}

export default function ItemModal({ item, isOpen, onClose, onAddToCart }: ItemModalProps) {
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (value: number) => {
        if (value >= 1) {
            setQuantity(value);
        }
    };

    const backdrop = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const modal = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 20
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 20,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                    variants={backdrop}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-xl p-6 max-w-md w-full"
                        variants={modal}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-orange-600">{item.name}</h2>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="text-orange-500 hover:text-orange-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </motion.button>
                        </div>
                        <p className="text-yellow-700 mb-6">{item.description}</p>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                                >
                                    -
                                </motion.button>
                                <span className="text-xl font-semibold">{quantity}</span>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                                >
                                    +
                                </motion.button>
                            </div>
                            <span className="text-2xl font-bold text-orange-600">
                                R$ {(item.price * quantity).toFixed(2)}
                            </span>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onAddToCart(quantity)}
                            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-red-500 transition-colors mt-4"
                        >
                            Adicionar ao Carrinho
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
} 