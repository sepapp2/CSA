<template>
  <div class="home">
<b-card-group deck>
      <b-col cols="12" sm="12" md="6" lg="4" v-for="(product, idx) in products" :key="idx" class="product-card">
        <b-card :title="product.name"
                :img-src= "product.productImage"
                img-alt="Img"
                img-top
                img-fluid
        >
            <p class="card-text">
                <div class="text-muted">
                  Quantity Available: {{ product.quantity }}
                </div>
                <div class="text-muted">
                  Price: ${{ product.price }}
                </div>
                <div>
                {{ product.description }}
                </div>
            <div slot="footer">
                <small class="text-muted">Last updated {{ product.modifiedDtm | moment("from", "now", true) }} ago</small>
                <b-row>
                  <b-col>
                    <b-button @click="addToCart(product)" variant="outline-primary">Add to Cart</b-button>
                  </b-col>
                </b-row>
            </div>
        </b-card>
      </b-col>
    </b-card-group>
  </div>
</template>

<script>
import { db } from '../main'
import { mapActions } from 'vuex'
export default {
  name: 'app',
  data () {
    return {
      products: []
    }
  },
  firestore () {
    return {
      products: db.collection('Products').where('active', '==', true).orderBy('name', 'asc')
    }
  },
  methods: mapActions([
    'addToCart'
  ])
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.home {
  margin-top: 15px;
}
</style>
