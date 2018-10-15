<template>
    <div class="sign-up">
      <b-container fluid>
        <b-row align-h="center" class="text-center">
          <b-col cols="12" sm="12" md="8">
            <h3>Edit Profile</h3>
          </b-col>
        </b-row>
        <b-form @submit="updateProfile">
          <b-row align-h="center" class="text-center">
            <b-col sm="12" md="3">
              <input class="form-control" type="text" required v-model="userInfo.firstName" placeholder="First Name">
            </b-col>
            <b-col sm="12" md="2">
              <input class="form-control" type="text" v-model="userInfo.middleName" placeholder="Middle Initial">
            </b-col>
            <b-col sm="12" md="3">
              <input class="form-control" type="text" required v-model="userInfo.lastName" placeholder="Last Name">
            </b-col>
          </b-row>
          <b-row class="text-center">
            <b-col sm="12" md="5" offset-md="2">
              <input class="form-control" type="text" required v-model="userInfo.address" placeholder="Address Line 1">
            </b-col>
          </b-row>
          <b-row align-h="center" class="text-center">
            <b-col sm="12" md="5">
              <input class="form-control" type="text" required v-model="userInfo.address2" placeholder="Address Line 2">
            </b-col>
            <b-col sm="12" md="3">
              <input class="form-control" type="tel" pattern="^\d{3}-\d{3}-\d{4}$" required v-model="userInfo.phone" placeholder="Phone Number format 'xxx-xxx-xxxx'">
            </b-col>
          </b-row>
          <b-row align-h="center" class="text-center">
            <b-col sm="12" md="3">
              <input class="form-control" type="text" required v-model="userInfo.city" placeholder="City">
            </b-col>
            <b-col sm="12" md="2">
              <div>
                <b-form-select v-model="userInfo.state" :options="states" class="mb-3" size="lg" />
              </div>
            </b-col>
            <b-col sm="12" md="3">
              <input class="form-control" type="text" required v-model="userInfo.zip" pattern="[0-9]{5}" placeholder="Zip">
            </b-col>
          </b-row>
          <b-row align-h="center" class="text-center">
            <b-col cols="12" sm="12" md="8">
              <input class="form-control" type="email" required v-model="userInfo.email" placeholder="Email">
            </b-col>
          </b-row>
          <b-row align-h="center" class="text-center">
            <b-col cols="12" sm="12" md="8">
              <button type="submit" v-on:click="updateProfile">Update Profile</button>
            </b-col>
          </b-row>
          <b-row align-h="center" class="text-center">
            <b-col cols="12" sm="12" md="8">
              <button v-b-modal.modalPasswordUpdate class="password-button">Update Password</button>
            </b-col>
          </b-row>
        </b-form>
    <b-modal id="modalPassword"
             ref="modalPassword"
             title="Enter your password"
             @ok="handleOk"
             @shown="clearPassword">
      <form @submit.stop.prevent="handleSubmit">
        <b-form-input type="password"
                      placeholder="Current Password"
                      v-model="userProvidedPassword">
        </b-form-input>
      </form>
    </b-modal>
        <b-modal id="modalPasswordUpdate"
             ref="modalPasswordUpdate"
             title="Change your password"
             @ok="handleChange"
             @shown="clearPasswordUpdate">
      <form @submit.stop.prevent="handlePasswordUpdate">
        <b-form-input type="password"
                      placeholder="Enter your current password"
                      v-model="userProvidedPassword">
        </b-form-input>
        <b-form-input type="password"
                      placeholder="New Password"
                      v-model="userProvidedUpdatePassword"
                      :state="passwordState">
        </b-form-input>
        <b-form-input type="password"
                      placeholder="Verify New Password"
                      v-model="userProvidedUpdateVerifyPassword"
                      :state="passwordState"
                      aria-describedby="inputLiveFeedback">
        </b-form-input>
      <b-form-invalid-feedback id="inputLiveFeedback">
      <!-- This will only be shown if the preceeding input has an invalid state -->
      New Passwords must match
      </b-form-invalid-feedback>
      </form>
    </b-modal>
      </b-container>
    </div>
</template>

<script>
import { db } from '../main'
import firebase from 'firebase'

