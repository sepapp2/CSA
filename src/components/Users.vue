<template>
  <div class="users">
    <b-container fluid>
      <!-- User Interface controls -->
      <b-row>
        <b-col md="6" offset-md="3">
          <b-table striped
                   hover
                   :items="users"
                   :fields="fields"
                   :current-page="currentPage"
                   :per-page="perPage"
          >
          <template slot="admin" v-if="userProfile.admin" slot-scope="item">
            <b-form-select v-model="item.item.admin" :options="adminOptions" class="mb-3 select-table-row" @change="changeRole(item.item)"/>
          </template>
          <template slot="actions" slot-scope="item" v-if="userProfile.admin">
            <b-button size="sm" variant="default" class="mr-1" @click="editUser(item.item)" v-b-modal.editUser>
              Edit User
            </b-button>
          </template>
          </b-table>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6" offset-md="3" class="my-1">
            <b-pagination :total-rows="users.length" :per-page="perPage" v-model="currentPage" class="my-0" />
        </b-col>
      </b-row>
      <b-form>
            <b-modal  id="editUser"
              size="lg"
              ref="editUser"
              title="Edit User Profile"
              v-if="userProfile.admin"
              @ok="onSubmit"
              @cancel="onReset"
              ok-title="Submit">
          <b-row align-h="center" class="text-center">
            <b-col sm="12" md="5">
              <input class="form-control" type="text" required v-model="userInfo.firstName" placeholder="First Name">
            </b-col>
            <b-col sm="12" md="2">
              <input class="form-control" type="text" v-model="userInfo.middleName" placeholder="Middle Initial">
            </b-col>
            <b-col sm="12" md="5">
              <input class="form-control" type="text" required v-model="userInfo.lastName" placeholder="Last Name">
            </b-col>
          </b-row>
          <b-row class="text-center">
            <b-col sm="12" md="6">
              <input class="form-control" type="text" required v-model="userInfo.address" placeholder="Address Line 1">
            </b-col>
          </b-row>
          <b-row align-h="center" class="text-center">
            <b-col sm="12" md="6">
              <input class="form-control" type="text" required v-model="userInfo.address2" placeholder="Address Line 2">
            </b-col>
            <b-col sm="12" md="6">
              <input class="form-control" type="tel" pattern="^\d{3}-\d{3}-\d{4}$" required v-model="userInfo.phone" placeholder="Phone Number format 'xxx-xxx-xxxx'">
            </b-col>
          </b-row>
          <b-row align-h="center" class="text-center">
            <b-col sm="12" md="5">
              <input class="form-control" type="text" required v-model="userInfo.city" placeholder="City">
            </b-col>
            <b-col sm="12" md="3">
              <div>
                <b-form-select v-model="userInfo.state" :options="states" class="mb-3" />
              </div>
            </b-col>
            <b-col sm="12" md="4">
              <input class="form-control" type="text" required v-model="userInfo.zip" pattern="[0-9]{5}" placeholder="Zip">
            </b-col>
          </b-row>
          </b-modal>
        </b-form>
    </b-container>
  </div>
</template>

<script>
import { db } from '../main'
import firebase from 'firebase'

export default {
  name: 'Users',
  computed: {
    userProfile () {
      return this.$store.getters.getUserProfile
    }
  },
  data () {
    return {
      adminOptions: [
        { value: true, text: 'Admin' },
        { value: false, text: 'User' }
      ],
      currentPage: 1,
      perPage: 10,
      pageOptions: [ 5, 10, 15 ],
      fields: {
        displayName: {
          label: 'User Name',
          sortable: true
        },
        email: {
          label: 'Email Address',
          sortable: true
        },
        admin: {
          label: 'Role',
          sortable: true
        },
        actions: {
          label: 'Actions',
          sortable: false
        }
      },
      users: [],
      states: [],
      userInfo: []
    }
  },
  firestore () {
    return {
      users: db.collection('metadata'),
      states: db.collection('States').orderBy('id')
    }
  },
  methods: {
    editUser (user) {
      var docRef = db.collection('metadata').doc(user.id)
      docRef.get().then(doc => {
        this.userInfo = doc.data()
      }).catch(function (error) {
        console.log('Error getting document: ', error)
      })
    },
    onSubmit (evt) {
      var userDocRef = db.collection('metadata').doc(this.userInfo.uid)
      this.userInfo.displayName = this.userInfo.firstName.trim() + ' ' + this.userInfo.lastName.trim()
      return db.runTransaction(transaction => {
        // This code may get re-run multiple times if there are conflicts.
        return transaction.get(userDocRef).then(userDoc => {
          if (!userDoc.exists) {
            throw new Error('Document does not exist!')
          }
          transaction.update(userDocRef, this.userInfo)
        })
      }).then(function () {
        this.userInfo = []
        console.log('Transaction successfully committed!')
      }).catch(function (error) {
        console.log('Transaction failed: ', error)
      })
    },
    onReset () {
      this.userInfo = []
    },
    changeRole (user) {
      if (user.id === firebase.auth().currentUser.uid) {
        alert('You cannot alter your own role')
      } else {
        var userDocRef = db.collection('metadata').doc(user.id)
        return db.runTransaction(function (transaction) {
          // This code may get re-run multiple times if there are conflicts.
          return transaction.get(userDocRef).then(function (userDoc) {
            if (!userDoc.exists) {
              throw new Error('Document does not exist!')
            }
            transaction.update(userDocRef, {
              admin: user.admin
            })
          })
        }).then(function () {
          console.log('Transaction successfully committed!')
        }).catch(function (error) {
          console.log('Transaction failed: ', error)
        })
      }
    }
  }
}
</script>

<style scoped>
input {
  margin: 10px 0;
  padding: 15px;
}
.form-control {
  border-radius: 0px;
}
span{
  display: block;
  margin-top: 20px;
  font-size: 11px;
}
.mb-3 {
  height: 2.45rem!important;
  margin-bottom: 0px!important;
  margin-top: 10px;
}
.select-table-row {
  height: inherit!important;
  margin-bottom: 0px!important;
  margin-top: 0px;
}
.inline-checkbox {
  padding-top: 5px;
}
</style>
