<template>
  <v-app id="app">
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>
          <router-link to="/" tag="span" style="cursor: pointer">CRUD APP</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn flat :to="{name:'register'}"  v-if="!loggedIn">Register</v-btn>
          <v-btn flat :to="{name:'login'}"  v-if="!loggedIn">Login</v-btn>
          <v-btn flat :to="{name:'user-management'}"  v-if="loggedIn">User Management</v-btn>
          <v-menu offset-y v-if="loggedIn">
            <v-btn flat slot="activator">
               {{ loggedInUser.username }}
              <v-icon>more_vert</v-icon>
            </v-btn>
            <v-list >
              <v-list-tile router :to="{name:'profile'}">
                <v-list-tile-title>Profile</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="logout">
                <v-list-tile-title>Logout</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <v-layout >
          <router-view></router-view>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer  color="indigo" >
      <span class="white--text">&copy; </span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
  data: () => ({
    userName: null
  }),

  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    loggedInUser () {
      return  this.$store.getters.loggedInUser
    },

    getProfile() {
    }
  },

  created() {
      if (this.$store.getters.loggedIn)  {
         this.$store.dispatch('retrieveProfile')
        .then(response => {
          this.userName = response.data.user.username
          this.$store.dispatch('retrieveUser', {
            username: response.data.user.username,
            email: response.data.user.email
          })
        })
        .catch(error =>{
          this.$toasted.global.my_app_error(error.response.data.message);
          this.$store.dispatch('destroyToken')
          this.$router.push({
            name: 'login'
          })
        })
      }
  },

  methods: {
    logout () {
      this.$store.dispatch('destroyToken')
      this.$router.push({
        name: 'home'
      })
    }
  }
}
</script>
<style>
 .toasted-container.top-right {
   top: 7% !important;
   right: 2% !important;
   text-align: left
 }
</style>
