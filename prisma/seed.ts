import { PrismaClient, tipo_rol, tipo_persona, tipo_estado_produccion } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando el sembrado de datos...')

  // Limpieza
  await prisma.detalle_ventas.deleteMany()
  await prisma.ventas.deleteMany()
  await prisma.ordenes_produccion.deleteMany()
  await prisma.productos_terminados.deleteMany()
  await prisma.insumos.deleteMany()
  await prisma.clientes.deleteMany()
  await prisma.usuarios.deleteMany()

  // 1. Usuarios
  const admin = await prisma.usuarios.upsert({
    where: { user_login: 'admin' },
    update: {},
    create: {
      nombre: 'Juan Huarcaya',
      user_login: 'admin',
      password_hash: 'admin123', // En producción usar hashing
      rol: tipo_rol.Administrador,
      activo: true,
    },
  })

  const vendedor = await prisma.usuarios.upsert({
    where: { user_login: 'vendedor1' },
    update: {},
    create: {
      nombre: 'Lucía Fernández',
      user_login: 'vendedor1',
      password_hash: 'vendedor123',
      rol: tipo_rol.Vendedor,
      activo: true,
    },
  })

  const operario = await prisma.usuarios.upsert({
    where: { user_login: 'operario1' },
    update: {},
    create: {
      nombre: 'Juan Quispe',
      user_login: 'operario1',
      password_hash: 'operario123',
      rol: tipo_rol.Operario,
      activo: true,
    },
  })

  // 2. Clientes
  const cliente1 = await prisma.clientes.upsert({
    where: { documento: '20123456789' },
    update: {},
    create: {
      nombre_o_razon_social: 'Ferretería El Progreso SAC',
      documento: '20123456789',
      direccion: 'Av. Industrial 450, Lima',
      tipo_cliente: tipo_persona.Jur_dico,
    },
  })

  const cliente2 = await prisma.clientes.upsert({
    where: { documento: '10456789123' },
    update: {},
    create: {
      nombre_o_razon_social: 'Roberto Sánchez',
      documento: '10456789123',
      direccion: 'Calle Los Cedros 123, Arequipa',
      tipo_cliente: tipo_persona.Natural,
    },
  })

  // 3. Insumos
  const acero = await prisma.insumos.create({
    data: {
      nombre: 'Plancha de Acero 1/8',
      unidad_medida: 'Unidad',
      stock_actual: 50,
      stock_minimo: 10,
    },
  })

  const pintura = await prisma.insumos.create({
    data: {
      nombre: 'Pintura Anticorrosiva Negra',
      unidad_medida: 'Galón',
      stock_actual: 5,
      stock_minimo: 15, // Alerta!
    },
  })

  const soldadura = await prisma.insumos.create({
    data: {
      nombre: 'Electrodos E6011',
      unidad_medida: 'Paquete',
      stock_actual: 3,
      stock_minimo: 10, // Alerta!
    },
  })

  // 4. Productos Terminados
  const pico = await prisma.productos_terminados.create({
    data: {
      nombre: 'Pico Agrícola Reforzado',
      descripcion: 'Pico de acero forjado para trabajo pesado',
      precio_venta: 45.50,
      stock_disponible: 120,
      imagen_url: '/products/pico.png',
    },
  })

  const rastrillo = await prisma.productos_terminados.create({
    data: {
      nombre: 'Rastrillo Metálico 14 Dientes',
      descripcion: 'Rastrillo para jardín con mango de madera',
      precio_venta: 28.00,
      stock_disponible: 85,
      imagen_url: '/products/rastrillo.png',
    },
  })

  // 5. Órdenes de Producción
  await prisma.ordenes_produccion.create({
    data: {
      id_producto: pico.id_producto,
      id_operario: operario.id_usuario,
      cantidad_a_fabricar: 50,
      estado: tipo_estado_produccion.Soldadura,
    },
  })

  await prisma.ordenes_produccion.create({
    data: {
      id_producto: rastrillo.id_producto,
      id_operario: operario.id_usuario,
      cantidad_a_fabricar: 30,
      estado: tipo_estado_produccion.Corte,
    },
  })

  // 6. Ventas
  const venta1 = await prisma.ventas.create({
    data: {
      id_cliente: cliente1.id_cliente,
      id_vendedor: vendedor.id_usuario,
      monto_total: 455.00,
      tipo_comprobante: 'Factura',
      detalle_ventas: {
        create: {
          id_producto: pico.id_producto,
          cantidad: 10,
          precio_unitario_aplicado: 45.50,
          subtotal: 455.00,
        },
      },
    },
  })

  console.log('Sembrado completado con éxito.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
