import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import { StoreProvider } from '@/contexts/StoreContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Cantinho do Céu - Cardápio Digital',
    description: 'Cardápio digital do Cantinho do Céu',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body className={inter.className}>
                <StoreProvider>
                    <Header />
                    <main className="min-h-screen bg-gray-50">
                        {children}
                    </main>
                </StoreProvider>
            </body>
        </html>
    );
} 