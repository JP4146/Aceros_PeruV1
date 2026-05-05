import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const usersCount = await prisma.usuarios.count()
  console.log(`Total users in DB: ${usersCount}`)
  const users = await prisma.usuarios.findMany({
    select: { user_login: true, rol: true }
  })
  console.log('Users:', users)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
