import { MenuData } from '@/types/menu';

export const menuData: MenuData = {
    categories: [
        { id: '1', name: 'Entradas', order: 1 },
        { id: '2', name: 'Pratos Principais', order: 2 },
        { id: '3', name: 'Sobremesas', order: 3 },
        { id: '4', name: 'Bebidas', order: 4 },
    ],
    items: [
        {
            id: '1',
            name: 'Pão de Alho',
            description: 'Pão italiano torrado com manteiga de alho e ervas finas',
            price: 12.90,
            categoryId: '1',
            isAvailable: true,
            order: 1
        },
        {
            id: '2',
            name: 'Salada Caesar',
            description: 'Alface romana, croutons, parmesão e molho caesar',
            price: 24.90,
            categoryId: '1',
            isAvailable: true,
            order: 2
        },
        {
            id: '3',
            name: 'Filé ao Molho Madeira',
            description: 'Filé mignon grelhado ao molho madeira com arroz e batata',
            price: 49.90,
            categoryId: '2',
            isAvailable: true,
            order: 1
        },
        {
            id: '4',
            name: 'Risoto de Cogumelos',
            description: 'Risoto cremoso com mix de cogumelos e parmesão',
            price: 42.90,
            categoryId: '2',
            isAvailable: true,
            order: 2
        },
        {
            id: '5',
            name: 'Pudim de Leite',
            description: 'Pudim de leite condensado com calda de caramelo',
            price: 18.90,
            categoryId: '3',
            isAvailable: true,
            order: 1
        },
        {
            id: '6',
            name: 'Mousse de Chocolate',
            description: 'Mousse de chocolate belga com raspas de chocolate',
            price: 19.90,
            categoryId: '3',
            isAvailable: true,
            order: 2
        },
        {
            id: '7',
            name: 'Água Mineral',
            description: 'Garrafa 500ml',
            price: 5.90,
            categoryId: '4',
            isAvailable: true,
            order: 1
        },
        {
            id: '8',
            name: 'Refrigerante',
            description: 'Lata 350ml',
            price: 6.90,
            categoryId: '4',
            isAvailable: true,
            order: 2
        },
        {
            id: 'file-parmegiana',
            name: 'Filé à Parmegiana',
            description: 'Filé empanado coberto com molho de tomate e queijo, acompanhado de arroz e batata frita.',
            price: 39.90,
            categoryId: '2',
            isAvailable: true,
            order: 3
        },
        {
            id: 'strogonoff-frango',
            name: 'Strogonoff de Frango',
            description: 'Clássico strogonoff de frango com arroz branco e batata palha.',
            price: 32.90,
            categoryId: '2',
            isAvailable: true,
            order: 4
        },
        {
            id: 'lasanha-bolonhesa',
            name: 'Lasanha à Bolonhesa',
            description: 'Lasanha recheada com carne moída, molho de tomate e queijo gratinado.',
            price: 36.90,
            categoryId: '2',
            isAvailable: true,
            order: 5
        },
        {
            id: 'refrigerante-lata',
            name: 'Refrigerante Lata',
            description: 'Escolha entre Coca-Cola, Guaraná, Fanta e outros sabores.',
            price: 6.00,
            categoryId: '4',
            isAvailable: true,
            order: 3
        },
        {
            id: 'suco-natural',
            name: 'Suco Natural',
            description: 'Suco natural de laranja, limão ou abacaxi, feito na hora.',
            price: 8.00,
            categoryId: '4',
            isAvailable: true,
            order: 4
        },
        {
            id: 'agua-mineral',
            name: 'Água Mineral',
            description: 'Água mineral com ou sem gás.',
            price: 4.00,
            categoryId: '4',
            isAvailable: true,
            order: 5
        },
        {
            id: 'pudim-leite',
            name: 'Pudim de Leite',
            description: 'Tradicional pudim de leite condensado com calda de caramelo.',
            price: 12.00,
            categoryId: '3',
            isAvailable: true,
            order: 2
        },
        {
            id: 'mousse-chocolate',
            name: 'Mousse de Chocolate',
            description: 'Mousse de chocolate cremoso, leve e aerado.',
            price: 10.00,
            categoryId: '3',
            isAvailable: true,
            order: 3
        },
        {
            id: 'torta-limao',
            name: 'Torta de Limão',
            description: 'Torta de limão com base crocante e cobertura de merengue.',
            price: 11.00,
            categoryId: '3',
            isAvailable: true,
            order: 4
        },
        {
            id: '9',
            name: 'Bruschetta Italiana',
            description: 'Pão italiano com tomate, manjericão fresco e azeite de oliva.',
            price: 16.90,
            categoryId: '1',
            isAvailable: true,
            order: 3
        },
        {
            id: '10',
            name: 'Peixe Grelhado',
            description: 'Filé de peixe grelhado com legumes salteados e arroz.',
            price: 44.90,
            categoryId: '2',
            isAvailable: true,
            order: 6
        },
        {
            id: '11',
            name: 'Cheesecake de Frutas Vermelhas',
            description: 'Cheesecake cremoso com calda de frutas vermelhas.',
            price: 21.90,
            categoryId: '3',
            isAvailable: true,
            order: 5
        },
        {
            id: '12',
            name: 'Chá Gelado',
            description: 'Chá gelado de limão ou pêssego.',
            price: 7.00,
            categoryId: '4',
            isAvailable: true,
            order: 6
        },
    ],
}; 