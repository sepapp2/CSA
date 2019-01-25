<template>
  <div class="home">
    <div v-if="!storeStatus.status">
      <b-jumbotron bg-variant="info" text-variant="white" border-variant="dark">
        <template slot="header">
          Store Currently Closed
        </template>
        <template slot="lead">
          The CSA Farmstand store is currently closed.  Please come back again later. 
        </template>
      </b-jumbotron>
    </div>
    <div v-if="storeStatus.status">
      <h5>Filter List</h5>
        <b-row align-h="center" class="text-center mb-4">
          <b-col cols="6" sm="12" md="6">
            <select class="form-control" v-model="search">
              <option value="">Clear Search</option>
              <option v-for="(product, idx) in products" :key="idx" :value="product.name">{{product.name}}</option>
            </select>
          </b-col>
        </b-row>
    <b-card-group deck>
          <b-col cols="12" sm="12" md="4" lg="3" v-for="(product, idx) in filteredItems" :key="idx" v-if="product.quantity>0">
            <b-card :title="product.name"
                    :img-src= "product.productImage"
                    img-alt="Img"
                    img-top
                    img-fluid
                    class="product-card"
            >
                <p class="card-text">
                    <div class="text-muted" v-if="product.displayQuantity">
                      Quantity Available: {{ product.quantity }}
                    </div>
                    <div class="text-muted">
                      Price: ${{ product.price }}/{{product.quantityLabel}}
                    </div>
                    <div>
                    {{ product.description }}
                    </div>
                <div slot="footer">
                    <small class="text-muted">Last updated {{ product.modifiedDtm | moment("from", "now", true) }} ago</small>
                    <b-row align-h="center" class="text-center">
                      <b-col cols="10">
                        <b-input-group>
                          <b-form-input type="number" v-model="product.quantityAdd" v-bind:max="product.limitQuantity" min="1"></b-form-input>
                          <b-input-group-append>
                            <b-button @click="addToCart(product)" variant="outline-primary">Add to Cart</b-button>
                          </b-input-group-append>
                        </b-input-group>
                      </b-col>
                    </b-row>
                </div>
            </b-card>
          </b-col>
        </b-card-group>
      </div>
  </div>
</template>

<script>
import { db } from '../main'
import { mapActions } from 'vuex'
export default {
  name: 'app',
  computed: {
    filteredItems () {
      return this.products.filter(product => {
        return product.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      })
    }
  },
  data () {
    return {
      products: [],
      search: '',
      storeStatus: []
    }
  },
  firestore () {
    return {
      products: db.collection('Products').where('active', '==', true).orderBy('name', 'asc'),
      storeStatus: db.collection('StoreStatus').doc('status')
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
.product-card {
  margin-bottom: 15px!important;
}
</style>