export default {
  name: 'profile',
  firestore () {
    return {
      // institutions: db.collection('Institutions').orderBy('id'),
      // states: db.collection('States').orderBy('id'),
      // departmentOptions: db.collection('Departments').orderBy('id'),
      userInfo: db.collection('metadata').doc(firebase.auth().currentUser.uid)
    }
  },
  data () {
    return {
      states: [],
      adminOptions: [
        { value: true, text: 'Admin' },
        { value: false, text: 'User' }
      ],
      userInfo: [],
      displayName: '',
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      address2: '',
      city: '',
      state: null,
      zip: '',
      admin: '',
      userProvidedPassword: '',
      userProvidedUpdatePassword: '',
      userProvidedUpdateVerifyPassword: ''
    }
  },
  computed: {
    passwordState () {
      return this.userProvidedUpdatePassword === this.userProvidedUpdateVerifyPassword ? true : false
    }
  },
  methods: {
    clearPassword () {
      this.userProvidedPassword = ''
    },
    clearPasswordUpdate () {
    //   this.userProvidedPassword = ''
    //   this.userProvidedUpdatePassword = ''
    //   this.userProvidedUpdateVerifyPassword = ''
    },
    handleOk (evt) {
      // Prevent modal from closing
      evt.preventDefault()
      if (!this.userProvidedPassword) {
        alert('Please enter your Password')
      } else {
        this.handleSubmit()
      }
    },
    handleChange (evt) {
      // Prevent modal from closing
      evt.preventDefault()
      if (!this.userProvidedPassword || !this.userProvidedUpdatePassword || !this.userProvidedUpdateVerifyPassword) {
        alert('You must fill out all fields to update your password')
      } else {
        this.handlePasswordUpdate()
      }
    },
    handlePasswordUpdate: function () {
      var user = firebase.auth().currentUser
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        this.userProvidedPassword
      )
      const passwordData = this.userProvidedUpdatePassword
      user.reauthenticateAndRetrieveDataWithCredential(credential).then(function () {
        user.updatePassword(passwordData).then(function () {
          alert('Password successfully updated')
        }).catch(function (error) {
          alert(error.message)
        })
      }).catch(function (error) {
        alert(error.message)
      })
      this.userProvidedPassword = ''
      this.userProvidedUpdatePassword = ''
      this.userProvidedUpdateVerifyPassword = ''
      this.$refs.modalPasswordUpdate.hide()
    },
    handleSubmit: function () {
      var user = firebase.auth().currentUser
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        this.userProvidedPassword
      )
      user.reauthenticateAndRetrieveDataWithCredential(credential).then(function () {
        console.log('success')
      }).catch(function (error) {
        console.log(error)
      })
      this.userProvidedPassword = ''
      this.$refs.modalPassword.hide()
    },
    updateProfile: function (evt) {
      evt.preventDefault()
      var user = firebase.auth().currentUser
      if (this.userInfo.email !== user.email) {
        const formData = this
        user.updateEmail(this.userInfo.email).then(function () {
          db.collection('metadata').doc(user.uid).update({
            email: formData.userInfo.email
          })
          console.log('Update successful')
        }).catch(function (error) {
          alert(error.message)
          if (error.code === 'auth/requires-recent-login') {
            formData.$refs.modalPassword.show()
          }
        })
      }
      user.updateProfile({
        displayName: this.userInfo.firstName.trim() + ' ' + this.userInfo.lastName.trim()
      }).then(function () {
        // Update successful.
      }).catch(function (error) {
        throw new Error('Error updating user info' + error)
      })
      db.collection('metadata').doc(user.uid).update({
        displayName: this.userInfo.firstName.trim() + ' ' + this.userInfo.lastName.trim(),
        firstName: this.userInfo.firstName.trim(),
        middleName: this.userInfo.middleName.trim(),
        lastName: this.userInfo.lastName.trim(),
        phone: this.userInfo.phone,
        address: this.userInfo.address,
        address2: this.userInfo.address2,
        city: this.userInfo.city,
        state: this.userInfo.state,
        zip: this.userInfo.zip,
      }).then(function () {
        alert('Profile successfully updated')
      }).catch(function (error) {
        throw new Error('Error updating user info' + error)
      })
    }
  }
}
</script>

<style scoped>
.sign-up {
  margin-top: 40px;
}
.password-button {
  background-color: rgb(0,150,136);
  color: rgb(255,255,255);
}
input {
  margin: 10px 0;
}
button {
  margin-top: 20px;
  width: 60%;
  cursor: pointer;
  padding: 10px;
  background-color: rgb(33,150,243);
  color: rgb(255,255,255);
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
  height: 3.5rem!important;
  margin-bottom: 0px!important;
  margin-top: 10px;
}
</style>
