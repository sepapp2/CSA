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
    <div v-if="storeStatus.status" class="store-front">
      <b-button v-if="user.email == 'uk.csa@uky.edu'" @click="toggleView()" variant="outline-primary" class="mobile-ordering">Toggle View</b-button>
      <h5 v-if="!showAdmin">Filter List</h5>
        <b-row align-h="center" class="text-center mb-4" v-if="!showAdmin">
          <b-col cols="6" sm="12" md="6">
            <select class="form-control" v-model="search">
              <option value="">Clear Search</option>
              <option v-for="(product, idx) in products" :key="idx" :value="product.name">{{product.name}}</option>
            </select>
          </b-col>
        </b-row>
      <div v-if="showAdmin">
        <b-row v-for="(product, idx) in availableProducts" :key="idx" align-h="center" class="text-center mobile-ordering">
          <b-col cols="6">
            <b-input-group :prepend="product.name">
              <b-input-group-prepend is-text>
                Qty Left: {{product.quantity}}
              </b-input-group-prepend>
              <b-form-input type="number" v-model="product.quantityAdd" v-bind:max="product.limitQuantity" min="1"></b-form-input>
                  <b-input-group-append>
                    <b-button @click="addToCart(product)" variant="outline-primary">Add to Cart</b-button>
                  </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
      </div>
    <b-card-group deck v-if="!showAdmin">
          <b-col cols="12" sm="12" md="4" lg="3" v-for="(product, idx) in filteredItems" :key="idx">
            <b-card :title="product.name"
                    :img-src= "product.productImage"
                    img-alt="Img"
                    img-top
                    img-fluid
                    class="product-card"
            >
             <div class="sold_out" v-if="product.quantity==0">Sold out</div>
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
                <div slot="footer" v-if="product.quantity>0">
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
    user () {
      return this.$store.getters.getUser
    },
    availableProducts () {
      return this.products.filter(product => {
        return product.quantity > 0
      })
    },
    showAdmin () {
      if (this.$store.getters.getUser.email == 'uk.csa@uky.edu' && this.adminView == true) {
        return true
      }
    },
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
      adminView: true,
      storeStatus: 
       { status: true }
    }
  },
  firestore () {
    return {
      products: db.collection('Products').where('active', '==', true).where('displayPublic', '==', true).orderBy('name', 'asc'),
      storeStatus: db.collection('StoreStatus').doc('status')
    }
  },
  methods: {
    toggleView () {
      this.adminView = !this.adminView
    },
    ...mapActions([
      'addToCart'
    ])
  }
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
.store-front {
  margin-top: 15px;
}
.product-card {
  margin-bottom: 15px!important;
  overflow: hidden;
}
.jumbotron {
  border-radius: 0px;
}
.mobile-ordering {
  margin-bottom: 15px;
}
.sold_out {
    top: 2em;
    left: -4em;
    color: #fff;
    display: block;
    position:absolute;
    text-align: center;
    text-decoration: none;
    letter-spacing: .06em;
    background-color: #A00;
    padding: 0.5em 5em 0.4em 5em;
    text-shadow: 0 0 0.75em #444;
    box-shadow: 0 0 0.5em rgba(0,0,0,0.5);
    font: bold 16px/1.2em Arial, Sans-Serif;
    -webkit-text-shadow: 0 0 0.75em #444;
    -webkit-box-shadow: 0 0 0.5em rgba(0,0,0,0.5);
    -webkit-transform: rotate(-45deg) scale(0.75,1);
    z-index:10;
}
.sold_out:before {
    content: '';
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    margin: -0.3em -5em;
    transform: scale(0.7);
    -webkit-transform: scale(0.7);
    border: 2px rgba(255,255,255,0.7) dashed;
}
</style>
