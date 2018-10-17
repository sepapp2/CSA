<template>
    <div class="sign-up">
      <b-container fluid>
        <b-row align-h="center" class="text-center">
          <b-col cols="12" sm="12" md="8">
            <h3>Create a New Account</h3>
          </b-col>
        </b-row>
        <b-form @submit="signUp">
          <b-row align-h="center" class="text-center">
            <b-col sm="12" md="3">
              <input class="form-control" type="text" required v-model="firstName" placeholder="First Name">
            </b-col>
            <b-col sm="12" md="2">
              <input class="form-control" type="text" v-model="middleName" placeholder="Middle Initial">
            </b-col>
            <b-col sm="12" md="3">
              <input class="form-control" type="text" required v-model="lastName" placeholder="Last Name">
            </b-col>
          </b-row>
          <b-row class="text-center">
            <b-col sm="12" md="5" offset-md="2">
              <input class="form-control" type="text" required v-model="address" placeholder="Address Line 1">
            </b-col>
          </b-row>
          <b-row align-h="center" class="text-center">
            <b-col sm="12" md="5">
              <input class="form-control" type="text" required v-model="address2" placeholder="Address Line 2">
            </b-col>
            <b-col sm="12" md="3">
              <input class="form-control" type="tel" pattern="^\d{3}-\d{3}-\d{4}$" required v-model="phone" placeholder="Phone Number format 'xxx-xxx-xxxx'">
            </b-col>
          </b-row>
          <b-row align-h="center" class="text-center">
            <b-col sm="12" md="3">
              <input class="form-control" type="text" required v-model="city" placeholder="City">
            </b-col>
            <b-col sm="12" md="2">
              <div>
                <b-form-select v-model="state" :options="states" class="mb-3" size="lg" />
              </div>
            </b-col>
            <b-col sm="12" md="3">
              <input class="form-control" type="text" required v-model="zip" pattern="[0-9]{5}" placeholder="Zip">
            </b-col>
          </b-row>
          <b-row align-h="center" class="text-center">
            <b-col cols="12" sm="12" md="8">
              <input class="form-control" type="email" required v-model="email" placeholder="Email">
            </b-col>
          </b-row>
          <b-row align-h="center" class="text-center">
            <b-col cols="12" sm="12" md="8">
              <input class="form-control" type="password" required v-model="password" placeholder="Password"><br>
            </b-col>
          </b-row>
          <b-row align-h="center" class="text-center">
            <b-col cols="12" sm="12" md="8">
              <button type="submit" v-on:click="signUp">Sign Up</button>
            </b-col>
          </b-row>
          <b-row align-h="center" class="text-center">
            <b-col cols="12" sm="12" md="8">
              <router-link to="/login" tag="button" class="login-button">Already Have an Account</router-link>
            </b-col>
          </b-row>
        </b-form>
      </b-container>
    </div>
</template>

<script>
import { db } from '../main'
import firebase from 'firebase'

export default {
  name: 'signUp',
  data () {
    return {
      states: [],
      displayName: '',
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      password: '',
      credentials: null,
      phone: '',
      institution: null,
      department: null,
      address: '',
      address2: '',
      city: '',
      state: null,
      zip: ''
    }
  },
  methods: {
    signUp: function (evt) {
      evt.preventDefault()
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          user.user.updateProfile({
            displayName: this.firstName.trim() + ' ' + this.lastName.trim()
          }).then(function () {
            // Update successful.
          }).catch(function (error) {
            throw new Error('Error updating user info' + error)
          })
          db.collection('metadata').doc(user.user.uid).set({
            displayName: this.firstName.trim() + ' ' + this.lastName.trim(),
            firstName: this.firstName.trim(),
            middleName: this.middleName.trim(),
            lastName: this.lastName.trim(),
            admin: false,
            email: this.email,
            credentials: this.credentials,
            phone: this.phone,
            address: this.address,
            address2: this.address2,
            city: this.city,
            state: this.state,
            zip: this.zip,
            uid: user.user.uid,
            admin: false
          })
          firebase.database().ref('metadata/' + user.user.uid + '/refreshTime')
          alert('Your account has been created.')
          this.$router.replace('login')
        },
        (err) => {
          console.log(err)
          alert('Error occurred.' + err.message)
        }
      )
    }
  }
}
</script>

<style scoped>
.sign-up {
  margin-top: 40px;
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
.login-button {
  background-color: rgb(0,150,136);
  color: rgb(255,255,255);
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
