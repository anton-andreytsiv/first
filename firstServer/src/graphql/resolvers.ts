import { PrismaService } from "../database/prisma.service";
import { context, Context } from "../database/context"
import { argsToArgsConfig } from "graphql/type/definition";
import { PrismaSelect } from '@paljs/plugins';

const resolvers = {
    Query :{
        getAllProducts: async (_parent, _args, context: Context, info) => {
            const select = new PrismaSelect(info).value; 
            return  await  context.prisma.products.findMany({
                orderBy:
                    {
                      id: 'asc'
                    },
                    ...select
                });
        },
        getMyOrders: async (_parent, args: {userId: number}, context: Context, info) => {
            const select = new PrismaSelect(info).value; 
            return  await context.prisma.orders.findMany({
                where:{
                    userId: args.userId,
                    done: false
                },
                ...select
            });
        }


    },
    Mutation:{
        buyProducts: async (_parent, args: {prod, user_id}, context: Context) => {
            let productLess = false;
            const prod = JSON.parse(args.prod)
            console.log('products ',prod);
            console.log('id = ', args.user_id)
			let allProducts = await context.prisma.products.findMany({
                select:
                    {
                      id: true,
                      quantity: true
                    }
                });

			Object.entries(prod).map( item => {
				if (allProducts){
				    allProducts.forEach(element => {
						if(element.id == Number(item[0]) && element.quantity < Number(item[1])){
							productLess = true;
						}
					});
				}
			});

			if (productLess){
				return "no items"
			} else {
                Object.entries(prod).map(async item => {
                     await context.prisma.products.update({
                        where :{
                            id: Number(item[0])
                        },
                        data: {
                            quantity: {
                                decrement: Number(item[1])
                            }
                        }
                        
                    });
                });

                const orderArr =  Object.entries(prod).map(item => {
                    return {
                        idProduct: Number(item[0]),
                        quantity: Number(item[1])
                    }            
                })
                
                return await context.prisma.orders.create({
                    data:{
                        done: false,
                        userId: args.user_id,
                        products: {
                            create: orderArr,
                        },
                    },
               })
            }

        }
    }
}

module.exports = resolvers