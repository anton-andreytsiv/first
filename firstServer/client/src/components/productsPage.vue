<template>
<div> 
<h1> Products page</h1>
<div v-if="user">
  <div v-if="products">
    <div v-for="product in products" :key="product.id" class="product">
    <div class="left"><img v-bind:src="getImgUrl(product.imagePath)" v-bind:alt="product.title" width="150"/></div>
    <div><h3>{{ product.title }}</h3>
      <p>{{ product.def }}<br />
      <b>Buy this item </b>
      <input type="number" size="2" v-model="amountArr[product.id]" v-bind:ref="'amount_' + product.id" class="amount"/> 
      ({{product.quantity}})
      <input type="button" value="add to cart"  v-bind:ref="'add_' + product.id" class="add" @click="addToCart(product.id)" />
      </p></div>
    </div><hr />
  </div>
  <div v-else><h1>Loading data...</h1></div>
</div>
<div v-else>
<h2>Please login</h2>

</div>
</div>
</template>
<script>
/* eslint-disable0 */
import productsService from '../productsService.js'
import { ref, watchEffect } from 'vue'

export default {
  name: 'productsPage',

  methods:{
    
  addToCart(id){
    if(!this.amountArr[id]){
      alert('please insert amount of items you want to buy');
    }   else{    
      this.cart[id] = this.amountArr[id]
      this.emitter.emit('addCart', this.cart)
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }}
  },

async setup(){

  const user = ref(null)
  let products = ref(null)
  const amountArr = ref([])
  let cart = {}
  let cartSave = JSON.parse(localStorage.getItem('cart'))
  if (cartSave){
    cart = cartSave
  }

  if (localStorage.getItem('user')){
        user.value = localStorage.getItem('user')
      }

  const allProducts = productsService.getAllProducts();
  watchEffect(()=>{
   if(allProducts.value){
    console.log ('pres', allProducts.value.getAllProducts)
        products.value = allProducts.value.getAllProducts
        for (let i=0; i< allProducts.value.getAllProducts.length; i++){
        amountArr.value[allProducts.value.getAllProducts[i].id] = 0;
        }
   }
  })

  function getImgUrl(pic) {
      return require('../assets/'+pic)
  }

  return { getImgUrl, amountArr, cart, user, products}
},

  created () {
      this.emitter.on('login', () => {
      this.user = localStorage.getItem('user')     
    })
  }


}
</script>

<style scoped>


.product {
  display:flex;
  text-align: left;
  clear: both;
  margin: 10px 0 px;
  border-bottom: solid;
  overflow: auto;

}
.left {
  flex:1;
  text-align: left;
  padding: 10px;
  width: 150px;
}
.amount{
  width: 30px;
  margin-left: 5px;
}
.add{

  margin-left: 5px;
}

</style>
