import axios from 'axios'

axios.defaults.baseURL = `http://localhost:8081/`
axios.defaults.headers.common['Authorization'] = `Bearer ${  }`

export default {
  get (url) {
    return axios.get(url)
  },

  post (url, data) {
    return axios.post(url, data)
  }
}

