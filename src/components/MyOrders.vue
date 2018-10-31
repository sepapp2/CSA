<template>
    <div class="myOrders">
       <b-table show-empty
             stacked="md"
             :items="orders"
             :fields="fields"
             :current-page="currentPage"
             :per-page="perPage"
             :filter="filter"
             @filtered="onFiltered"
    >
      <template slot="userName" slot-scope="row">{{row.item.userName}}</template>
      <template slot="orderDate" slot-scope="row">{{row.item.orderDate | moment("MM/DD/YYYY")}}</template>
      <template slot="orderTotal" slot-scope="row">${{row.item.orderTotal}}</template>
      <template slot="actions" slot-scope="row">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
        <b-button size="sm" @click.stop="info(row.item, row.index, $event.target)" class="mr-1">
          View Order
        </b-button>
      </template>
    </b-table>
     <b-row align-h="center">
      <b-col cols="2">
        <b-pagination :total-rows="orders.length" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
    </b-row>
    <!-- Info modal -->
    <b-modal id="modalInfo"
             @hide="resetModal"
             :title="modalInfo.title"
             size="lg"
             >
              <b-list-group>
                <b-list-group-item v-for="(item, ids) in modalInfo.content.order" :key="ids">{{item.name}}
                  <b-badge variant="primary" pill>{{item.quantity}}</b-badge>
                </b-list-group-item>
              </b-list-group>
    </b-modal>
    </div>
</template>

<script>
import { db } from '../main'

export default {
  name: 'MyOrders',
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    userProfile () {
      return this.$store.getters.getUserProfile
    }
  },
  data () {
    return {
      orders: [],
      fields: [
        { key: 'orderDate', label: 'Order Date', 'class': 'text-center' },
        { key: 'orderTotal', label: 'Order Total' },
        { key: 'actions', label: 'Actions' }
      ],
      currentPage: 1,
      perPage: 10,
      pageOptions: [ 5, 10, 15 ],
      modalInfo: { title: '', content: '' }
    }
  },
  firestore () {
    return {
      orders: db.collection('orders').where('uid', '==', this.$store.getters.getUser.uid).orderBy('orderDate', 'desc')
    }
  },
  methods: {
    info (item, index, button) {
      this.modalInfo.title = `Order Summary`
      this.modalInfo.content = item
      this.$root.$emit('bv::show::modal', 'modalInfo', button)
    },
    resetModal () {
      this.modalInfo.title = ''
      this.modalInfo.content = ''
    }
  }
}

</script>

<style scoped>
.myOrders, .row {
  margin-top: 15px;
}
</style>
