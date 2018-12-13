import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import Profile from '@/components/Profile'
import Products from '@/components/Products'
import Users from '@/components/Users'
import Cart from '@/components/Cart'
import MyOrders from '@/components/MyOrders'
import Orders from '@/components/Orders'
import ItemSummary from '@/components/ItemSummary'
import AboutUs from '@/components/AboutUs'
import firebase from 'firebase'
import { db } from '../main'

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
      component: Home,
      meta: {
        requiresAuth: true
      }
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
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/myOrders',
      name: 'MyOrders',
      component: MyOrders,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/products',
      name: 'Products',
      component: Products,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/users',
      name: 'Users',
      component: Users,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/orders',
      name: 'Orders',
      component: Orders,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/itemSummary',
      name: 'ItemSummary',
      component: ItemSummary,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/aboutUs',
      name: 'AboutUs',
      component: AboutUs
    }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  let requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  let isAdmin = false
  if (currentUser != null) {
    isAdmin = db.collection('metadata').doc(firebase.auth().currentUser.uid).get().then(function (doc) {
      if (doc.exists) {
        return doc.data()
      } else {
        return false
      }
    }).catch(function (error) {
      console.log('Error getting document:', error)
    })
  } else {
    isAdmin = false
  }
  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next()
  else if (requiresAuth && requiresAdmin) {
    isAdmin.then(function (result) {
      if (result.admin) {
        next()
      } else {
        next('home')
      }
    })
  } else next()
})

export default router
