<template>
  <v-flex xs12 sm6 offset-sm3>
    <v-card>
      <v-card-title primary-title>
  
        <h3 class="headline mb-0">Login</h3>
  
        <v-spacer></v-spacer>
  
      </v-card-title>
  
      <v-layout row>
  
        <v-flex xs12 sm8 offset-sm2>
  
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field v-model="email" :rules="emailRules" label="Username or E-mail" required></v-text-field>

            <v-text-field label="Password"
              :append-icon="showPassword ? 'visibility_off' : 'visibility'"
              :type="showPassword ? 'text' : 'password'" 
              v-model="password" :rules="passwordRules"
              @click:append="showPassword = !showPassword"
              required >
            </v-text-field>
          </v-form>
  
        </v-flex>
  
      </v-layout>
      <v-layout row>
        <v-flex xs12 sm8 offset-sm2 >
          <v-card-actions style="float: right;">
              <v-btn :disabled="!valid" @click="submit" color="success">  
                <v-icon dark left>input</v-icon>
                Login  
              </v-btn>
          </v-card-actions>
        </v-flex>
      </v-layout>
    </v-card>
  
  </v-flex>
</template>

<script>
  import AuthenticationService from '@/services/AuthenticationService'
  import Toaster from '@/services/Toaster'
  export default {  
    data: () => ({
      showPassword: false,
      valid: true,

      email: '',
      emailRules: [
        v => !!v || 'Username or E-mail is required'
      ],

      password: '', 
      passwordRules: [
        v => !!v || 'Password is required'
      ]
    }),
  
    methods: {
     async submit() {
          if (this.$refs.form.validate()) {
          await AuthenticationService.login({               
                  user:      this.email,
                  password:   this.password
            }).then(response => { 
                this.clear();
                this.$store.dispatch('retrieveToken', response.data.token)
                this.$store.dispatch('retrieveUser', response.data.data)
                Toaster.success(response.data.message);
                setTimeout(() => {
                  this.$router.push({
                      name: 'profile'
                  })
                }, 1000)
              })
              .catch(error => {
              this.$toasted.global.my_app_error(error.response.data.message);
          })
        }
    },
    clear() {
        this.$refs.form.reset()
      }
    }
  }
</script>

<style scoped>
.alert {
  padding: 10px;
  color: #FFFFFF;
}
</style>
