<template>
<div class="top">
    <div class="logo"><img alt="greenton logo" src="./assets/logo_greenton.jpg" style="height:50px;"></div>
    <div v-if="!user"><loginPage /></div>
    <div v-else> Hello {{ user }}
    <button @click="logOut">logout</button>
    <router-link to="/cart">cart({{cartAmount}})</router-link>
    </div>
</div>
    <div class="nav">
      <router-link to="/">HOME</router-link> | 
      <router-link to="/about">ABOUT</router-link> | 
      <router-link to="/products">PRODUCTS</router-link>
    </div>
<Suspense>
  <router-view />
  </Suspense>
</template>

<script>
import loginPage from './components/loginPage.vue'
import { ref } from 'vue'
import { useCookies } from "vue3-cookies";
import loginService from './loginService.js';

export default {
  name: 'App',

  setup(){
    const { cookies } = useCookies();
    const user = ref (null)
    const cartAmount = ref (0)
    const savedCart = JSON.parse(localStorage.getItem('cart'));
     if (savedCart){
      cartAmount.value = Object.keys(savedCart).length
     }

    if (localStorage.getItem('user')){
      user.value = localStorage.getItem('user')
    }
    
    async function logOut () {
      const res = await loginService.logout()
      if (res){ 
      user.value = null
      //this.cookies.remove("token");
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      localStorage.removeItem('cart')
      } else {
        console.log(res)
      }

    }


    return {user, logOut, cartAmount, cookies}
  },
  created () {
      this.emitter.on('addCart', cart => {
      this.cartAmount = Object.keys(cart).length
      
    })

    this.emitter.on('login', () => {
      this.user = localStorage.getItem('user')    
    })
  },

  components: {
    loginPage
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.logo{
  flex:1;
  text-align: left;
  padding: 10px;
  
}
.nav{
  display: block;
  padding: 10px;
  background-color:  #ccc;
  }
.top{
  display:flex;
  padding:10px;
}
html {
  height: 100%;
}
body{
  height: 100%;
  margin: 10px 50px;
}
</style>
