<template>
<h1>cart</h1>

<div v-for="product in prodData" :key="product.id" class="product">
<div class="left"><img v-bind:src="getImgUrl(product.imagePath)" v-bind:alt="product.title" width="150"/></div>
<div><h3>{{ product.title }}</h3>
<p>{{ product.def }}<br />
<b>Ammount </b>
<input type="number" size="2" v-model="amountArr[product.id]"  class="amount"/> 
<input type="button" value="change"  class="add" @click="Change(product.id)" />
<input type="button" value="delete"  class="add" @click="Delete(product.id)" />
</p></div>
</div>
<input type="button" value="BUY"  class="buy" @click="Buy()" />

</template>

<script>
import productsService from '../productsService.js'
import { ref } from 'vue'

export default {
  name: 'cartPage',
 
  methods:{

  Change(id){
    if(!this.amountArr[id]){
      alert('please insert amount of items you want to buy');
    } else {    
      this.buyProducts[id] = this.amountArr[id]
      localStorage.setItem('cart', JSON.stringify(this.buyProducts));
    }},

  Delete(id){
    if(!this.amountArr[id]){
      alert('please insert amount of items you want to buy');
    } else {
      delete this.buyProducts[id]
      localStorage.setItem('cart', JSON.stringify(this.buyProducts));
      this.init()
      this.emitter.emit('addCart', this.buyProducts)
    }},

  async Buy(){
        
    if(this.buyProducts && Object.keys(this.buyProducts).length){
       let result = await productsService.buyP(JSON.stringify(this.buyProducts))
      
      if (result == 'no items'){
         alert ('not enogh items left')
         } 
      else {
        alert ('Your order is in progress. Thank you!')
        this.buyProducts = {};
        localStorage.removeItem('cart')
        this.emitter.emit('addCart', this.buyProducts)
        this.$router.push({ name: 'Home' })
      }     
   } 
   else {
            alert ('no items to buy!')
        }
  }
},

async setup(){

let products = {}
let buyProducts = {}
const prodData = ref (null)
const amountArr = ref([])
let cart = {};
products = await productsService.getAllProducts_REST();

function init() {     

  buyProducts = JSON.parse(localStorage.getItem('cart'));
  if (buyProducts){
        
    let bProdKeys = Object.keys(buyProducts)
    prodData.value = products.filter(prod =>{      
    if(bProdKeys.includes(prod.id.toString())){
      amountArr.value[prod.id] = buyProducts[prod.id]
      return true
      } 
    })
  }
}
init()

function getImgUrl(pic) {
    return require('../assets/'+pic)
}

return { getImgUrl, amountArr, cart, prodData, buyProducts, init}
}

}
</script>