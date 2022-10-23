<template>
<h1> Your oders</h1>
<div v-if="user">
  <div v-for="order in orders" :key="order.id" class="order">
  <h2> Order # {{order.id}}</h2>
    <div v-for="product in order.products" :key="product.id">
      <li>{{product.product.title}} - {{product.quantity}}</li>
    </div><hr />
  </div>
</div>
<div v-else><h2>Please login</h2></div>

</template>

<script>
import productsService from '../productsService.js'
import { watchEffect,  ref } from 'vue'

export default {
  name: 'HomePage',
 


async setup(){

  const user = ref(null)
  let orders = ref([])

  
   
  if (localStorage.getItem('user')){

    user.value = localStorage.getItem('user')
    loadOrders();    
  }

  function loadOrders() {
    const myOrders =  productsService.getMyOrders()

    watchEffect(()=>{
      if(myOrders.value){
        console.log('home res', myOrders.value.getMyOrders)
      orders.value = myOrders.value.getMyOrders
      }
  })
  }
    return {orders, user, loadOrders}
},
created () {
      this.emitter.on('login', () => {
      this.user = localStorage.getItem('user') 
      this.loadOrders()
    })
  }
}
</script>

<style>

.ordert {
  display:flex;
  text-align: left;
  margin: 10px 0 px;
  border-bottom: solid;
  overflow: auto;

}
h2, li {
  text-align: left;
}
</style>

