import Vue from 'vue'
import Vuex from 'vuex'
import Firebase from 'firebase'
import * as types from './mutation-types'
import { db } from '../main'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null,
    userProfile: null,
    added: []
  },
  getters: {
    getUser: state => {
      return state.user
    },
    getUserProfile: state => {
      return state.userProfile
    },

    cartProducts: state => {
      return state.added
    }
  },
  actions: {
    setUser: context => {
      context.commit('setUser')
    },
    addToCart ({ commit }, product) {
      commit(types.ADD_TO_CART, product
      )
    }
  },
  mutations: {
    ADD_TO_CART (state, id) {
      const record = state.added.find(p => p.id === id.id)
      if (!record) {
        state.added.push({
          id: id.id,
          name: id.name,
          price: id.price,
          description: id.description,
          quantity: 1
        })
      } else {
        record.quantity++
      }
    },
    setUser: state => {
      state.user = Firebase.auth().currentUser
      if (Firebase.auth().currentUser) {
        db.collection('metadata').doc(Firebase.auth().currentUser.uid).onSnapshot(doc => {
          if (doc.exists) {
            state.userProfile = doc.data()
          } else {
            state.userProfile.admin = false
          }
        })
      } else {
        state.userProfile = []
        state.userProfile.admin = false
      }
    }
  }
})
