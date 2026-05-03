import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const totalProducts = await prisma.productos_terminados.count()
    const activeOrders = await prisma.ordenes_produccion.count({
      where: { estado: { not: 'Acabado' } }
    })
    
    // Suma de ventas del día actual
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todaySales = await prisma.ventas.aggregate({
      where: {
        fecha_venta: {
          gte: today
        }
      },
      _sum: {
        monto_total: true
      }
    })

    const allInsumos = await prisma.insumos.findMany()
    const criticalInsumos = allInsumos.filter(i => 
      Number(i.stock_actual) <= Number(i.stock_minimo)
    )

    const recentOrders = await prisma.ordenes_produccion.findMany({
      take: 3,
      orderBy: { fecha_inicio: 'desc' },
      include: { productos_terminados: true }
    })

    const weeklySales = await prisma.ventas.findMany({
        where: {
            fecha_venta: {
                gte: new Date(new Date().setDate(new Date().getDate() - 7))
            }
        },
        orderBy: { fecha_venta: 'asc' }
    })

    return NextResponse.json({
      stats: {
        products: totalProducts,
        orders: activeOrders,
        salesToday: todaySales._sum.monto_total || 0,
        alerts: criticalInsumos.length
      },
      criticalAlerts: criticalInsumos.map(i => ({
        productName: i.nombre,
        currentStock: Number(i.stock_actual),
        minStock: Number(i.stock_minimo),
        unit: i.unidad_medida,
        severity: Number(i.stock_actual) <= Number(i.stock_minimo) * 0.5 ? 'critical' : 'warning'
      })),
      recentOrders: recentOrders.map(o => ({
        id: `OP-${o.id_orden.toString().padStart(3, '0')}`,
        product: o.productos_terminados.nombre,
        status: o.estado,
        progress: o.estado === 'Corte' ? 25 : o.estado === 'Soldadura' ? 50 : o.estado === 'Pintura' ? 75 : 100
      })),
      weeklySales: weeklySales.map(v => ({
          fecha: v.fecha_venta,
          monto: Number(v.monto_total)
      }))
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error fetching dashboard stats' }, { status: 500 })
  }
}
