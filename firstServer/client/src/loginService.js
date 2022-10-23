import axios from "axios";

const url = "http://localhost:8000/users/";


class loginService {

  static async login(email, password) {
    return axios.post(url + "login", {
      email,
      password
    }, {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
      
    }).then (response => { 
      if (response.status == 200) {
        localStorage.setItem('user', response.data.name);
        localStorage.setItem('role', response.data.role);
       return response.data;
      }
      else {
        alert ("authorization error");
        return null
      }

      
    }).catch(error => console.log(error));
  }

  static async register(name, email, password){
    return axios.post(url+"register", {
      name, 
      email,
      password
    }, {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
      
    }).then (response => { 
      if (response.status == 200) {
       return response.data;
      }
      else {
        alert ("authorization error");
        return null
      }

      
    }).catch(error => console.log(error));
  }

  static async logout (){
    return axios.get(url+'logout',
    { withCredentials: true })
    .then (response => { 
      if (response.status == 200) {
       return response.data;
      }
      else {
        console.log(response)
        alert ("logout error");
        return null
      }      
    }).catch(error => console.log(error));
  }
  

}

export default loginService;
