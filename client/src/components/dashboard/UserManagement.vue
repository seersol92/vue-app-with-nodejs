<template>
  <v-layout>
    <v-flex xs12 sm10 offset-sm1>
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
</template>

<script>
export default {
  name: 'UserManagement',
      data () {
      return {
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
        desserts: []
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
        onDelete (index) {
            this.desserts.splice(index, 1);
        },

        onEdit (index) {
            alert(index)
            this.desserts[index].firstname = 'updated first name';
        }
    }
}
</script>

<style scoped>

</style>
