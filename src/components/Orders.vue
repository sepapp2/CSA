<template>
  <div class="orders">
    <h2>Orders</h2>
    <b-row class="mb-2" align-h="end">
      <b-col md="2">
        <b-form-checkbox class="my-2" id="filledStatus"
                         v-model="filledStatus"
                         >
            Show Filled
        </b-form-checkbox>
      </b-col>
      <b-col md="2">
        <datepicker v-model="startDate" name="startDate" input-class="form-control"></datepicker>
      </b-col>
      <b-col md="2">
        <datepicker v-model="endDate" name="endDate" input-class="form-control"></datepicker>
      </b-col>
      <b-col cols="3">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to Search" />
            <b-input-group-append>
              <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
            </b-input-group-append>
          </b-input-group>
      </b-col>
      <b-col md="2">
        <b-button-group>
          <b-button variant="success" @click="fetchFilteredItems()">Search</b-button>
          <download-excel
            class = "btn btn-primary"
            :fetch = "fetchData"
            type    = "csv">
            <icon name="download"></icon>
            </download-excel>
        </b-button-group>
      </b-col>
    </b-row>
    <!-- Main table element -->
    <b-table show-empty
             stacked="md"
             :items="orders"
             :fields="fields"
             :current-page="currentPage"
             :per-page="perPage"
             :filter="filter"
             @filtered="onFiltered"
             :total-rows="totalRows"

    >
      <template slot="userName" slot-scope="row">{{row.item.userName}}</template>
      <template slot="orderDate" slot-scope="row">{{row.item.orderDate | moment("MM/DD/YYYY")}}</template>
      <template slot="orderTotal" slot-scope="row">${{row.item.orderTotal}}</template>
      <template slot="paymentType" slot-scope="row">{{row.item.paymentType}}</template>
      <template slot="actions" slot-scope="row">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
        <b-button size="sm" @click.stop="info(row.item, row.index, $event.target)" class="mr-1">
          View Order
        </b-button>
        <!-- <b-button size="sm" v-if="row.item.isFilled" variant="success" @click.stop="markOrderFilled(row.item)" class="mr-1">
          Mark Not Filled
        </b-button>
        <b-button size="sm" v-if="!row.item.isFilled" variant="success" @click.stop="markOrderFilled(row.item)" class="mr-1">
          Mark Filled
        </b-button> -->
        <b-button size="sm" variant="danger" @click.stop="deleteOrder(row.item)" class="mr-1">
          Delete Order
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
            <b-row>
                <b-col cols="12" align-h="right" class="text-right">
                      <h4 class="mt-2">Payment Method</h4>
                        <b-form-radio-group id="radio-group" v-model="modalInfo.content.paymentType">
                          <b-form-radio value="Cash">Cash</b-form-radio>
                          <b-form-radio value="Check">Check</b-form-radio>
                          <b-form-radio value="Credit Card">Credit Card</b-form-radio>
                        </b-form-radio-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="4" offset="8" align-h="right" class="text-right" align-self="end">
                          <b-form-textarea
                              id="orderNotes"
                              v-model="modalInfo.content.orderNotes"
                              placeholder="Notes"
                              rows="3"
                              max-rows="6"
                          ></b-form-textarea>
                </b-col>
            </b-row>
            </b-card>
    </b-modal>
    </div>
</template>

<script>
import { db } from '../main'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'Orders',
  components: {
    Datepicker
  },
  firestore () {
    return {
      orders: db.collection('orders').where('orderDate', '>=', this.startDate).where('orderDate', '<=', this.endDate).orderBy('orderDate', 'desc')
    }
  },
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
      return this.orders.length
    }
  },
  data () {
    return {
      startDate: Date.now(),
      endDate: Date.now(),
      orders: [],
      fields: [
        { key: 'userName', label: 'Person Ordering', sortable: true, sortDirection: 'desc' },
        { key: 'orderDate', label: 'Order Date', 'class': 'text-center' },
        { key: 'orderTotal', label: 'Order Total' },
        { key: 'paymentType', label: 'Payment Type', sortable: true, sortDirection: 'desc' },
        { key: 'actions', label: 'Actions' }
      ],
      currentPage: 1,
      perPage: 10,
      pageOptions: [ 5, 10, 15 ],
      filter: null,
      filledStatus: false,
      showFilledOrders: [],
      paymentType: null,
      orderNotes: '',
      modalInfo: { title: '', content: '' }
    }
  },
  methods: {
    fetchFilteredItems () {
      this.orders = []
      db.collection('orders').where('orderDate', '>=', new Date(this.startDate)).where('orderDate', '<=', new Date(this.endDate)).where('isFilled', '==', this.filledStatus).orderBy('orderDate', 'desc')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            var orderInfo = doc.data()
            orderInfo.id = doc.id
            this.orders.push(orderInfo)
          })
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
    },
    async fetchData () {
      const downloadCSV = this.orders.filter(order => order.orderDate > new Date(this.startDate) && order.orderDate < this.endDate)
      downloadCSV.forEach(orderDetail => {
        orderDetail.order.forEach(item => {
          delete item.description
          delete item.quantityLabel
          delete item.quantityLimit
          delete item.userName
          delete item.id
          return JSON.stringify(item)
        })
        orderDetail.order = JSON.stringify(orderDetail.order)
        orderDetail.orderTotal = parseFloat(orderDetail.orderTotal)
      })
      return downloadCSV
    },
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
      this.totalRows = this.orders.length
      this.currentPage = 1
    },
    deleteOrder (evt) {
      db.collection('orders').doc(evt.id).delete().then(function () {
        evt.order.forEach(item => {
          var orderDocRef = db.collection('Products').doc(item.id)
          return db.runTransaction(transaction => {
            return transaction.get(orderDocRef).then(orderDoc => {
              if (!orderDoc.exists) {
                console.log('Document does not exist!')
              }
              var newQty = parseInt(orderDoc.data().quantity) + parseInt(item.quantity)
              transaction.update(orderDocRef, { quantity: newQty })
            })
          }).then(function () {
            console.log('Transaction successfully committed!')
          }).catch(function (error) {
            console.log('Transaction failed: ', error)
          })
        })
        alert('Order Deleted')
      }).catch(function (error) {
        console.error('Error removing document: ', error)
      })
    },
    markOrderFilled (evt) {
      var docRef = db.collection('orders').doc(evt.id)
      return db.runTransaction(function (transaction) {
        return transaction.get(docRef).then(function (doc) {
          if (!doc.exists) {
            console.log('Document does not exist!')
          }
          if (doc.data().isFilled) {
            transaction.update(docRef, { isFilled: false, paymentType: evt.paymentType, orderNotes: evt.orderNotes })
          } else {
            transaction.update(docRef, { isFilled: true, paymentType: evt.paymentType, orderNotes: evt.orderNotes })
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
