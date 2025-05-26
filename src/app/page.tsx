'use client';
import React from 'react';
import MenuDisplay from '@/components/MenuDisplay';
import { motion } from 'framer-motion';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="relative bg-gradient-to-r from-orange-500 via-purple-500 to-yellow-400 py-16 sm:py-24 mb-12">
                <div className="absolute inset-0 bg-white opacity-10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl sm:text-6xl font-bold text-orange-600 mb-4 drop-shadow-lg"
                    >
                        Pappardelle Pizzaria e Pastelaria
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl sm:text-2xl text-orange-600 font-light"
                    >
                        Pizza, pastel e sabor em cada pedaço!
                    </motion.p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <MenuDisplay />
                </div>
            </div>

        </main>
    );
} 