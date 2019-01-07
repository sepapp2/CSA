<template>
  <div class="orders">
    <h2>Orders</h2>
    <b-row align-h="end">
      <b-col md="1" class="my-1 centered">
        <b-form-checkbox id="filledStatus"
                         v-model="filledStatus"
                         >
            Show Filled
        </b-form-checkbox>
      </b-col>
      <b-col cols="4" class="my-1">
        <b-form-group horizontal label="Filter" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to Search" />
            <b-input-group-append>
              <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
    <!-- Main table element -->
    <b-table show-empty
             stacked="md"
             :items="filledOrders"
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
        <b-button size="sm" v-if="row.item.isFilled" variant="success" @click.stop="markOrderFilled(row.item)" class="mr-1">
          Mark Not Filled
        </b-button>
        <b-button size="sm" v-if="!row.item.isFilled" variant="success" @click.stop="markOrderFilled(row.item)" class="mr-1">
          Mark Filled
        </b-button>
      </template>
    </b-table>
    <b-row align-h="center">
      <b-col cols="2">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
    </b-row>
    <!-- Info modal -->
    <b-modal id="modalInfo"
             @hide="resetModal"
             :title="modalInfo.title"
             size="lg"
             :ok-title="modalInfo.toggleFill"
             @ok="markOrderFilled(modalInfo.content)">
            <b-card title="Contact Information">
                <p class="card-text" v-if="modalInfo.content">
                    Email: {{modalInfo.content.userOrdering.email}}<br>
                    Phone: {{modalInfo.content.userOrdering.phone}}
                </p>
            <b-list-group>
              <b-list-group-item v-for="(item, ids) in modalInfo.content.order" :key="ids">{{item.name}}
                <b-badge variant="primary" pill>{{item.quantity}}</b-badge>
              </b-list-group-item>
            </b-list-group>
            </b-card>
    </b-modal>
    </div>
</template>

<script>
import { db } from '../main'

export default {
  name: 'Orders',
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    userProfile () {
      return this.$store.getters.getUserProfile
    },
    filledOrders () {
      return this.orders.filter(order => {
        return order.isFilled === this.filledStatus
      })
    },
    totalRows () {
      return this.orders.filter(order => {
        return order.isFilled === this.filledStatus
      }).length
    }
  },
  data () {
    return {
      orders: [],
      fields: [
        { key: 'userName', label: 'Person Ordering', sortable: true, sortDirection: 'desc' },
        { key: 'orderDate', label: 'Order Date', 'class': 'text-center' },
        { key: 'orderTotal', label: 'Order Total' },
        { key: 'actions', label: 'Actions' }
      ],
      currentPage: 1,
      perPage: 10,
      pageOptions: [ 5, 10, 15 ],
      filter: null,
      filledStatus: false,
      showFilledOrders: [],
      modalInfo: { title: '', content: '' }
    }
  },
  firestore () {
    return {
      orders: db.collection('orders')
    }
  },
  methods: {
    info (item, index, button) {
      this.modalInfo.title = `Order for ${item.userName}`
      this.modalInfo.content = item
      if (this.modalInfo.content.isFilled) {
        this.modalInfo.toggleFill = 'Mark Not Filled'
      } else {
        this.modalInfo.toggleFill = 'Mark Filled'
      }
      this.$root.$emit('bv::show::modal', 'modalInfo', button)
    },
    resetModal () {
      this.modalInfo.title = ''
      this.modalInfo.content = ''
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    markOrderFilled (evt) {
      // Create a reference to the SF doc.
      console.log(evt.id)
      var sfDocRef = db.collection('orders').doc(evt.id)
      return db.runTransaction(function (transaction) {
        return transaction.get(sfDocRef).then(function (sfDoc) {
          if (!sfDoc.exists) {
            console.log('Document does not exist!')
          }
          if (sfDoc.data().isFilled) {
            transaction.update(sfDocRef, { isFilled: false })
          } else {
            transaction.update(sfDocRef, { isFilled: true })
          }
        })
      }).then(function () {
        console.log('Transaction successfully committed!')
      }).catch(function (error) {
        console.log('Transaction failed: ', error)
      })
    }
  }
}
</script>

<style scoped>
.orders {
  margin-top: 15px;
  margin-left: 15px;
  margin-right: 15px;
}
</style>
