import { PrismaClient, UserModel, Role } from '@prisma/client'
import { hash } from 'bcryptjs'
const prisma = new PrismaClient()

async function main() {

  const admin = await prisma.userModel.upsert({
    where: {
      email: "admin@greenton.com"
    },
      update:{
          password: await hash('admin', 11),
      },
      create:{
        email: 'admin@greenton.com',
        password: await hash('admin', 11),
        name: 'Anton',
        roleId: 1
      }
  })

  const user = await prisma.userModel.upsert({
    where: {
      email: "user@greenton.com"
    },
      update:{
      password: await hash('user', 11),
    },
     create:{
    email: 'user@greenton.com',
    password: await hash('user', 11),
    name: 'user',
    roleId: 2
  }
  })
 console.log('seed file run');


}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })