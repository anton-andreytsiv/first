import axios from "axios";
import { gql } from 'graphql-tag'
import { useQuery, useMutation, provideApolloClient } from '@vue/apollo-composable';
import  apolloClient  from './main.js'
import { watchEffect } from 'vue'
import { useCookies } from "vue3-cookies";
import jwt_decode from "jwt-decode";


const url = "http://localhost:8000/products/";
const { cookies } = useCookies();
let token = cookies.get('token');
if (token){
   token =  jwt_decode(token);
}


class productsService {

  static  getAllProducts() {
    const getAllProd = gql`
    query  {
            getAllProducts {
              id
              title
              def
              quantity
              imagePath   
             }
    }
    `;
    const { result } = useQuery(getAllProd);  
    return result;
  }   

  static getMyOrders() {  
    provideApolloClient(apolloClient);
    console.log('servise get my ord') 
    const getMyOrders = gql`
    query Query($userId: Int) {
        getMyOrders(userId: $userId) {
          id
          products {
            product {
              title
            }
            quantity
          }
        }
      }
    `;
    const { result } = useQuery(getMyOrders, {userId: 1});  
    return result;
}

static async getAllProducts_REST() {

  return axios.get(url,{
    withCredentials: true
  }).then (response => { 
      
    if (response.status == 200) {      
     return response.data;
    }
    else {
      alert ("data fetch error");
      return null
    }    
  }).catch(error => console.log(error));
}
static async getMyOrders_REST() {
   return axios.get(url+'myOrders',{
      withCredentials: true
        }).then (response => {  
          if (response.status == 200) { 
            return response.data;
          }
          else {
            alert ("data fetch error");
            return null
          }
        }).catch(error => console.log(error));
  }

  static buyP(prod){
    provideApolloClient(apolloClient);
    if (!token){
     return false
      }
      else {
        console.log(token.id)
      }

    const { mutate: sendData } = useMutation(gql`
    mutation buyProducts ($data: String!, $user_id: Int, $email:String) {
      buyProducts (prod: $data, user_id: $user_id, email: $email) {
        id
      }
    } 
  `, {
    variables: {
      data: prod,
      user_id: token.id,
      email: token.email
    },
  })
  const result2 = sendData()
  watchEffect(() => {
    if(result2){
      console.log(result2);
    }
  })
  
  }
  


}

export default productsService;
