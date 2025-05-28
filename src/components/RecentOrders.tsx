'use client';
import React, { useEffect, useState, useRef } from 'react';
import { FaShareAlt } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Endereco {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface PedidoItem {
  nome: string;
  quantidade: number;
  preco: number;
  observacao?: string;
}

interface Cliente {
  nome?: string;
  telefone?: string;
}

interface Pedido {
  _id: string;
  itens: PedidoItem[];
  total: number;
  status: string;
  data: string;
  endereco?: {
    address?: Endereco;
    deliveryFee?: number;
    estimatedTime?: string;
  };
  cliente?: Cliente;
  observacoes?: string;
  formaPagamento?: string;
}

export default function RecentOrders() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [mensagemCompartilhamento, setMensagemCompartilhamento] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPedidos() {
      setLoading(true);
      const res = await fetch('/api/pedidos');
      const data = await res.json();
      setPedidos(data.data || []);
      setLoading(false);
    }
    fetchPedidos();
  }, []);

  const handleRemoverPedido = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover este pedido?')) return;
    try {
      const res = await fetch(`/api/pedidos?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPedidos((prev) => prev.filter((p) => p._id !== id));
        setMensagem('Pedido removido com sucesso!');
      } else {
        setMensagem(data.message || 'Erro ao remover pedido.');
      }
    } catch (err) {
      setMensagem('Erro ao remover pedido.');
    }
  };

  const handleCompartilharPedido = async (pedido: Pedido) => {
    try {
      // Criar um elemento temporário para renderizar o pedido
      const tempDiv = document.createElement('div');
      tempDiv.className = 'print-pedido';
      tempDiv.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h3 style="text-align: center; color: #ea580c; font-size: 18px; margin-bottom: 10px;">
            Pappardelle Pizzaria e Pastelaria
          </h3>
          <div style="font-size: 12px; margin-bottom: 10px;">
            <div><b>Pedido:</b> #${pedido._id.slice(-6)}</div>
            <div><b>Data:</b> ${new Date(pedido.data).toLocaleString()}</div>
            <div><b>Status:</b> ${pedido.status}</div>
          </div>
          <div style="font-size: 12px; margin-bottom: 10px;">
            <h4 style="font-weight: bold; margin-bottom: 5px;">Cliente:</h4>
            <div>Nome: ${pedido.cliente?.nome || '-'}</div>
            <div>Telefone: ${pedido.cliente?.telefone || '-'}</div>
          </div>
          <div style="font-size: 12px; margin-bottom: 10px;">
            <h4 style="font-weight: bold; margin-bottom: 5px;">Endereço de Entrega:</h4>
            <div>${pedido.endereco?.address?.street || '-'}, ${pedido.endereco?.address?.number || '-'}</div>
            ${pedido.endereco?.address?.complement ? `<div>Complemento: ${pedido.endereco.address.complement}</div>` : ''}
            <div>${pedido.endereco?.address?.neighborhood || '-'} - ${pedido.endereco?.address?.city || '-'} / ${pedido.endereco?.address?.state || '-'}</div>
            <div>CEP: ${pedido.endereco?.address?.zipCode || '-'}</div>
          </div>
          <div style="font-size: 12px; margin-bottom: 10px;">
            <div><b>Tempo estimado de entrega:</b> ${pedido.endereco?.estimatedTime || '-'}</div>
          </div>
          <div style="margin-bottom: 10px;">
            <h4 style="font-weight: bold; margin-bottom: 5px;">Itens:</h4>
            <ul style="list-style: none; padding: 0;">
              ${pedido.itens.map(item => `
                <li style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 3px;">
                  <span>${item.quantidade}x ${item.nome}</span>
                  <span>R$ ${item.preco.toFixed(2)}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          ${pedido.observacoes ? `
            <div style="font-size: 12px; margin-bottom: 10px;">
              <h4 style="font-weight: bold; margin-bottom: 5px;">Observações:</h4>
              <div>${pedido.observacoes}</div>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 10px;">
            <span>Taxa de Entrega:</span>
            <span>R$ ${pedido.endereco?.deliveryFee?.toFixed(2) || '0,00'}</span>
          </div>
          <div style="font-size: 12px; margin-bottom: 10px;">
            <h4 style="font-weight: bold; margin-bottom: 5px;">Forma de Pagamento:</h4>
            <div>${pedido.formaPagamento || '-'}</div>
          </div>
          <div style="font-weight: bold; color: #ea580c; font-size: 16px; display: flex; justify-content: space-between; margin-top: 10px;">
            <span>Total:</span>
            <span>R$ ${pedido.total.toFixed(2)}</span>
          </div>
        </div>
      `;
      document.body.appendChild(tempDiv);

      // Converter o elemento para canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      // Criar o PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Adicionar o canvas ao PDF
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Remover o elemento temporário
      document.body.removeChild(tempDiv);

      // Converter o PDF para Blob
      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], `pedido-${pedido._id.slice(-6)}.pdf`, { type: 'application/pdf' });

      // Verificar se a Web Share API está disponível
      if (navigator.share) {
        try {
          await navigator.share({
            files: [pdfFile],
            title: `Pedido #${pedido._id.slice(-6)}`,
            text: `Pedido da Pappardelle Pizzaria e Pastelaria`
          });
          setMensagemCompartilhamento('Pedido compartilhado com sucesso!');
        } catch (error: any) {
          if (error.name !== 'AbortError') {
            console.error('Erro ao compartilhar:', error);
            setMensagemCompartilhamento('Erro ao compartilhar o pedido.');
          }
        }
      } else {
        // Fallback para navegadores que não suportam a Web Share API
        const url = URL.createObjectURL(pdfFile);
        const link = document.createElement('a');
        link.href = url;
        link.download = `pedido-${pedido._id.slice(-6)}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
        setMensagemCompartilhamento('Seu navegador não suporta compartilhamento direto. O PDF foi baixado.');
      }

      setTimeout(() => setMensagemCompartilhamento(null), 3000);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      setMensagemCompartilhamento('Erro ao gerar PDF.');
      setTimeout(() => setMensagemCompartilhamento(null), 3000);
    }
  };

  if (loading) return <div>Carregando pedidos...</div>;
  if (!pedidos.length) return <div className="text-center text-gray-500">Nenhum pedido recente.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-orange-600">Pedidos Recentes</h2>
      {mensagemCompartilhamento && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded text-center font-semibold">
          {mensagemCompartilhamento}
        </div>
      )}
      <ul className="space-y-4">
        {pedidos.map((pedido) => (
          <li key={pedido._id} className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-semibold text-orange-700">Pedido #{pedido._id.slice(-6)}</div>
              <div className="text-sm text-gray-600 mb-2">
                Data: {new Date(pedido.data).toLocaleString()}
              </div>
              <div className="font-bold text-orange-600">Total: R$ {pedido.total.toFixed(2)}</div>
              <div className="text-xs text-gray-500">Status: {pedido.status}</div>
            </div>
            <div className="flex flex-col gap-2 mt-2 sm:mt-0">
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                onClick={() => setPedidoSelecionado(pedido)}
              >
                Ver Detalhes
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                onClick={() => handleCompartilharPedido(pedido)}
              >
                <FaShareAlt /> Compartilhar
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-600 transition-colors"
                onClick={() => handleRemoverPedido(pedido._id)}
              >
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>
      {mensagem && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded text-center font-semibold">
          {mensagem}
        </div>
      )}

      {/* Modal de detalhes */}
      {pedidoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setPedidoSelecionado(null)}>
          <div
            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full relative print-pedido"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-orange-500 hover:text-orange-700 text-2xl focus:outline-none no-print"
              onClick={() => setPedidoSelecionado(null)}
              aria-label="Fechar modal de pedido"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-2 text-orange-600 text-center">Pappardelle Pizzaria e Pastelaria</h3>
            <div className="mb-2 text-xs text-gray-700 text-center">
              <div><b>Pedido:</b> #{pedidoSelecionado._id?.slice(-6) || '-'}</div>
              <div><b>Data:</b> {pedidoSelecionado.data ? new Date(pedidoSelecionado.data).toLocaleString() : '-'}</div>
              <div><b>Status:</b> {pedidoSelecionado.status || '-'}</div>
            </div>
            <div className="mb-2 text-xs">
              <h4 className="font-semibold mb-1">Cliente:</h4>
              <div>Nome: {pedidoSelecionado.cliente?.nome || '-'}</div>
              <div>Telefone: {pedidoSelecionado.cliente?.telefone || '-'}</div>
            </div>
            <div className="mb-2 text-xs">
              <h4 className="font-semibold mb-1">Endereço de Entrega:</h4>
              <div>{pedidoSelecionado.endereco?.address?.street || '-'}, {pedidoSelecionado.endereco?.address?.number || '-'}</div>
              {pedidoSelecionado.endereco?.address?.complement && <div>Compl: {pedidoSelecionado.endereco.address.complement}</div>}
              <div>{pedidoSelecionado.endereco?.address?.neighborhood || '-'} - {pedidoSelecionado.endereco?.address?.city || '-'} / {pedidoSelecionado.endereco?.address?.state || '-'}</div>
              <div>CEP: {pedidoSelecionado.endereco?.address?.zipCode || '-'}</div>
            </div>
            <div className="mb-2 text-xs">
              <div><b>Tempo estimado de entrega:</b> {pedidoSelecionado.endereco?.estimatedTime || '-'}</div>
            </div>
            <div className="mb-2">
              <h4 className="font-semibold mb-1">Itens:</h4>
              <ul>
                {pedidoSelecionado.itens.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-xs">
                    <span>{item.quantidade}x {item.nome}</span>
                    <span>R$ {item.preco.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
            {pedidoSelecionado.observacoes && (
              <div className="mb-2 text-xs">
                <h4 className="font-semibold mb-1">Observações:</h4>
                <div>{pedidoSelecionado.observacoes}</div>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span>Taxa de Entrega:</span>
              <span>R$ {pedidoSelecionado.endereco?.deliveryFee?.toFixed(2) || '0,00'}</span>
            </div>
            <div className="mb-2 text-xs">
              <h4 className="font-semibold mb-1">Forma de Pagamento:</h4>
              <div>{pedidoSelecionado.formaPagamento || '-'}</div>
            </div>
            <div className="font-bold text-orange-600 mt-2 text-lg flex justify-between">
              <span>Total:</span>
              <span>R$ {pedidoSelecionado.total?.toFixed(2) || '-'}</span>
            </div>
            <button
              className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-orange-900 font-bold py-2 rounded-lg transition-colors no-print"
              onClick={() => window.print()}
            >
              Imprimir
            </button>
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
              .print-pedido h3 {
                font-size: 12px !important;
                margin-bottom: 4px !important;
                text-align: center !important;
              }
              .print-pedido h4 {
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
            }
          `}</style>
        </div>
      )}
    </div>
  );
} 