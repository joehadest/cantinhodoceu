import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Pedido from '../../../../models/Pedido';

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    console.log('DADOS RECEBIDOS NO BACKEND:', JSON.stringify(data, null, 2));
    
    const pedido = await Pedido.create({
      itens: data.itens,
      total: data.total,
      status: 'finalizado',
      cliente: data.cliente,
      endereco: data.endereco,
      formaPagamento: data.formaPagamento,
      observacoes: data.observacoes
    });

    return NextResponse.json({ 
      success: true, 
      message: '🎉 Pedido realizado com sucesso! Em breve ele será preparado com carinho pela equipe Pappardelle. Obrigado por escolher a gente! 🍕🥟',
      data: pedido 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const pedidos = await Pedido.find().sort({ data: -1 });
    return NextResponse.json({ success: true, data: pedidos });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID do pedido não informado.' }, { status: 400 });
    }
    await Pedido.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Pedido removido com sucesso.' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 