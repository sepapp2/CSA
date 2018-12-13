<template>
    <div class="itemSummary">
      <h1>Items Ordered</h1>
      <b-row class="mb2">
        <b-col sm="3"><b-form-input id="startDate" type="date" v-model="startDate"></b-form-input></b-col>
        <b-col sm="3"><b-form-input id="endDate" type="date" v-model="endDate"></b-form-input></b-col>
        <b-col sm="2">
          <download-excel
            :data = "betweenDates">
            <b-button variant="outline-primary">Download to Excel</b-button>
          </download-excel>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="3" sm="12">
          <div class="card bg-light mb-3">
          <div class="card-body">
            <h5 class="card-title"><icon  name="info"></icon>&nbsp;Item Totals</h5>
            <b-list-group>
              <b-list-group-item v-for="item in itemsTotal" class="d-flex justify-content-between align-items-center">
                {{item.itemName}}
                <b-badge variant="primary" pill>{{item.itemQuantity}}</b-badge>
              </b-list-group-item>
            </b-list-group>
            </div>
          </div>
        </b-col>
        <b-col md="9" sm="12">
          <b-table striped hover :items="betweenDates" :fields="fields"></b-table>
        </b-col>
      </b-row>
    </div>
</template>

<script>
import { db } from '../main'

export default {
  name: 'ItemSummary',
  computed: {
    betweenDates () {
      this.matrixOrders = []
      let filteredOrders = this.orders.filter(order => (new Date(order.orderDate)).getTime() >= (new Date(this.startDate)).getTime() && (new Date(order.orderDate)).getTime() <= (new Date(this.endDate)).getTime())
      filteredOrders.forEach(part => {
        part.order.forEach(part2 => {
          const record = this.matrixOrders.find(order => order.itemOrdered === part2.id && order.customerName === part2.userName)
          if (!record) {
            this.matrixOrders.push({
              customerName: part2.userName,
              itemOrdered: part2.id,
              itemName: part2.name,
              itemQuantity: parseInt(part2.quantity),
              itemPrice: part2.price
            })
          } else {
            record.itemQuantity = parseInt(record.itemQuantity) + parseInt(part2.quantity)
          }
        }, part)
      }, this.filteredOrders)
      return this.matrixOrders
    },
    itemsTotal () {
      this.matrixItems = []
      this.matrixOrders.forEach(piece => {
        let obj = this.matrixItems.find(o => o.itemOrdered === piece.itemOrdered)
        if (!obj) {
          this.matrixItems.push({
            itemOrdered: piece.itemOrdered,
            itemName: piece.itemName,
            itemQuantity: parseInt(piece.itemQuantity)
          })
        } else {
          obj.itemQuantity = parseInt(obj.itemQuantity) + parseInt(piece.itemQuantity)
        }
      })
      return this.matrixItems
    }
  },
  data () {
    return {
      fields: [
        { key: 'customerName', sortable: true },
        { key: 'itemName', sortable: true },
        { key: 'itemQuantity', sortable: true }
      ],
      finalMatrix: {},
      matrixOrders: [],
      itemTotals: [],
      orders: [],
      result: [],
      matrixItems: [],
      startDate: new Date(),
      endDate: new Date()
    }
  },
  firestore () {
    return {
      orders: db.collection('orders')
    }
  }
}

</script>

<style scoped>
.itemSummary {
  margin-top: 15px;
}
.mb2 {
  margin-bottom: 15px;
}
</style>
