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
    <template slot="total" slot-scope="data">
      ${{data.item.quantity * data.item.price | round(2)}}
    </template>
  </b-table>
    <p><button v-show="products.length" class='button is-primary' @click='checkout'>Checkout</button></p> -->
  ${{ total | round(2)}}
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Cart',
  filters: {
    round(value, accuracy, keep) {
        if (typeof value !== 'number') return value;
        var fixed = value.toFixed(accuracy);
        return keep ? fixed : +fixed; 
    }
  },
  data () {
    return {
      fields: [
        { key: 'name', label: 'Product Name' },
        { key: 'description', label: 'Product Description' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'total', label: 'Total' }
      ]
    }
  },
  computed: {
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
      alert('Pay us $' + this.total)
    }
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
