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
        product: Products
        quantity: Int
        idOrder: Orders
  
}
input productArr {
        count: Int
}
input userId{
  id: ID
}
    type Query {
        getAllProducts: [Products]    
        getOrders(userId: Int): [Orders]
        getMyOrders(userId: Int): [Orders]
        }
    type Mutation {
      buyProducts (prod: String!, user_id: Int, email: String): Orders
    }
 `;

 module.exports = typeDefs;