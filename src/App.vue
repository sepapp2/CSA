<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" class="bg-navbar">

        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand to="/conferences">
          <img src="./assets/logo.png" width="54" height="43" class="d-inline-block" alt="">
          CSA</b-navbar-brand>

        <b-collapse is-nav id="nav_collapse">

          <b-navbar-nav>
            <b-nav-item to="/conferences">Conferences</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav>
            <b-nav-item v-if="user" to="/myconferences">My Conferences</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item v-if="!user" to="/login">Login</b-nav-item>
            <b-nav-item-dropdown right :text=user.displayName id="right-menu-dropdown" v-if="user">
              <!-- Using button-content slot -->

              <b-dropdown-item to="/profile">Profile</b-dropdown-item>
              <b-dropdown-item v-on:click="logout">Sign out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>

        </b-collapse>
      </b-navbar>
    <router-view/>
  </div>
</template>

<script>
import Firebase from 'firebase'

export default {
  name: 'App',
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    userProfile () {
      return this.$store.getters.getUserProfile
    }
  },
  methods: {
    logout: function () {
      Firebase.auth().signOut().then(() => {
        this.$router.replace('/login')
      })
    },
    setUser: function () {
      this.$store.dispatch('setUser')
    }
  },
  created () {
    // when the app is created run the set user method
    // this uses Vuex to check if a user is signed in
    // check out mutations in the store.js file
    this.setUser()
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.bg-navbar {
  background-color: #1a48aa!important
}
.navbar-dark .navbar-nav .nav-link {
  color: #ffb81c!important
}
.navbar-dark .navbar-nav .nav-link:hover {
  color: #da9500!important
}
.navbar-dark .navbar-nav .nav-link.active {
  color: #fff!important
}
.navbar-brand {
  font-size: 1.5rem;
}
</style>
