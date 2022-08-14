import { gql } from "apollo-server-express"

 const typeDefs = gql `

type UserModel {
  id: ID!
  email: String!
  password: String
  name: String
  roleId: Role
  orders: [Orders]
}
type Role {
  id: ID!
  name: String
  user: [UserModel] 
}
type Products{
        id: ID!
        title: String
        def: String
        quantity: Int
        imagePath: String
        orders: [ProductsInOrder]
    }
type Orders{
        id: ID!
        done: Boolean
        userId: UserModel
        products: [ProductsInOrder]
  
    }

type ProductsInOrder{
        id:ID!
        idProduct: Products
        quantity: Int
        idOrder: Orders
  
}
    type Query {
        getAllProducts: [Products]    
        getOrders(userId: Int): [Orders]
        }
 `;

 module.exports = typeDefs;