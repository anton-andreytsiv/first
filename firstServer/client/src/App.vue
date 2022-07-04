<template>
<div class="top">
    <div class="logo"><img alt="greenton logo" src="./assets/logo_greenton.jpg" style="height:50px;"></div>
    <div v-if="!user"><loginPage @login = "userLogin"/></div>
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

export default {
  name: 'App',
  data(){
    return {
      user_role: null,
      loginu: false
    }
  },
  setup(){
    const user = ref (null)
    const cartAmount = ref (0)
    const cart2 = JSON.parse(localStorage.getItem('cart'));
     if (cart2){
      cartAmount.value = Object.keys(cart2).length
     }

    if (localStorage.getItem('user')){
      user.value = localStorage.getItem('user')
    }
    const userLogin = () => {
      user.value = localStorage.getItem('user')
    }

    const logOut = () => {
      user.value = null
      localStorage.removeItem('user')
      localStorage.removeItem('role')
    }


    return {user, userLogin, logOut, cartAmount}
  },
  created () {
      this.emitter.on('addCart', cart => {
      this.cartAmount = Object.keys(cart).length
      
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
