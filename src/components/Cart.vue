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
                    v-bind:max="data.item.quantityLimit"
                    min="1"
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
            <b-form-group label="Payment Method">
              <b-form-radio-group id="radio-group" v-model="paymentType" >
                <b-form-radio value="Cash">Cash</b-form-radio>
                <b-form-radio value="Check">Check</b-form-radio>
                <b-form-radio value="Credit Card">Credit Card</b-form-radio>
              </b-form-radio-group>
            </b-form-group>
      </b-col>
  </b-row>
  <b-row>
      <b-col cols="4" offset="8" align-h="right" class="text-right" align-self="end">
                <b-form-textarea
                    id="orderNotes"
                    v-model="orderNotes"
                    placeholder="Notes"
                    rows="3"
                    max-rows="6"
                ></b-form-textarea>
      </b-col>
  </b-row>
  <b-row v-show="products.length" class="mt-4">
      <b-col cols="12" align-h="right" class="text-right">
          <b-button variant="outline-success" size="lg" @click="checkout()">Place Order</b-button>
      </b-col>
  </b-row>
    <b-modal  id="modal1"
              size="lg"
              ref="myModalRef"
              title="Update Pickup Information"
              ok-title="Submit"
              @ok="checkout">
    <b-form class="modal-form">
    <b-form-group label="Pickup Location">
      <b-form-radio-group id="radiosPickup" v-model="form.pickupLocation" name="radioPickup" required>
        <b-form-radio value="Farm">Farm</b-form-radio>
        <b-form-radio value="Campus">Campus</b-form-radio>
      </b-form-radio-group>
    </b-form-group>
    <b-form-group label="University Affiliation">
      <b-form-radio-group id="radiosAffiliation" v-model="form.affiliation" name="radioAffiliation" required>
        <b-form-radio value="Staff">Staff</b-form-radio>
        <b-form-radio value="Faculty">Faculty</b-form-radio>
        <b-form-radio value="Student">Student</b-form-radio>
      </b-form-radio-group>
    </b-form-group>
    <b-form-group label="Text Reminders">
      <b-form-radio-group id="radiosTexts" v-model="form.texts" name="radioTexts">
        <b-form-radio value="Yes">Yes</b-form-radio>
        <b-form-radio value="No">No</b-form-radio>
      </b-form-radio-group>
    </b-form-group>
    <b-form-group v-if="form.texts==='Yes'">
      <label for="cellPhone">Cell Number:</label>
      <b-form-input v-model="form.cellPhone"
                  type="text"
                  placeholder="Enter Cell Phone Number"></b-form-input>
    </b-form-group>
    <b-form-group v-if="form.texts==='Yes'">
      <label for="cellCarrier">Cell Carrier:</label>
      <b-form-input v-model="form.cellCarrier"
                  type="text"
                  placeholder="Enter Cell Carrier"></b-form-input>
    </b-form-group>
    <b-form-group>
      <label for="partnerFirstName">Partner First Name:</label>
      <b-form-input v-model="form.partnerFirstName"
                  type="text"
                  placeholder="Enter Partner's First Name"></b-form-input>
    </b-form-group>
    <b-form-group>
      <label for="partnerLastName">Partner Last Name:</label>
      <b-form-input v-model="form.partnerLastName"
                  type="text"
                  placeholder="Enter Partner's Last Name"></b-form-input>
    </b-form-group>
    <b-form-group>
      <label for="partnerEmail">Partner Email:</label>
      <b-form-input v-model="form.partnerEmail"
                  type="text"
                  placeholder="Enter Partner's Email Address"></b-form-input>
    </b-form-group>
    <b-form-group label="Payment Method">
      <b-form-radio-group id="radiosPaymentMethod" v-model="form.paymentMethod" name="radioPaymentMethod">
        <b-form-radio value="Credit Card">Credit Card</b-form-radio>
        <b-form-radio value="Mail in Check">Mail in Check</b-form-radio>
      </b-form-radio-group>
    </b-form-group>
    <b-form-group label="Payment Plan">
      <b-form-radio-group id="radiosPaymentPlan" v-model="form.paymentPlan" name="radioPaymentPlan">
        <b-form-radio value="Full">In Full at Sign Up</b-form-radio>
        <b-form-radio value="Installments">In 3 Installments with minumum deposit due at sign up</b-form-radio>
      </b-form-radio-group>
    </b-form-group>
    </b-form>
  </b-modal>
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
      ],
      paymentType: null,
      orderNotes: '',
      form: {
        pickupLocation: null,
        affiliation: null,
        texts: null,
        partnerFirstName: null,
        partnerLastName: null,
        partnerEmail: null,
        paymentMethod: null,
        paymentPlan: null,
        cellPhone: null,
        cellCarrier: null
      }
    }
  },
  computed: {
    formValid () {
      if (this.form.pickupLocation && this.form.affiliation && this.form.texts) {
        return true
      } else {
        return false
      }
    },
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
      let productCount = 0
      let placeOrder = true
      if (this.products.filter(order => order.quantityLabel === 'Share').length > 0 && this.formValid === false) {
        this.$refs.myModalRef.show()
        return
      }
      this.products.forEach(product => {
        var docRef = db.collection('Products').doc(product.id)
        docRef.get().then(doc => {
          if (doc.exists && (parseInt(product.quantity) > parseInt(doc.data().quantity))) {
            alert('Only ' + doc.data().quantity + ' ' + product.name + ' are available at this time.  Please edit your quantity and try again')
            placeOrder = false
          } else if (doc.exists && (parseInt(product.quantity) > parseInt(product.quantityLimit))) {
            alert('You are trying to order more than the allowed limit of ' + product.quantityLimit + '.  Please change the amount in your cart and try again.')
            placeOrder = false
          } else if (!doc.exists) {
            alert(product.name + ' is no longer available for purchase')
            placeOrder = false
          } else {
            productCount++
            if (placeOrder && productCount === this.products.length) {
              db.collection('orders').add({
                uid: this.user.uid,
                userOrdering: this.userProfile,
                order: this.products,
                orderTotal: this.total,
                orderDate: new Date(),
                isFilled: false,
                paymentType: this.paymentType,
                orderNotes: this.orderNotes,
                userName: this.userProfile.displayName,
                pickupLocation: this.form.pickupLocation,
                affiliation: this.form.affiliation,
                textReminders: this.form.texts,
                partnerFirstName: this.form.partnerFirstName,
                partnerLastName: this.form.partnerLastName,
                partnerEmail: this.form.partnerEmail,
                paymentMethod: this.form.paymentMethod,
                paymentPlan: this.form.paymentPlan,
                cellPhone: this.form.cellPhone,
                cellCarrier: this.form.cellCarrier
              })
              this.products.forEach(item => {
                var orderDocRef = db.collection('Products').doc(item.id)
                return db.runTransaction(transaction => {
                  return transaction.get(orderDocRef).then(orderDoc => {
                    if (!orderDoc.exists) {
                      console.log('Document does not exist!')
                    }
                    var newQty = parseInt(orderDoc.data().quantity) - parseInt(item.quantity)
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
            }
          }
        }).catch(function (error) {
          console.log('Error getting document:', error)
        })
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
.modal-form {
  text-align: left!important;
}
</style>
