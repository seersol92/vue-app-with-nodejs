import axios from 'axios'

axios.defaults.baseURL = `http://localhost:8081/`
export default {
  register (credentials) {
    return axios.post('auth/register', credentials)
  },

  login (credentials) {
    return axios.post('auth/login', credentials)
  },

  get (url) {
    return axios.get('auth/' + url)
  }
}