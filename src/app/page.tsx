'use client';
import React from 'react';
import { menuData } from '@/data/menuData';
import MenuDisplay from '@/components/MenuDisplay';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">Cardápio Digital</h1>
                    <p className="text-xl text-gray-600">Sabor e qualidade em cada prato</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <MenuDisplay categories={menuData.categories} items={menuData.items} />
                </div>
            </div>
        </main>
    );
} 