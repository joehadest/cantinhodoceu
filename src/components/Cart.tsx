'use client';
import React, { useState, useEffect } from 'react';
import type { Cart, CartItem, Address } from '@/types/cart';
import { motion, AnimatePresence } from 'framer-motion';

interface CartProps {
    cart: Cart;
    onUpdateQuantity: (itemId: string, quantity: number) => void;
    onRemoveItem: (itemId: string) => void;
    onUpdateAddress: (address: Address) => void;
    onCheckout: () => void;
}

export default function Cart({ cart, onUpdateQuantity, onRemoveItem, onUpdateAddress, onCheckout }: CartProps) {
    const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
    const [address, setAddress] = useState<Address>({
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
    });
    const [deliveryFee, setDeliveryFee] = useState(0);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('deliveryFee');
            setDeliveryFee(saved ? parseFloat(saved) : 0);
        }
    }, []);

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateAddress(address);
        setIsAddressFormOpen(false);
    };

    const cartVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
        exit: { opacity: 0, y: 40, scale: 0.95, transition: { duration: 0.2 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: 40 },
        visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
        exit: { opacity: 0, x: -40, transition: { duration: 0.2 } }
    };

    const addressFormVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
    };

    return (
        <AnimatePresence>
            <motion.div
                key="cart"
                variants={cartVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-xl shadow-lg p-6"
            >
                <h2 className="text-2xl font-bold mb-6">Carrinho</h2>

                {cart.items.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Seu carrinho está vazio</p>
                ) : (
                    <>
                        <div className="space-y-4 mb-6">
                            <AnimatePresence>
                                {cart.items.map((cartItem) => (
                                    <motion.div
                                        key={cartItem.item.id}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        layout
                                        className="flex items-center justify-between border-b pb-4"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-medium">{cartItem.item.name}</h3>
                                            <p className="text-sm text-gray-600">R$ {cartItem.item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                                                    className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                                >
                                                    -
                                                </button>
                                                <span>{cartItem.quantity}</span>
                                                <button
                                                    onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                                                    className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => onRemoveItem(cartItem.item.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>R$ {cart.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Taxa de entrega</span>
                                <span>R$ {deliveryFee.toFixed(2)}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                                Tempo estimado: {cart.deliveryInfo?.estimatedTime}
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                <span>Total</span>
                                <span>R$ {(cart.subtotal + deliveryFee).toFixed(2)}</span>
                            </div>
                        </div>

                        {!cart.deliveryInfo ? (
                            <button
                                onClick={() => setIsAddressFormOpen(true)}
                                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Adicionar Endereço de Entrega
                            </button>
                        ) : (
                            <button
                                onClick={onCheckout}
                                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Finalizar Pedido
                            </button>
                        )}
                    </>
                )}

                <AnimatePresence>
                    {isAddressFormOpen && (
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                            variants={addressFormVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <motion.div
                                className="bg-white rounded-xl max-w-md w-full p-6"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <h3 className="text-xl font-bold mb-4">Endereço de Entrega</h3>
                                <form onSubmit={handleAddressSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">CEP</label>
                                        <input
                                            type="text"
                                            value={address.zipCode}
                                            onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Rua</label>
                                            <input
                                                type="text"
                                                value={address.street}
                                                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Número</label>
                                            <input
                                                type="text"
                                                value={address.number}
                                                onChange={(e) => setAddress({ ...address, number: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Complemento</label>
                                        <input
                                            type="text"
                                            value={address.complement}
                                            onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Bairro</label>
                                        <input
                                            type="text"
                                            value={address.neighborhood}
                                            onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Cidade</label>
                                            <input
                                                type="text"
                                                value={address.city}
                                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Estado</label>
                                            <input
                                                type="text"
                                                value={address.state}
                                                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddressFormOpen(false)}
                                            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                                        >
                                            Salvar
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
} 