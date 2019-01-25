<template>
    <div class="itemSummary">
      <h1>Item Summary</h1>
      <b-row class="mb2">
        <b-col md="3" sm="12"><b-form-input id="startDate" type="date" v-model="startDate"></b-form-input></b-col>
        <b-col md="3" sm="12"><b-form-input id="endDate" type="date" v-model="endDate"></b-form-input></b-col>
        <b-col md="3" sm="12">
          <b-dropdown id="ddownEmail" text="Actions" variant="primary">
          <download-excel
            :data = "betweenDates">
            <b-dropdown-item >Download to Excel</b-dropdown-item>
          </download-excel>
          <b-dropdown-item :href="'mailto:?bcc=' + emailUsers">Email All Users</b-dropdown-item>
          </b-dropdown>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="3" sm="12">
          <div class="card bg-light mb-3">
          <div class="card-body">
            <h5 class="card-title"><icon  name="info"></icon>&nbsp;Item Totals</h5>
            <b-list-group>
              <b-list-group-item v-for="(item, idx) in itemsTotal" :key="idx" class="d-flex justify-content-between align-items-center">
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
      let start = new Date(this.startDate)
      start.setHours(0)
      start.setDate(start.getDate() + 1)
      let end = new Date(this.endDate)
      end.setHours(end.getHours() + 5)
      end.setDate(end.getDate() + 1)
      let filteredOrders = this.orders.filter(order => (new Date(order.orderDate)) >= start && (new Date(order.orderDate)) <= end)
      filteredOrders.forEach(part => {
        part.order.forEach(part2 => {
          const record = this.matrixOrders.find(order => order.itemOrdered === part2.id && order.customerName === part2.userName)
          if (!record) {
            this.matrixOrders.push({
              customerName: part2.userName,
              customerEmail: part.userOrdering.email,
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
    emailUsers () {
      this.betweenDates.forEach(element => {
        this.emailList.push(element.customerEmail)
      })
      return Array.from(new Set(this.emailList))
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
      cleanedMatrixOrders: [],
      itemTotals: [],
      orders: [],
      result: [],
      matrixItems: [],
      startDate: new Date(),
      endDate: new Date(),
      emailList: []
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
