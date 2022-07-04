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

}

export default loginService;
