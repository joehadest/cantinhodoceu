import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Settings from '../../../../models/Settings';

export async function GET() {
  await connectDB();
  let settings = await Settings.findOne();
  if (!settings) {
    // Cria padrão se não existir
    settings = await Settings.create({});
  }
  return NextResponse.json({ success: true, data: settings });
}

export async function PUT(request) {
  await connectDB();
  const data = await request.json();
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(data);
  } else {
    Object.assign(settings, data);
    await settings.save();
  }
  return NextResponse.json({ success: true, data: settings });
} 