import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import Profile from '@/components/Profile'
import Products from '@/components/Products'
import Users from '@/components/Users'
import firebase from 'firebase'
// import { store } from '@/store/store'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/home'
    },
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/products',
      name: 'Products',
      component: Products
    },
    {
      path: '/users',
      name: 'Users',
      component: Users
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   let currentUser = firebase.auth().currentUser
//   // let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
//   if (!currentUser) next('login')
// })

export default router
