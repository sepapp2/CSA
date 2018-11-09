<template>
  <div class="cart container">
    <h1 class="title">Your Cart</h1>
    <p v-show="!products.length">
      <i>Your cart is empty!</i>
      <router-link to="/">Go shopping</router-link>
    </p>
  <b-table :fields="fields" :items="products">

    <template slot="name" slot-scope="data">
      {{data.item.name}}
    </template>
    <template slot="quantity" slot-scope="data">
      <b-form-input v-model="data.item.quantity"
                    type="number"
                    >
      </b-form-input>
    </template>
    <!-- A virtual composite column -->
    <template slot="pricePerQuantity" slot-scope="data">
      ${{data.item.price | round(2)}}/{{data.item.quantityLabel}}
    </template>
    <template slot="total" slot-scope="data">
      ${{data.item.quantity * data.item.price | round(2)}}
    </template>
    <template slot="removeItem" slot-scope="data">
      <b-button variant="outline-danger" @click="removeFromCart(data.item)">Remove Item</b-button>
    </template>
  </b-table>
  <b-row>
      <b-col cols="12" align-h="right" class="text-right">
            <h3> Total: ${{ total | round(2)}}</h3>
      </b-col>
  </b-row>
  <b-row>
      <b-col cols="12" align-h="right" class="text-right">
          <b-button variant="outline-success" size="lg" @click="checkout()">Place Order</b-button>
      </b-col>
  </b-row>
</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { db } from '../main'
export default {
  name: 'Cart',
  filters: {
    round (value, accuracy, keep) {
      if (typeof value !== 'number') return value
      var fixed = value.toFixed(accuracy)
      return keep ? fixed : +fixed
    }
  },
  data () {
    return {
      fields: [
        { key: 'name', label: 'Product Name' },
        { key: 'description', label: 'Product Description' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'pricePerQuantity', label: 'Price' },
        { key: 'total', label: 'Total' },
        { key: 'removeItem', label: 'Actions' }
      ]
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    userProfile () {
      return this.$store.getters.getUserProfile
    },
    ...mapGetters({
      products: 'cartProducts',
      all: 'allProducts'
    }),
    total () {
      return this.products.reduce((total, p) => {
        return total + p.price * p.quantity
      }, 0)
    }
  },
  methods: {
    checkout () {
      if (this.products.filter(order => order.quantityLabel === 'Share').length > 0) {
        alert('Fill in More information here')
      }
      db.collection('orders').add({
        uid: this.user.uid,
        userOrdering: this.userProfile,
        order: this.products,
        orderTotal: this.total,
        orderDate: new Date(),
        isFilled: false,
        userName: this.userProfile.displayName
      })
        .then(docRef => {
          this.products.forEach(item => {
            var orderDocRef = db.collection('Products').doc(item.id)
            return db.runTransaction(transaction => {
              return transaction.get(orderDocRef).then(orderDoc => {
                if (!orderDoc.exists) {
                  console.log('Document does not exist!')
                }
                var newQty = parseInt(orderDoc.data().quantity) - item.quantity
                transaction.update(orderDocRef, { quantity: newQty })
              })
            }).then(function () {
              console.log('Transaction successfully committed!')
            }).catch(function (error) {
              console.log('Transaction failed: ', error)
            })
          })
          alert('Order Placed')
          this.$store.dispatch('clearCart')
        })
        .catch(function (error) {
          alert('Error placing order, please try again')
          console.log(error)
        })
    },
    ...mapActions([
      'removeFromCart'
    ])
  }
}
</script>
<style scoped>
.cart {
  margin-top: 15px;
}
input {
  text-align:right!important;
}
</style>
