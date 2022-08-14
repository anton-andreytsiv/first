import { PrismaService } from "../database/prisma.service";
import { Context } from "../database/context"

const resolvers = {
    Query :{
        getAllProducts: (_parent, _args, context: Context) => {
            return context.prisma.products.findMany({
                orderBy:
                    {
                      id: 'asc'
                    }
                });
        }
    }
}

module.exports = resolvers