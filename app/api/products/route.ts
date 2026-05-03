import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.productos_terminados.findMany({
      where: { activo: true },
      include: {
        ordenes_produccion: {
          where: {
            estado: {
              notIn: ['Acabado']
            }
          }
        }
      }
    })

    const formattedProducts = products.map(p => ({
      id: p.id_producto,
      nombre: p.nombre,
      precio: Number(p.precio_venta),
      stockFisico: p.stock_disponible || 0,
      enCola: p.ordenes_produccion.reduce((acc, curr) => acc + curr.cantidad_a_fabricar, 0),
      imagenUrl: p.imagen_url
    }))

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 })
  }
}
