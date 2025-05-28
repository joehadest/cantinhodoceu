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
    const [isLoading, setIsLoading] = useState(false);
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
    const [mensagem, setMensagem] = useState<string | null>(null);
    const [cliente, setCliente] = useState({ nome: '', telefone: '' });
    const [formaPagamento, setFormaPagamento] = useState('');
    const [observacoes, setObservacoes] = useState('');

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

    const handleCheckout = async () => {
        try {
            setIsLoading(true);
            setMensagem(null);
            const pedidoData = {
                itens: cart.items.map(item => ({
                    nome: item.item.name,
                    quantidade: item.quantity,
                    preco: item.item.price,
                    observacao: item.observations || ''
                })),
                total: cart.subtotal + deliveryFee,
                endereco: cart.deliveryInfo,
                cliente,
                formaPagamento,
                observacoes
            };

            const response = await fetch('/api/pedidos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pedidoData),
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar o pedido');
            }

            const result = await response.json();
            setMensagem(result.message || 'Pedido enviado com sucesso!');
            onCheckout();
        } catch (error) {
            setMensagem('Erro ao finalizar pedido. Por favor, tente novamente.');
        } finally {
            setIsLoading(false);
        }
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
                className="bg-white rounded-xl shadow-lg p-6 max-h-[80vh] overflow-y-auto"
            >
                <h2 className="text-2xl font-bold mb-6 text-orange-600">Carrinho</h2>

                {cart.items.length === 0 ? (
                    <p className="text-yellow-600 text-center py-4">Seu carrinho está vazio</p>
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
                            <div className="flex justify-between text-orange-600">
                                <span>Subtotal</span>
                                <span>R$ {cart.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-orange-600">
                                <span>Taxa de entrega</span>
                                <span>R$ {deliveryFee.toFixed(2)}</span>
                            </div>
                            <div className="text-sm text-orange-500">
                                Tempo estimado: {cart.deliveryInfo?.estimatedTime}
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t text-orange-700">
                                <span>Total</span>
                                <span>R$ {(cart.subtotal + deliveryFee).toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Campos de cliente, pagamento e observações */}
                        <div className="mb-4 space-y-2">
                            <div>
                                <label className="block text-sm font-medium text-orange-700">Nome do Cliente</label>
                                <input
                                    type="text"
                                    value={cliente.nome}
                                    onChange={e => setCliente({ ...cliente, nome: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-yellow-400 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-yellow-50 text-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-orange-700">Telefone</label>
                                <input
                                    type="tel"
                                    value={cliente.telefone}
                                    onChange={e => setCliente({ ...cliente, telefone: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-yellow-400 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-yellow-50 text-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-orange-700">Forma de Pagamento</label>
                                <select
                                    value={formaPagamento}
                                    onChange={e => setFormaPagamento(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-yellow-400 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-yellow-50 text-gray-900"
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="Dinheiro">Dinheiro</option>
                                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                                    <option value="Cartão de Débito">Cartão de Débito</option>
                                    <option value="Pix">Pix</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-orange-700">Observações</label>
                                <textarea
                                    value={observacoes}
                                    onChange={e => setObservacoes(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-yellow-400 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-yellow-50 text-gray-900"
                                    rows={2}
                                    placeholder="Ex: Sem cebola, troco para 50, etc."
                                />
                            </div>
                        </div>

                        {/* Mensagem de sucesso/erro */}
                        {mensagem && (
                            <div className="mb-4 p-4 rounded-lg bg-green-100 border border-green-300 text-green-800 text-center font-semibold shadow">
                                {mensagem}
                            </div>
                        )}

                        {!cart.deliveryInfo ? (
                            <button
                                onClick={() => setIsAddressFormOpen(true)}
                                className="w-full bg-orange-500 hover:bg-red-500 text-white py-3 px-4 rounded-lg font-semibold transition-colors mt-4"
                            >
                                Adicionar Endereço de Entrega
                            </button>
                        ) : (
                            <button
                                onClick={handleCheckout}
                                disabled={isLoading}
                                className={`w-full bg-orange-500 hover:bg-red-500 text-white py-3 px-4 rounded-lg font-semibold transition-colors mt-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Finalizando...' : 'Finalizar Pedido'}
                            </button>
                        )}
                    </>
                )}

                <AnimatePresence>
                    {isAddressFormOpen && (
                        <motion.div
                            className="fixed inset-0 bg-orange-100 bg-opacity-80 z-50 flex items-center justify-center p-4"
                            variants={addressFormVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <motion.div
                                className="bg-white rounded-2xl max-w-md w-full p-8 border-2 border-orange-400 shadow-xl relative"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <h3 className="text-xl font-bold mb-4 text-orange-600">Endereço de Entrega</h3>
                                <form onSubmit={handleAddressSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-orange-700">CEP</label>
                                        <input
                                            type="text"
                                            value={address.zipCode}
                                            onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-yellow-400 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-yellow-50 text-gray-900"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-orange-700">Rua</label>
                                            <input
                                                type="text"
                                                value={address.street}
                                                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-yellow-400 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-yellow-50 text-gray-900"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-orange-700">Número</label>
                                            <input
                                                type="text"
                                                value={address.number}
                                                onChange={(e) => setAddress({ ...address, number: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-yellow-400 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-yellow-50 text-gray-900"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-orange-700">Complemento</label>
                                        <input
                                            type="text"
                                            value={address.complement}
                                            onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-yellow-400 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-yellow-50 text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-orange-700">Bairro</label>
                                        <input
                                            type="text"
                                            value={address.neighborhood}
                                            onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-yellow-400 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-yellow-50 text-gray-900"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-orange-700">Cidade</label>
                                            <input
                                                type="text"
                                                value={address.city}
                                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-yellow-400 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-yellow-50 text-gray-900"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-orange-700">Estado</label>
                                            <input
                                                type="text"
                                                value={address.state}
                                                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-yellow-400 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-yellow-50 text-gray-900"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddressFormOpen(false)}
                                            className="flex-1 bg-yellow-200 text-orange-700 py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
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