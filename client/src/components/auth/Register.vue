<template>
  <v-flex xs12 sm6 offset-sm3>
    <v-card>
      <v-card-title primary-title>
  
        <h3 class="headline mb-0">Register</h3>
  
        <v-spacer></v-spacer>
  
      </v-card-title>
  
      <v-layout row>
  
        <v-flex xs12 sm8 offset-sm2>
  
          <v-form ref="form" v-model="valid" lazy-validation>
  
            <v-text-field v-model="firstName" :rules="firstNameRules" :counter="10" label="First name" required></v-text-field>
            
            <v-text-field v-model="lastName" :rules="lastNameRules" :counter="10" label="Last name" required></v-text-field>
            
            <v-text-field v-model="userName" :rules="userNameRules" :counter="10" label="User name" required
            v-bind:class="{ 'error--text': isUserExist }"
            ></v-text-field>
             <span class="async-error" v-if='isUserExist'>
              This user Name is already in use!!
            </span>
  
            <v-text-field v-model="email" :rules="emailRules" label="E-mail" required 
            v-bind:class="{ 'error--text': isEmailExist }"
            ></v-text-field>
            <span class="async-error" v-if='isEmailExist'>
              This E-mail is already in use!!
            </span>
            <v-text-field label="Password"
              :append-icon="showPassword ? 'visibility_off' : 'visibility'"
              :type="showPassword ? 'text' : 'password'" 
              v-model="password" :rules="passwordRules"
              @click:append="showPassword = !showPassword"
              required >
            </v-text-field>

            <v-text-field label="Confirm password"
              :append-icon="showConfirmPassword ? 'visibility_off' : 'visibility'"
              :type="showConfirmPassword ? 'text' : 'password'" 
              v-model="confirmPassword" :rules="[comparePasswords]"
              @click:append="showConfirmPassword = !showConfirmPassword"
              required >
            </v-text-field>
            <v-checkbox v-model="checkbox" :rules="[v => !!v || 'You must agree to continue!']" label="Do you agree?" required></v-checkbox>

          </v-form>
  
        </v-flex>
  
      </v-layout>
      <v-layout row>
        <v-flex xs12 sm8 offset-sm2 >
          <v-card-actions style="float: right;">
              <v-btn @click="clear">clear</v-btn>
              <v-btn 
                :disabled="!valid || ( isEmailExist || isUserExist )" 
                @click="submit"  
                color="success"> 
                <v-icon dark left>done_all</v-icon>Register 
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
  
    name: 'Register',
    computed: {
      comparePasswords () {
        return this.password !== this.confirmPassword ? 'Passwords do not match' : true
      }
    },

    watch: {
      async  userName (val) {
          if (/^([a-zA-Z0-9_-]){3,20}$/.test(val)) {  // hit only when there is valid email
           await AuthenticationService.get('check-user-name/' + val).then(response => {
              this.isUserExist = response.data.success;
             if (response.data.success) {
               this.$toasted.global.my_app_error('This User-Name is already in use!!');
             }
          }) .catch(error => {
            this.$toasted.global.my_app_error();
          })          }
      },

      async  email (val) {
        if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val)) {  // hit only when there is valid email
          await AuthenticationService.get('check-email/' + val).then(response => {
            this.isEmailExist = response.data.success;
            if (response.data.success) {
              this.$toasted.global.my_app_error('This E-mail is already in use!!');
            }
          }) .catch(error => {
            this.$toasted.global.my_app_error();
          })
        } else {
          this.isEmailExist = false
        }
      },
    },

    data: () => ({
      showPassword: false,
      showConfirmPassword: false,
      isEmailExist: false,
      isUserExist: false,
      valid: true,

      firstName: '',
      firstNameRules: [
        v => !!v || 'First Name is required',
        v => (v && v.length <= 10) || 'First Name must be less than 10 characters'
      ],

      lastName: '',
      lastNameRules: [
        v => !!v || 'Last Name is required',
        v => (v && v.length <= 10) || 'Last Name must be less than 10 characters'
      ],

      userName: '',
      userNameRules: [
        v => !!v || 'User Name is required',
        v => (v && v.length <= 10) || 'User Name must be less than 10 characters'
      ],
  
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],

      password: '', 
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 8)  || 'Password must be atlest 8 characters',
        v => (v && v.length <= 20) || 'Password must be less than 20 characters'
      ],

      confirmPassword: '', 
      confirmPasswordRules: [
        v => !!v || 'Confirm password is required'
      ],

      select: null,
      checkbox: false
    }),
  
    methods: {
     async submit() {
        if (this.$refs.form.validate() && (!this.isEmailExist && !this.isUserExist)) {
        await AuthenticationService.register({
                firstName:  this.firstName,
                lastName:   this.lastName,
                userName:   this.userName,
                email:      this.email,
                password:   this.password
          }).then(response => { 
              this.clear();
              Toaster.success(response.data.message);
            })
            .catch(error => {
              this.$toasted.global.my_app_error(error.response.data.error);
        })
      }
    },
    clear() {
        this.$refs.form.reset()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.async-error {
  margin-top: -13px;
  position: fixed;
  color: rgb(255, 82, 82);
  font-size: 11px;
}
</style>
