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
    },
    removeFromCart ({ commit }, product) {
      commit(types.REMOVE_FROM_CART, product
      )
    },
    clearCart ({ commit }, product) {
      commit(types.CLEAR_CART, product
      )
    }
  },
  mutations: {
    REMOVE_FROM_CART (state, id) {
      const index = state.added.findIndex(p => p.id === id.id)
      state.added.splice(index, 1)
    },
    CLEAR_CART (state, id) {
      state.added = []
    },
    ADD_TO_CART (state, id) {
      const record = state.added.find(p => p.id === id.id)
      if (!record) {
        state.added.push({
          id: id.id,
          name: id.name,
          price: id.price,
          description: id.description,
          quantityLabel: id.quantityLabel,
          quantity: id.quantityAdd
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
