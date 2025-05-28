'use client';
import React, { useState, useEffect } from 'react';
import { Category, MenuItem } from '@/types/menu';
import CategoryForm from '@/components/admin/CategoryForm';
import MenuItemForm from '@/components/admin/MenuItemForm';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import RecentOrders from '../../components/RecentOrders';

export default function AdminPanel() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<MenuItem[]>([]);
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [deliveryFee, setDeliveryFee] = useState(5.0);
    const [activeTab, setActiveTab] = useState<'admin' | 'pedidos'>('admin');
    const [pedidoSelecionado, setPedidoSelecionado] = useState<any | null>(null);

    // Buscar configurações do banco ao carregar
    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data.success && data.data) {
                    setCategories(data.data.categories || []);
                    setItems(data.data.items || []);
                    setDeliveryFee(data.data.deliveryFee ?? 5.0);
                }
            } catch (err) {
                setSaveMessage('Erro ao carregar configurações do banco.');
            }
        }
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage('');
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isOpen,
                    deliveryFee,
                    categories,
                    items
                })
            });
            const data = await res.json();
            if (data.success) {
                setSaveMessage('Alterações salvas com sucesso!');
            } else {
                setSaveMessage('Erro ao salvar alterações.');
            }
        } catch (error) {
            setSaveMessage('Erro ao salvar alterações.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(''), 3000);
        }
    };

    const handleLogout = () => {
        // Cookies.remove('isAuthenticated');
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

    const handleToggleStatus = async () => {
        setIsOpen((prev) => !prev);
        // Salvar imediatamente no banco
        setIsSaving(true);
        setSaveMessage('');
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isOpen: !isOpen, // novo valor
                    deliveryFee,
                    categories,
                    items
                })
            });
            const data = await res.json();
            if (data.success) {
                setSaveMessage('Status alterado com sucesso!');
            } else {
                setSaveMessage('Erro ao alterar status.');
            }
        } catch (error) {
            setSaveMessage('Erro ao alterar status.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(''), 3000);
        }
    };

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gray-50 p-4 sm:p-8"
        >
            <div className="max-w-7xl mx-auto">
                {/* Abas */}
                <div className="flex space-x-2 mb-6">
                    <button
                        className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors ${activeTab === 'admin' ? 'border-orange-500 text-orange-600 bg-white' : 'border-transparent text-gray-500 bg-orange-100 hover:text-orange-600'}`}
                        onClick={() => setActiveTab('admin')}
                    >
                        Cardápio/Admin
                    </button>
                    <button
                        className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors ${activeTab === 'pedidos' ? 'border-orange-500 text-orange-600 bg-white' : 'border-transparent text-gray-500 bg-orange-100 hover:text-orange-600'}`}
                        onClick={() => setActiveTab('pedidos')}
                    >
                        Pedidos Recentes
                    </button>
                </div>
                {/* Conteúdo das abas */}
                {activeTab === 'admin' ? (
                    <>
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-12 gap-4"
                        >
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2 sm:mb-4">Painel Administrativo</h1>
                                <p className="text-lg sm:text-xl text-orange-500">Gerencie seu cardápio digital</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleToggleStatus}
                                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${isOpen
                                        ? 'bg-yellow-100 text-orange-700'
                                        : 'bg-gray-200 text-gray-500'
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
                                            <span className="flex items-center">
                                                <span className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center mr-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </span>
                                                <span className="text-orange-700 font-semibold">Aberto</span>
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                <span className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center mr-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </span>
                                                <span className="text-gray-600 font-semibold">Fechado</span>
                                            </span>
                                        )}
                                    </motion.span>
                                    {isOpen ? 'Aberto' : 'Fechado'}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
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
                                    className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-yellow-200 text-orange-700 hover:bg-yellow-300"
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

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                            {/* Seção de Categorias */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-400"
                            >
                                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-orange-600">Categorias</h2>
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
                                className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-400"
                            >
                                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-yellow-600">Itens do Cardápio</h2>
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
                                                    className="p-4 bg-yellow-50 rounded-lg border border-yellow-200"
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
                                className="border rounded px-3 py-2 w-full max-w-xs"
                            />
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-400">
                        <RecentOrders />
                    </div>
                )}
            </div>
            <style jsx global>{`
@media print {
  body * {
    visibility: hidden !important;
  }
  .print-pedido, .print-pedido * {
    visibility: visible !important;
  }
  .print-pedido {
    position: absolute !important;
    left: 0; top: 0; width: 80mm; min-width: 0; max-width: 100vw;
    background: white !important;
    color: #111 !important;
    font-size: 10px !important;
    box-shadow: none !important;
    border: none !important;
    margin: 0 !important;
    padding: 4px !important;
  }
  .print-pedido h2 {
    font-size: 12px !important;
    margin-bottom: 4px !important;
    text-align: center !important;
  }
  .print-pedido h3 {
    font-size: 11px !important;
    margin-bottom: 2px !important;
  }
  .print-pedido div, .print-pedido span {
    font-size: 10px !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .print-pedido button, .print-pedido .no-print {
    display: none !important;
  }
  .print-pedido .border-b {
    border-bottom: 1px solid #ddd !important;
    margin-bottom: 4px !important;
    padding-bottom: 4px !important;
  }
  .print-pedido .space-y-2 > div {
    margin-bottom: 4px !important;
  }
}
`}</style>
        </motion.main>
    );
} 