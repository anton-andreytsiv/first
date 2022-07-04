import axios from "axios";
//import vue from 'vue'
const url = "http://localhost:8000/users/";

export default {
  actions: {
    async login(ctx, user){
      if(user){
      return axios.post(url + "login", {
        email: user.email,
        password: user.password
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      }).then (response => { 
        if (response.status == 200) {
      
          ctx.commit('updateUser', response.data)
          this.$emit('login')
        }
        else {
          alert ("authorization error");
        }
  
        
      }).catch(error => console.log(error));
    }
  }
  },
  mutations: {
    updateUser(state, user) {
     
     state.user.name = user.name
     state.user.role =  user.role
    console.log(state.user)
    }
  },
  state: {
    user: {
      name: null,
      role: null
    }
  },
  getters: {
    getUser(state) {
      return state.user
    }
  }
}
