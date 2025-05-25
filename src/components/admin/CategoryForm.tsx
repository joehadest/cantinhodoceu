'use client';
import React, { useState } from 'react';
import { Category } from '@/types/menu';

interface CategoryFormProps {
    onSave: (category: Omit<Category, 'id'>) => void;
}

export default function CategoryForm({ onSave }: CategoryFormProps) {
    const [name, setName] = useState('');
    const [order, setOrder] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        onSave({
            name: name.trim(),
            order,
        });

        setName('');
        setOrder(0);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome da Categoria
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Ex: Bebidas, Sobremesas..."
                    required
                />
            </div>
            <div>
                <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                    Ordem de Exibição
                </label>
                <input
                    type="number"
                    id="order"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    min="0"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Adicionar Categoria
            </button>
        </form>
    );
} 