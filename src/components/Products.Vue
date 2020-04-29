<template>
  <div class="products">
    <b-row align-h="center" class="text-center button-row">
      <b-button-toolbar key-nav  aria-label="Toolbar with button groups">
        <b-button-group class="mx-1">
          <b-btn v-b-modal.modal1>Add New Product</b-btn>
          <b-btn v-if="!storeStatus.status" @click="changeStoreStatus()">Make Store Active</b-btn>
          <b-btn v-if="storeStatus.status" @click="changeStoreStatus()">Make Store Inactive</b-btn>
        </b-button-group>
      </b-button-toolbar>
    </b-row>
    <h5>Or Filter List</h5>
    <b-row align-h="center" class="text-center mb-4">
      <b-col cols="6" sm="12" md="6">
        <select class="form-control" v-model="search">
          <option value="">Clear Search</option>
          <option v-for="(product, idx) in products" :key="idx" :value="product.name">{{product.name}}</option>
        </select>
      </b-col>
    </b-row>
    <!-- Admin Cards -->
    <b-card-group deck>
      <b-col cols="12" sm="12" md="6" lg="4" v-for="(product, idx) in filteredItems" :key="idx" class="product-card">
        <b-card>
        <a :href="product.productImage" target="_blank">View Image</a>
                <b-form-group id="productImageInputGroup"
                                label="Replace Image"
                                label-for="productImageInput">
                    <b-form-file v-model="file" ref="fileinput" accept="image/*" :state="Boolean(file)" placeholder="Choose a file..." @change="detectFileChange($event.target.files, product, idx)"></b-form-file>
                </b-form-group>
                <div class="text-muted text-left">
                  <b-form-group
                      id="productNameGroup"
                      label="Update the Name"
                      label-for="productName"
                  >
                    <b-form-input id="productName" v-model="product.name"></b-form-input>
                  </b-form-group>
                  <b-form-group
                      id="productQtyGroup"
                      type="number"
                      label="Update the quantity"
                      label-for="productQty"
                  >
                    <b-form-input type="number" id="productQty" v-model="product.quantity" ></b-form-input>
                  </b-form-group>
                  <b-form-group id="productQuantityLabelGroup"
                                label="Enter Quantity Label:"
                                label-for="productQuantityLabel">
                    <b-form-select id="productQuantityLabel" v-model="product.quantityLabel" :options="options" class="mb-3"/>
                  </b-form-group>
                    <b-form-group>
                      <b-form-checkbox v-model="product.displayPublic">
                        Display on Public Storefront
                      </b-form-checkbox>
                    </b-form-group>
                    <b-form-group>
                      <b-form-checkbox v-model="product.displayQuantity">
                        Display Available Quantity to Users
                      </b-form-checkbox>
                    </b-form-group>
                    <b-form-group>
                      <b-form-checkbox v-model="product.limitQuantityAllowed" @change="product.limitQuantity = ''">
                        Do you want to limit the Quantity allowed in cart
                      </b-form-checkbox>
                    </b-form-group>
                    <b-form-group
                      id="productQtyLimitGroup"
                      type="number"
                      label="Update the quantity limit"
                      label-for="productQtyLimit"
                      v-if="product.limitQuantityAllowed"
                  >
                    <b-form-input type="number" id="productQtyLimit" v-model="product.limitQuantity" ></b-form-input>
                  </b-form-group>
                  <b-form-group
                      id="productPriceGroup"
                      type="number"
                      label="Update the price"
                      label-for="productPrice"
                  >
                  <b-input-group prepend="$">
                    <b-form-input type="number" step="0.01" id="productPrice" v-model="product.price" ></b-form-input>
                  </b-input-group>
                  </b-form-group>
                  <b-form-group
                      id="productDescriptionGroup"
                      label="Update the Product Description"
                      label-for="productDescription"
                  >
                    <textarea id="productDescription" class="form-control" v-model="product.description" ></textarea>
                  </b-form-group>
                    <b-form-group>
                      <b-form-checkbox v-model="product.active">
                        Product is Active
                      </b-form-checkbox>
                    </b-form-group>
                </div>
            <div slot="footer">
                <small class="text-muted">Last updated {{ product.modifiedDtm | moment("from", "now", true) }} ago</small>
                <b-row>
                  <b-col>
                    <b-button @click="changeProduct(product, idx)" variant="outline-primary">Update Product</b-button>
                    <b-button @click="deleteProduct(product.id)" variant="outline-danger">Remove Product</b-button>
                  </b-col>
                </b-row>
            </div>
        </b-card>
      </b-col>
    </b-card-group>

    <!-- Modal Component -->
    <b-form @submit="onSubmit" @reset="onReset" v-if="show" class="modal-form">
    <b-modal  id="modal1"
              size="lg"
              ref="modal"
              title="Add New Product"
              @ok="onSubmit"
              @cancel="onReset"
              ok-title="Submit">
      <b-form-group id="productNameGroup"
                    label="Product Name:"
                    label-for="productName"
                    >
        <b-form-input id="productName"
                      type="text"
                      v-model="form.name"
                      required
                      placeholder="Enter Product Name">
        </b-form-input>
      </b-form-group>
      <b-form-group id="productLogoInputGroup"
                    label="Item Image"
                    label-for="productLogoInput">
          <b-form-file v-model="file" ref="fileinputModal" accept="image/*" :state="Boolean(file)" placeholder="Choose a file..." @change="detectFiles($event.target.files)"></b-form-file>
          <div class="progress-bar" :style="{ width: progressUpload + '%'}">{{ progressUpload }}%</div>
      </b-form-group>
        <b-form-group id="productQuantityGroup"
                    label="Enter Available Quantity:"
                    label-for="productQuantity">
        <b-form-input id="productQuantity"
                      type="number"
                      v-model="form.quantity"
                      required
                      placeholder="Enter Quantity of Product Available">
        </b-form-input>
      </b-form-group>
      <b-form-group id="productQuantityLabelGroup"
                    label="Enter Quantity Label:"
                    label-for="productQuantityLabel">
      <b-form-select id="productQuantityLabel" v-model="form.quantityLabel" :options="options" class="mb-3"/>
      </b-form-group>
        <b-form-group>
          <b-form-checkbox v-model="form.displayPublic">
            Display on Public Storefront
          </b-form-checkbox>
        </b-form-group>
        <b-form-group>
          <b-form-checkbox v-model="form.displayQuantity">
            Display Available Quantity to Users
          </b-form-checkbox>
        </b-form-group>
        <b-form-group>
          <b-form-checkbox v-model="form.limitQuantityAllowed">
            Do you want to limit the Quantity allowed in cart
          </b-form-checkbox>
        </b-form-group>
        <b-form-group v-if="form.limitQuantityAllowed" id="productQuantityLimitGroup"
                    label="Enter Maximum Quantity:"
                    label-for="productQuantityLimit">
        <b-form-input id="productQuantityLimit"
                      type="number"
                      v-model="form.limitQuantity"
                      required
                      placeholder="Enter Maximum Quantity for Users">
        </b-form-input>
      </b-form-group>
        <b-form-group id="productPriceGroup"
                    label="Enter Product Price:"
                    label-for="productPrice"
                    prepend="$"
                    >
        <b-input-group prepend="$">
        <b-form-input id="productPrice"
                      type="number"
                      step="0.01"
                      v-model="form.price"
                      required
                      placeholder="Enter Price of Product">
        </b-form-input>
        </b-input-group>
      </b-form-group>
        <b-form-group id="productDescriptionGroup"
                    label="Product Description:"
                    label-for="productDescription">
        <b-form-textarea id="productDescription"
                      :rows="3"
                      v-model="form.description"
                      required
                      placeholder="Enter a brief product description">
        </b-form-textarea>
      </b-form-group>
        <b-form-group>
          <b-form-checkbox v-model="form.active">
            Product is Active
          </b-form-checkbox>
        </b-form-group>
      <div slot="modal-footer">
          <b-button type="reset" variant="secondary">Cancel</b-button>
          <b-button type="cancel" variant="primary">Submit</b-button>
       </div>
    </b-modal>
     </b-form>
  </div>
