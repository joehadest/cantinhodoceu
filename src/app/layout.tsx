import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import { StoreProvider } from '@/contexts/StoreContext';
import { MenuProvider } from '@/contexts/MenuContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Pappardelle Pizzaria e Pastelaria - Cardápio Digital',
    description: 'Cardápio digital da Pappardelle Pizzaria e Pastelaria',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body className={inter.className + ' text-gray-900'}>
                <MenuProvider>
                    <StoreProvider>
                        <Header />
                        <main className="min-h-screen bg-gray-50">
                            {children}
                        </main>
                    </StoreProvider>
                </MenuProvider>
            </body>
        </html>
    );
} 