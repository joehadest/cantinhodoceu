'use client';
import React from 'react';
import { useStore } from '@/contexts/StoreContext';
import { motion } from 'framer-motion';

export default function Header() {
    const { isOpen } = useStore();

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-white shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center"
                    >
                        <h1 className="text-2xl font-bold text-gray-900">Cantinho do Céu</h1>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${isOpen
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                        >
                            <motion.span
                                className="mr-2"
                                animate={{
                                    rotate: isOpen ? 0 : 180,
                                    scale: isOpen ? 1 : 0.8
                                }}
                                transition={{ type: "spring", stiffness: 200 }}
                            >
                                {isOpen ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </motion.span>
                            <motion.span
                                animate={{
                                    opacity: [0, 1],
                                    x: isOpen ? 0 : 5
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {isOpen ? 'Aberto' : 'Fechado'}
                            </motion.span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.header>
    );
} 