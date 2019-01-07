<template>
    <div class="user-email container">
        <h2>User Order Email Text</h2>
        <b-row>
            <b-col cols="12">
              <quill-editor v-model="email.emailText"
                            ref="myQuillEditor"
                            >
              </quill-editor>
            </b-col>
        </b-row>
        <b-row align-h="center" class="text-center mb-4 mt-4">
            <b-col cols="4">
                <b-button @click="updateEmail()" variant="outline-primary">Update Email Confirmation Text</b-button>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import { db } from '../main'

export default {
  name: 'UserEmail',
  data () {
    return {
      test: [],
      email: []
    }
  },
  firestore () {
    return {
      email: db.collection('email').doc('emailText')
    }
  },
  methods: {
    updateEmail () {
      var emailDocRef = db.collection('email').doc('emailText')
      return db.runTransaction(transaction => {
        return transaction.get(emailDocRef).then(emailDoc => {
          if (!emailDoc.exists) {
            throw new Error('Document does not exist!')
          }
          transaction.update(emailDocRef, { emailText: this.email.emailText })
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
.user-email {
  margin-top: 15px;
}
</style>
