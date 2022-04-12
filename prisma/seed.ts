import { PrismaClient, UserModel, Role } from '@prisma/client'
import { hash } from 'bcryptjs'
const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.userModel.update({
    where: {
      email: "admin@greenton.com"
    },
      data:{
          password: await hash('admin', 11),
      }
  })

  const user = await prisma.userModel.update({
    where: {
      email: "user@greenton.com"
    },
      data:{
          password: await hash('user', 11)
      }
  })

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })