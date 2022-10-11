
import { Orders, Products } from "@prisma/client";

import { inject, injectable } from "inversify";
import { PrismaService } from "../database/prisma.service";
import { TYPES } from "../types";
import { IProductsRepository } from "./products.repository.interface";



   
@injectable()
export class ProductsRepository implements IProductsRepository{

    constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService){}


 
    async findAll (): Promise<Products | null | any>{
        return await this.prismaService.client.products.findMany({
            orderBy:
                {
                  id: 'asc'
                }
            });
        
    }
    async findAllQuantity (): Promise<Products[] | null | any>{
        return await this.prismaService.client.products.findMany({
            select:
                {
                  id: true,
                  quantity: true
                }
            });
        
    }
    async findById (id: number): Promise<Products | null>{
        return await this.prismaService.client.products.findFirst({
            where :{
                id
            }
        });
    }
    async changeQuantity (id: number, count: number): Promise<boolean | null>{
        const result = await this.prismaService.client.products.update({
            where :{
                id
            },
            data: {
                quantity: {
                    decrement: count
                }
            }
            
        });
        return true;
    }

    async addOrder(order: object, user_id: number): Promise<number>{
       const orderArr =  Object.entries(order).map(item => {
            return {
                idProduct: Number(item[0]),
                quantity: item[1]
            }            
        })
        
        const result  = await this.prismaService.client.orders.create({
            data:{
                done: false,
                userId: user_id,
                products: {
                    create: orderArr,
                },
            },
       })
        
        return result.id;
    }
    
    async getOrders(user_id:number): Promise<Orders[]>{
        const result = await this.prismaService.client.orders.findMany({
            where:{
                userId: user_id,
                done: false
            },
            include: {
                products: {
                    include:{
                        product:{
                            select:{
                                title: true,
                                id:true
                            }
                        }
                    },
                    
                }
            }
            
        })
        return result
    }
    async getOrderInfo(prod_ids:number[]): Promise<Products[]>{
        return await this.prismaService.client.products.findMany({
            where:{
                id: {in: prod_ids}
            }
            
        })
    }

    
}

