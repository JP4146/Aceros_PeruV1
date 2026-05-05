import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 })
    }

    const user = await prisma.usuarios.findFirst({
      where: { 
        user_login: {
          equals: username,
          mode: 'insensitive'
        }
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 })
    }

    // En una app real, usaríamos bcrypt para comparar hashes.
    // Para este MVP, compararemos el string directo (según el seed).
    if (user.password_hash !== password) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
    }

    if (!user.activo) {
      return NextResponse.json({ error: 'Cuenta desactivada' }, { status: 403 })
    }

    return NextResponse.json({
      message: 'Login exitoso',
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        user_login: user.user_login,
        rol: user.rol,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
