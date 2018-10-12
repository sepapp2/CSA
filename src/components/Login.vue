<template>
    <div class="login">
      <b-container>
        <b-row align-h="center" class="text-center">
          <b-col cols="12" sm="12" md="8">
            <h3>Sign In</h3>
          </b-col>
        </b-row>
        <b-row align-h="center" class="text-center">
          <b-col cols="12" sm="12" md="8">
            <input class="form-control" type="email" v-model="email" placeholder="Email">
          </b-col>
        </b-row>
        <b-row align-h="center" class="text-center">
          <b-col cols="12" sm="12" md="8">
            <input class="form-control" type="password" v-model="password" placeholder="Password" v-on:keyup.enter="login">
          </b-col>
        </b-row>
        <b-row align-h="center" class="text-center">
          <b-col cols="12" sm="12" md="8">
            <button class="login-button" v-on:click="login">Login</button>
          </b-col>
        </b-row>
        <b-row align-h="center" class="text-center">
          <b-col cols="12" sm="12" md="8">
            <router-link to="/sign-up" tag="button" class="new-account-button">Create an Account</router-link>
          </b-col>
        </b-row>
        <b-row align-h="center" class="text-center">
          <b-col cols="12" sm="12" md="4">
            <button class="reset-button" size="sm" v-on:click="passwordReset">I Forgot my Password</button>
          </b-col>
        </b-row>
      </b-container>
    </div>
</template>

<script>
import Firebase from 'firebase'

export default {
  name: 'login',
  data: function () {
    return {
      email: '',
      password: '',
      showReset: false
    }
  },
  methods: {
    login: function () {
      Firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          this.$router.replace('#')
        },
        (err) => {
          alert('Problem logging in. ' + err.message)
          this.showReset = true
        }
      )
    },
    passwordReset: function () {
      if (this.email.length === 0) {
        alert('Please enter an email address to receive a password reset email.')
      } else {
        var auth = Firebase.auth()
        auth.sendPasswordResetEmail(this.email).then(function () {
          alert('An email has been sent with instructions on resetting your password.')
        }).catch(function (error) {
          alert(error.message)
        })
      }
    }
  }
}
</script>

<style scoped>
.login {
  margin-top: 40px;
}
.form-control {
  border-radius: 0px;
}
input {
  margin: 10px 0;
}
button {
  margin-top: 20px;
  width: 60%;
  cursor: pointer;
  padding: 10px;
}
.login-button {
  background-color: rgb(33,150,243);
  color: rgb(255,255,255);
}
.new-account-button {
  background-color: rgb(0,150,136);
  color: rgb(255,255,255);
}
.reset-button {
  background-color: rgb(150,0,14);
  color: rgb(255,255,255);
}
</style>
