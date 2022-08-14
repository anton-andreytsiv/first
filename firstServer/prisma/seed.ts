import { PrismaClient, UserModel, Role } from '@prisma/client'
import { hash } from 'bcryptjs'
const prisma = new PrismaClient()
require('dotenv').config({path: '../.env'});
const salt = 11;//process.env.SALT as string;
async function main() {

  const admin = await prisma.userModel.upsert({
    where: {
      email: "andreytsiv@ukr.net"
    },
      update:{
          password: await hash('admin', salt),
      },
      create:{
        email: 'andreytsiv@ukr.net',
        password: await hash('admin', salt),
        name: 'Anton',
        role: {
          create: {
            name: "admin"
          }
        }
      }
  })

  const user = await prisma.userModel.upsert({
    where: {
      email: "user@greenton.com"
    },
      update:{
      password: await hash('user', salt),
    },
     create:{
    email: 'user@greenton.com',
    password: await hash('user', salt),
    name: 'user',
    role: {
      create: {
        name: "user"
      }
    }
  }
  })

  const products= await prisma.products.createMany({
    data:[
      {
        title:'Rocket',
        def: 'Arugula, also known as salad or garden rocket,is one of the nutritious green-leafy vegetable of Mediterranean origin. It is a small, low growing annual herb featuring dandelion like succulent, elongated, lobular leaves with green-veins.',
        quantity:20, 
        imagePath: 'rocket.jpg'
      },
      {
        title:'Lettuce',
        def: 'Lettuce, Lactuca sativa, is a leafy herbaceous annual or biennial plant in the family Asteraceae grown for its leaves which are used as a salad green. The lettuce plant can vary greatly in size, shape and leaf type but generally, the leaves of the plant form a dense head or loose rosette.',
        quantity: 20, 
        imagePath: 'lettuce.jpg'
      },
      {
        title: 'Redish',
        def: 'Radishes are annual or biennial brassicaceous crops grown for their swollen tap roots which can be globular, tapering, or cylindrical. The root skin colour ranges from white through pink, red, purple, yellow, and green to black, but the flesh is usually white. The roots obtain their color from anthocyanins.',
        quantity: 20, 
        imagePath: 'redish.jpg' 
      },
      {
        title: 'Spinach',
        def: 'Spinach is a herbaceous plant whose leaves, green and arranged in rosette, are eaten raw or cooked. The leaves have an oval shape and are wrinkled; they can be whole or sawed. It is a very nutritious, tasteful and easy-to-digest plant. The Arabs regarded it as the queen of vegetables.',
        quantity: 20, 
        imagePath: 'spinach.jpg' 
      }
    ]
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