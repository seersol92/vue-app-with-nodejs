<template>
<v-container fluid grid-list-xl>
    <v-layout row>
      <v-flex xs2>
        <v-dialog v-model="dialog" persistent max-width="700px">
            <v-btn slot="activator"  outline round  color="indigo" >Add New User</v-btn>
            <v-card>
                <v-card-title>
                <span class="headline">Register New User</span>
                </v-card-title>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                        <v-flex xs12 sm6 md4>
                            <v-text-field v-model="firstName" :rules="firstNameRules" :counter="10" label="First name" required></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md4>
                            <v-text-field v-model="lastName" :rules="lastNameRules" :counter="10" label="Last name" required></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md4>
                            <v-text-field v-model="userName" :rules="userNameRules" :counter="10" label="User name" required
                            v-bind:class="{ 'error--text': isUserExist }"
                            ></v-text-field>
                            <span class="async-error" v-if='isUserExist'>
                            This user Name is already in use!!
                            </span>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field v-model="email" :rules="emailRules" label="E-mail" required 
                            v-bind:class="{ 'error--text': isEmailExist }"
                            ></v-text-field>
                            <span class="async-error" v-if='isEmailExist'>
                            This E-mail is already in use!!
                            </span>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field label="Password"
                            :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                            :type="showPassword ? 'text' : 'password'" 
                            v-model="password" :rules="passwordRules"
                            @click:append="showPassword = !showPassword"
                            required >
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field label="Confirm password"
                            :append-icon="showConfirmPassword ? 'visibility_off' : 'visibility'"
                            :type="showConfirmPassword ? 'text' : 'password'" 
                            v-model="confirmPassword" :rules="[comparePasswords]"
                            @click:append="showConfirmPassword = !showConfirmPassword"
                            required >
                            </v-text-field>
                        </v-flex>
                        </v-layout>
                    </v-container>
                    </v-card-text>
                </v-form>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" flat @click.native="clsoe">Close</v-btn>
                <v-btn color="blue darken-1" flat @click.native="submit"
                :disabled="!valid || ( isEmailExist || isUserExist )"
                >Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>
    <v-layout row justify-center>
      <v-flex xs12>
           <v-card>
                <v-card-title primary-title>
                    <h3 class="headline mb-0">User Management</h3>
                </v-card-title>
                <v-data-table
                    :headers="headers"
                    :items="desserts"
                    hide-actions
                    class="elevation-1"
                    >
                    <template slot="items" slot-scope="props">
                        <td>{{ props.index+1 }}</td>
                        <td class="text-xs-left">{{ props.item.firstname }}</td>
                        <td class="text-xs-left">{{ props.item.lastname }}</td>
                        <td class="text-xs-left">{{ props.item.username }}</td>
                        <td class="text-xs-left">{{ props.item.email }}</td>
                        <td class="text-xs-center">
                            <v-tooltip bottom>
                                <v-btn flat icon color="blue lighten-1" slot="activator" @click="onEdit(props.index)">
                                    <v-icon>edit</v-icon>
                                </v-btn>
                                <span>Edit?</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <v-btn flat icon color="red darken-2" slot="activator" @click="onDelete(props.index)">
                                    <v-icon>delete_forever</v-icon>
                                </v-btn>
                                <span>Delete?</span>
                            </v-tooltip>
                        </td>
                    </template>
                </v-data-table>
            </v-card> 
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import AuthenticationService from '@/services/AuthenticationService'
import Toaster from '@/services/Toaster'
export default {
  name: 'UserManagement',
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
    data () {
      return {
        dialog: false,
        headers: [
          {
            text: '#',
            align: 'left',
            sortable: false,
            value: 'id'
          },
          { text: 'First Name', value: 'firstname', sortable: true  },
          { text: 'Last Name', value: 'lasttname', sortable: true },
          { text: 'User Name', value: 'username' , sortable: true},
          { text: 'E-mail', value: 'email', sortable: true },
          { text: 'Action', value: 'action', sortable: false, align: 'center' }
        ],
        desserts: [],

        showPassword: false,
        showConfirmPassword: false,
        isEmailExist: false,
        isUserExist: false,
        isEditUser: false,
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
        ]
      }
    },

    created() {

        if (this.$store.getters.loggedIn)  {
         this.$store.dispatch('retrieveUsers')
        .then(response => {
          this.desserts = response.data.data
        })
        .catch(error =>{
        })
      }
    },
    
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
                this.clsoe();
                Toaster.success(response.data.message);
                })
                .catch(error => {
                this.$toasted.global.my_app_error(error.response.data.error);
            })
        }
        },

        onDelete (index) {
            this.desserts.splice(index, 1);
        },

        onEdit (index) {
            this.dialog = true
            this.firstName  = this.desserts[index].firstname
            this.lastName  = this.desserts[index].lastname
            this.userName  = this.desserts[index].username
            this.email  = this.desserts[index].email
        },

        clsoe() {
            this.dialog = false;
            this.$refs.form.reset()
      }
    }
}
</script>

<style scoped>
.async-error {
  margin-top: -13px;
  position: fixed;
  color: rgb(255, 82, 82);
  font-size: 11px;
}
</style>
