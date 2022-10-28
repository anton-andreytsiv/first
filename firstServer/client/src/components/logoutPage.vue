<template>
<div> Hello {{ user }}
    <button @click="logOut">logout</button>
    <router-link to="/cart">cart({{cartAmount}})</router-link>
</div>
</template>

<script>
import { ref } from 'vue'
import loginService from '../loginService.js';

export default {
  name: 'logoutPage',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  setup(){
    const user = ref (null)
    const cartAmount = ref (0)
    const savedCart = JSON.parse(localStorage.getItem('cart'));
     if (savedCart){
      cartAmount.value = Object.keys(savedCart).length
     }

    if (localStorage.getItem('user')){
      user.value = localStorage.getItem('user')
    }
    return {user, cartAmount}
  },
  methods:{ 
    
    logOut: async function () {
      const res = await loginService.logout()
      if (res){
        this.emitter.emit('logout')
        this.$router.push({ name: 'about' })
      }
    }
  } 

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  flex:1;
  float: right;
  min-height: 50 px;
}
</style>
