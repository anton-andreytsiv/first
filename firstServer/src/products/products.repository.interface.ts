
import { Orders, Products} from "@prisma/client";


export interface IProductsRepository {

    findAll: () => Promise<Products | null | any>;
    findAllQuantity: () => Promise<Products[] | null | any>;
    findById: (id: number) => Promise<Products | null>;
    addOrder: (order:object, user_id: number) => Promise<number>;
    getOrders: (user_id:number) => Promise<Orders[]>;
    getOrderInfo: (order_ids:number[]) => Promise<Products[]>;

}