</template>

<script>
import { db, storage } from '../main'
import firebase from 'firebase'

export default {
  name: 'Products',
  computed: {
    filteredItems () {
      return this.products.filter(product => {
        return product.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      })
    },
    user () {
      return this.$store.getters.getUser
    },
    userProfile () {
      return this.$store.getters.getUserProfile
    }
  },
  data () {
    return {
      search: '',
      options: [
        { value: null, text: 'Please select an option' },
        { value: 'Lbs', text: 'Lbs' },
        { value: 'Bunch', text: 'Bunch' },
        { value: 'Each', text: 'Each' },
        { value: 'Bag', text: 'Bag' },
        { value: 'Box', text: 'Box' },
        { value: 'Share', text: 'Share' }
      ],
      form: {
        name: '',
        images: '',
        description: '',
        quantity: '',
        quantityLabel: null,
        productImage: '',
        active: true,
        displayPublic: true,
        displayQuantity: true,
        limitQuantityAllowed: false,
        limitQuantity: '',
        quantityAdd: 1
      },
      progressUpload: 0,
      file: File,
      uploadTask: '',
      downloadURL: '',
      products: [],
      storeStatus: [],
      show: true
    }
  },
  firestore () {
    return {
      products: db.collection('Products').orderBy('name', 'asc'),
      storeStatus: db.collection('StoreStatus').doc('status')
    }
  },
  methods: {
    changeProduct (product, idx) {
      // Create a reference to the Product doc.
      var sfDocRef = db.collection('Products').doc(product.id)
      return db.runTransaction(function (transaction) {
        // This code may get re-run multiple times if there are conflicts.
        return transaction.get(sfDocRef).then(function (sfDoc) {
          if (!sfDoc.exists) {
            throw new Error('Document does not exist!')
          }
          var updateDate = new Date()
          transaction.update(sfDocRef, {
            quantity: parseInt(product.quantity),
            quantityLabel: product.quantityLabel,
            displayPublic: product.displayPublic,
            displayQuantity: product.displayQuantity,
            limitQuantityAllowed: product.limitQuantityAllowed,
            limitQuantity: parseInt(product.limitQuantity),
            price: product.price,
            modifiedDtm: updateDate,
            name: product.name,
            description: product.description,
            productImage: product.productImage,
            active: product.active,
            quantityAdd: 1
          })
        })
      }).then(function () {
        console.log('Transaction successfully committed!')
      }).catch(function (error) {
        console.log('Transaction failed: ', error)
      })
    },
    deleteProduct (id) {
      db.collection('Products').doc(id).delete()
    },
    onSubmit (evt) {
      evt.preventDefault()
      this.form.createdAt = new Date()
      this.form.modifiedDtm = new Date()
      db.collection('Products').add(this.form)
      this.form = {
        name: '',
        images: '',
        description: '',
        quantity: '',
        quantityLabel: null,
        productImage: '',
        active: true,
        displayPublic: true,
        displayQuantity: true,
        limitQuantityAllowed: false,
        limitQuantity: '',
        quantityAdd: 1
      }
      this.$refs.fileinputModal.reset()
      this.progressUpload = 0
      this.$refs.modal.hide()
    },
    onCancel () {
      this.$refs.modal.hide()
    },
    onReset (evt) {
      evt.preventDefault()
      /* Reset our form values */
      this.form = {}
      this.progressUpload = 0
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.$nextTick(() => { this.show = true })
      this.$refs.modal.hide()
    },
    changeStoreStatus () {
      var sfDocRef = db.collection('StoreStatus').doc('status')
      return db.runTransaction(function (transaction) {
        return transaction.get(sfDocRef).then(function (sfDoc) {
          if (!sfDoc.exists) {
            console.log('Document does not exist!')
          }
          if (sfDoc.data().status) {
            transaction.update(sfDocRef, { status: false })
          } else {
            transaction.update(sfDocRef, { status: true })
          }
        })
      }).then(function () {
        console.log('Transaction successfully committed!')
      }).catch(function (error) {
        console.log('Transaction failed: ', error)
      })
    },
    detectFiles (fileList) {
      Array.from(Array(fileList.length).keys()).map(x => {
        this.upload(fileList[x])
      })
    },
    detectFileChange (fileList, product, idx) {
      Array.from(Array(fileList.length).keys()).map(x => {
        this.uploadChange(fileList[x], product, idx)
      })
    },
    upload (file) {
      if (this.imageName != null) {
        var imageRef = storage.ref().child('images/' + this.imageName)
        imageRef.delete().then(function () {
        }).catch(function (error) {
          throw new Error('Error removing file: ' + error)
        })
      }
      var uploadTask = storage.ref('images/' + file.name).put(file)
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          this.progressUpload = Math.floor(snapshot.bytesTransferred / snapshot.totalBytes) * 100
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              console.log('Upload is paused')
              break
            case firebase.storage.TaskState.RUNNING:
              console.log('Upload is running')
              break
          }
        }, error => {
          switch (error.code) {
            case 'storage/unauthorized':
              alert('Error Uploading File')
              break

            case 'storage/canceled':
              alert('File Upload Cancelled')
              break

            case 'storage/unknown':
              alert('Error Uploading File')
              break
          }
        }, completed => {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.form.productImage = downloadURL
          })
        })
    },
    uploadChange (file, product, idx) {
      if (this.imageName != null) {
        var imageRef = storage.ref().child('images/' + this.imageName)
        imageRef.delete().then(function () {
        }).catch(function (error) {
          throw new Error('Error removing file: ' + error)
        })
      }
      var uploadTask = storage.ref('images/' + file.name).put(file)
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          this.progressUpload = Math.floor(snapshot.bytesTransferred / snapshot.totalBytes) * 100
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              console.log('Upload is paused')
              break
            case firebase.storage.TaskState.RUNNING:
              console.log('Upload is running')
              break
          }
        }, error => {
          switch (error.code) {
            case 'storage/unauthorized':
              alert('Error Uploading File')
              break

            case 'storage/canceled':
              alert('File Upload Cancelled')
              break

            case 'storage/unknown':
              alert('Error Uploading File')
              break
          }
        }, completed => {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            var sfDocRef = db.collection('Products').doc(product.id)
            return db.runTransaction(function (transaction) {
            // This code may get re-run multiple times if there are conflicts.
              return transaction.get(sfDocRef).then(function (sfDoc) {
                if (!sfDoc.exists) {
                  throw new Error('Document does not exist!')
                }
                transaction.update(sfDocRef, {
                  productImage: downloadURL
                })
              })
            }).then(function () {
              console.log('Transaction successfully committed!')
            }).catch(function (error) {
              console.log('Transaction failed: ', error)
            })
          })
        })
    }
  },
  watch: {
    uploadTask: function () {
      this.uploadTask.on('state_changed', sp => {
        this.progressUpload = Math.floor(sp.bytesTransferred / sp.totalBytes * 100)
      })
    }
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
.product-add {
  margin-top: 15px;
  margin-bottom: 15px;
}
.products {
  margin-top: 15px;
}
.modal-form {
  text-align: initial;
}
.top-button, .product-card {
  margin-bottom: 15px;
}
.top-button {
  width: 60%;
  margin-top: 20px;
  cursor: pointer;
  padding: 10px;
  background-color: rgb(33,150,243);
  color: rgb(255,255,255);
}
.icon-set {
  display: flex;
}
.fa-icon {
  margin: 5px;
}
.font-double {
  font-size: 2rem;
}
.button-row {
  margin-bottom: 15px;
}
</style>
