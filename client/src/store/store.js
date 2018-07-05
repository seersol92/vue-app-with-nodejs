import Vue from 'vue';
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);
axios.defaults.baseURL = `http://localhost:8081/`

export default new Vuex.Store({
    state: {
        token: localStorage.getItem('access_token') || null,
        user: localStorage.getItem('user') || null
    },

    getters: {
        loggedIn(state) {
            return state.token !== null
        },

        loggedInUser(state) {
            if (state.token)
                return JSON.parse(localStorage.getItem('user'))
            else
                return null
        },
        accessToken () {
           return localStorage.getItem('access_token') || null
        }
    },

    mutations: {
        
        retrieveToken(state, token) {
            state.token = token
        },

        retrieveUser(state, user) {
            state.user = user
        },

        destroyToken(state) {
            state.token = null
            state.user = null;
        }
    
    },

    actions: {

        retrieveProfile(context) {
            if (context.state.token && context.state.user) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${ context.state.token }`
            return new Promise((resolve, reject) => {
              axios.get('auth/profile')
                .then(response => {
                  resolve(response)
                })
                .catch(error => {
                  reject(error)
                })
            })
        }
      },

      retrieveUsers(context) {
        if (context.state.token && context.state.user) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${ context.state.token }`
        return new Promise((resolve, reject) => {
          axios.get('user-management')
            .then(response => {
              resolve(response)
            })
            .catch(error => {
              reject(error)
            })
            })
            }
        },

        retrieveToken(context, token) {
            context.state.token = token
            localStorage.setItem('access_token', token)
            context.commit('retrieveToken', token)
        },

        retrieveUser(context, user) {
            context.state.token = JSON.stringify(user)
            localStorage.setItem('user', JSON.stringify(user))
            context.commit('retrieveUser', user)
        },

        destroyToken(context) {
            if (context.getters.loggedIn) {
                localStorage.removeItem('access_token')
                localStorage.removeItem('user')
                context.commit('destroyToken')
            }
        }
    }
});