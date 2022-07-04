import { Orders, Products } from "@prisma/client";
import { inject, injectable } from "inversify";
import { ConfigService } from "../config/config.service";

import { TYPES } from "../types";
import { IProductsService} from './products.servise.interface'
import { ProductsRepository } from './products.repository'


@injectable()
export class ProductsService implements IProductsService {
    constructor (
        @inject(TYPES.ConfigService) private configService: ConfigService,
        @inject(TYPES.ProductsRepository) private productsRepository: ProductsRepository
        ) {}



    
    async getProductById (id: number): Promise<Products | null>{
        return await this.productsRepository.findById(id);
    }


    async getAllProducts (): Promise<Products | null>{
        return await this.productsRepository.findAll();
    }

    async getAllProductsQuantity (): Promise<Products[] | null>{
        return await this.productsRepository.findAllQuantity();
    }

    async setOrder (prod: object, user_id: number): Promise<number>{
        Object.entries(prod).map(async item => {
            let product = await this.productsRepository.changeQuantity(Number(item[0]), item[1])
        });
        let result = await this.productsRepository.addOrder(prod, user_id);

        return result;


        
    }
    async getOrders (user_id: number): Promise<Orders[] | null>{

        return await this.productsRepository.getOrders(user_id);
        
    }
    
} 