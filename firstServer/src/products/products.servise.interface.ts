import { Orders, Products } from "@prisma/client";



export interface IProductsService {

    getAllProducts: () => Promise< Products| null>;
    getAllProductsQuantity: () => Promise< Products[]| null>;
    getProductById: (id: number) => Promise<Products | null>;
    setOrder: (order: object, user_id:number) => Promise<number>;
    getOrders: (user_id:number) => Promise<Orders[] | null>;
}