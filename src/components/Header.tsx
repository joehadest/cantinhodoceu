'use client';
import React, { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { motion } from 'framer-motion';
import { FaPizzaSlice, FaExclamationCircle } from 'react-icons/fa';
import Image from 'next/image';

export default function Header() {
    const { isOpen } = useStore();
    const [showAddress, setShowAddress] = useState(false);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-white shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-26">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center relative"
                    >
                        <Image src="/logo.png" alt="Logo Pappardelle" width={96} height={96} className="rounded-full bg-white p-1 shadow" />
                        <button
                            className="ml-2 text-orange-500 hover:text-yellow-500 focus:outline-none"
                            onClick={() => setShowAddress((v) => !v)}
                            aria-label="Ver endereço do estabelecimento"
                        >
                            <FaExclamationCircle size={32} />
                        </button>
                        {showAddress && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setShowAddress(false)}>
                                <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full relative" onClick={e => e.stopPropagation()}>
                                    <button
                                        className="absolute top-2 right-2 text-orange-500 hover:text-orange-700 text-2xl focus:outline-none"
                                        onClick={() => setShowAddress(false)}
                                        aria-label="Fechar modal de endereço"
                                    >
                                        &times;
                                    </button>
                                    <h2 className="text-xl font-bold mb-2 text-orange-600">Endereço do Estabelecimento</h2>
                                    <p className="text-gray-800 text-base">
                                        Rua Exemplo, 123 - Centro, Cidade/UF<br/>
                                        (Coloque o endereço real aqui)
                                    </p>
                                </div>
                            </div>
                        )}
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
                                    <span className="flex items-center">
                                        <span className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center mr-2">
                                            <svg className="w-3 h-3" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                        <span className="text-orange-700 font-semibold">Aberto</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <span className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center mr-2">
                                            <svg className="w-3 h-3" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </span>
                                        <span className="text-gray-600 font-semibold">Fechado</span>
                                    </span>
                                )}
                            </motion.span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.header>
    );
} 