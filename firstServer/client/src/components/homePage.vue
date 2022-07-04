<template>
<h1> Your oders</h1>
<div v-for="order in orders" :key="order.id" class="order">
<h2> Order # {{order.id}}</h2>
  <div v-for="product in order.products" :key="product.id">
    <li>{{product.product.title}} - {{product.quantity}}</li>
  </div><hr />
</div>
{{order}}
</template>

<script>
import productsService from '../productsService.js'
//import { ref } from 'vue'

export default {
  name: 'HomePage',
 


async setup(){
    let orders = await productsService.getMyOrders()
    if(!orders[0].id)
    orders = []
    return {orders}
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

