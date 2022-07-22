<template>
  <div class='login'>
  Please login
   <input type="text" name="email" placeholder="Username" required v-model="email"> 
   <input type="password" name="password" placeholder="Password" required v-model="password">
   <input type="submit" value="login" v-on:click="login">
   <hr />
   <router-link to="/register">register</router-link>
   </div>
</template>

<script>
import loginService from '../loginService.js';


export default {
  name: 'loginPage',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods:{ 
    
    login: async function () {
      const res = await loginService.login(this.email, this.password)
      if (res){
       // this.$emit('login')
        this.emitter.emit('login')
       
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
