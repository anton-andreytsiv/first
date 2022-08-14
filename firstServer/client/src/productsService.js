import axios from "axios";
import { gql } from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable';
//import { computed } from 'vue';

const url = "http://localhost:8000/products/";


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

  static async getAll() {
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
  static async getMyOrders() {
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

  static async buyProducts(prod) {
    return axios.post(url+'buy',prod,{
      withCredentials: true
    }).then (response => { 
        
      if (response.status == 200) {
        
       return response.data;
      }
      else if(response.status == 455) {
        return 'no items'
      }
      else {
        alert ("error of buying products");
        return null
      }

      
    }).catch(error => console.log(error));
  }


}

export default productsService;
