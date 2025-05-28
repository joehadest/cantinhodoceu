'use client';
import React from 'react';
import MenuDisplay from '../components/MenuDisplay';
import { motion } from 'framer-motion';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="relative bg-orange-500 py-16 sm:py-24 mb-12 rounded-2xl">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl sm:text-6xl font-bold text-white mb-4 drop-shadow-lg"
                    >
                        Pappardelle Pizzaria e Pastelaria
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl sm:text-2xl text-white/90 font-light"
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