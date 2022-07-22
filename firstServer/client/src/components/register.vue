<template>
  <div >
  <h2>Please enter your data for registration</h2>
   <input type="text" name="name" placeholder="Name" required v-model="name"> 
   <input type="text" name="email" placeholder="email" required v-model="email"> 
   <input type="password" name="password" placeholder="Password" required v-model="password">
   <input type="password" name="password2" placeholder="repeat password" required v-model="password2">

   <input type="submit" value="register" v-on:click="register">
   </div>
</template>

<script>
import loginService from '../loginService.js';


export default {
  name: 'regiterPage',
  data() {
    return {
        name: '',
        email: '',
        password: '',
        password2: ''
    }
  },
  methods:{ 
    
    register: async function () {
        if (this.password !== this.password2 || this.password.length < 5)
        {
            alert('password must be not less then 5 symbols, or you typed different passwords');
            return false;
        }else {
            const res = await loginService.register(this.name, this.email, this.password)
      if (res){
          alert('success!')
        this.$router.push({path:'/products'})
       
       
      }
        }
      
    }
  } 

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input {
    display:block;
    width: 150px;
    float:none;
    margin: 10px 10px;
}
</style>
