import mongoose from 'mongoose';

const PedidoSchema = new mongoose.Schema({
  itens: [{
    nome: String,
    quantidade: Number,
    preco: Number,
    observacao: String
  }],
  total: Number,
  status: {
    type: String,
    enum: ['pendente', 'finalizado'],
    default: 'pendente'
  },
  data: {
    type: Date,
    default: Date.now
  },
  cliente: {
    nome: String,
    telefone: String
  },
  endereco: {
    address: {
      street: String,
      number: String,
      complement: String,
      neighborhood: String,
      city: String,
      state: String,
      zipCode: String
    },
    deliveryFee: Number,
    estimatedTime: String
  },
  formaPagamento: String,
  observacoes: String
});

export default mongoose.models.Pedido || mongoose.model('Pedido', PedidoSchema, 'orders'); 