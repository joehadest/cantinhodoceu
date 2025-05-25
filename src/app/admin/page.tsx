'use client';
import React, { useState, useEffect } from 'react';
import { Category, MenuItem } from '@/types/menu';
import CategoryForm from '@/components/admin/CategoryForm';
import MenuItemForm from '@/components/admin/MenuItemForm';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useStore } from '@/contexts/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPanel() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<MenuItem[]>([]);
    const { isOpen, toggleStatus } = useStore();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [deliveryFee, setDeliveryFee] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('deliveryFee');
            return saved ? parseFloat(saved) : 5.0;
        }
        return 5.0;
    });

    useEffect(() => {
        // Carregar dados salvos ao iniciar
        const savedCategories = Cookies.get('categories');
        const savedItems = Cookies.get('items');

        if (savedCategories) {
            setCategories(JSON.parse(savedCategories));
        }
        if (savedItems) {
            setItems(JSON.parse(savedItems));
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('deliveryFee', deliveryFee.toString());
        }
    }, [deliveryFee]);

    const handleSave = () => {
        setIsSaving(true);
        setSaveMessage('');

        try {
            // Salvar status do estabelecimento
            Cookies.set('storeStatus', isOpen ? 'open' : 'closed', { expires: 365 });

            // Salvar categorias
            Cookies.set('categories', JSON.stringify(categories), { expires: 365 });

            // Salvar itens
            Cookies.set('items', JSON.stringify(items), { expires: 365 });

            setSaveMessage('Alterações salvas com sucesso!');
        } catch (error) {
            setSaveMessage('Erro ao salvar alterações.');
        } finally {
            setIsSaving(false);
            // Limpar mensagem após 3 segundos
            setTimeout(() => setSaveMessage(''), 3000);
        }
    };

    const handleLogout = () => {
        Cookies.remove('isAuthenticated');
        router.push('/admin/login');
    };

    const handleSaveCategory = (category: Omit<Category, 'id'>) => {
        const newCategory = {
            ...category,
            id: Date.now().toString(),
        };
        setCategories([...categories, newCategory]);
    };

    const handleSaveItem = (item: Omit<MenuItem, 'id'>) => {
        const newItem = {
            ...item,
            id: Date.now().toString(),
        };
        setItems([...items, newItem]);
    };

    const handleDeleteCategory = (categoryId: string) => {
        setCategories(categories.filter((cat) => cat.id !== categoryId));
        setItems(items.filter((item) => item.categoryId !== categoryId));
    };

    const handleDeleteItem = (itemId: string) => {
        setItems(items.filter((item) => item.id !== itemId));
    };

    const handleToggleItemAvailability = (itemId: string) => {
        setItems(
            items.map((item) =>
                item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
            )
        );
    };

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gray-50 p-8"
        >
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex justify-between items-center mb-12"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Painel Administrativo</h1>
                        <p className="text-xl text-gray-600">Gerencie seu cardápio digital</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleStatus}
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
                            {isOpen ? 'Aberto' : 'Fechado'}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sair
                        </motion.button>
                    </div>
                </motion.div>

                <AnimatePresence>
                    {saveMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`mb-6 p-4 rounded-lg ${saveMessage.includes('sucesso') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}
                        >
                            {saveMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Seção de Categorias */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h2 className="text-2xl font-bold mb-6">Categorias</h2>
                        <CategoryForm onSave={handleSaveCategory} />

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4">Categorias Existentes</h3>
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {categories.map((category) => (
                                        <motion.div
                                            key={category.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div>
                                                <h4 className="font-medium">{category.name}</h4>
                                                <p className="text-sm text-gray-600">Ordem: {category.order}</p>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleDeleteCategory(category.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>

                    {/* Seção de Itens */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h2 className="text-2xl font-bold mb-6">Itens do Cardápio</h2>
                        <MenuItemForm categories={categories} onSave={handleSaveItem} />

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4">Itens Existentes</h3>
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            className="p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium">{item.name}</h4>
                                                <div className="flex items-center space-x-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleToggleItemAvailability(item.id)}
                                                        className={`px-2 py-1 rounded text-sm ${item.isAvailable
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                            }`}
                                                    >
                                                        {item.isAvailable ? 'Disponível' : 'Indisponível'}
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDeleteItem(item.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </motion.button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">
                                                    Categoria: {categories.find((cat) => cat.id === item.categoryId)?.name}
                                                </span>
                                                <span className="font-medium">R$ {item.price.toFixed(2)}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Taxa de entrega (R$)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={deliveryFee}
                        onChange={e => setDeliveryFee(Number(e.target.value))}
                        className="border rounded px-3 py-2 w-32"
                    />
                </div>
            </div>
        </motion.main>
    );
} 