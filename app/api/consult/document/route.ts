import { NextResponse } from 'next/server';
import { consultDocument } from '@/lib/document-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as 'dni' | 'ruc';
  const number = searchParams.get('number');

  if (!type || !number) {
    return NextResponse.json({ error: 'Tipo y número son requeridos' }, { status: 400 });
  }

  if (type !== 'dni' && type !== 'ruc') {
    return NextResponse.json({ error: 'Tipo inválido (debe ser dni o ruc)' }, { status: 400 });
  }

  try {
    const data = await consultDocument(type, number);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar el documento' }, { status: 500 });
  }
}
