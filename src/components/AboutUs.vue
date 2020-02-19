<template>
    <div class="about-us">
        <div class="position-relative overflow-hidden p-1 p-md-2 text-center text-white bg-gradient" v-if="!user">
            <div class="col-md-5 p-lg-5 mx-auto my-5">
                <h1 class="display-4 font-weight-normal">CSA Farmstand</h1>
                <p class="lead font-weight-normal">Items available will be on a first come, first served basis. We accept cash, check and credit cards.  Payment can be made at time of pickup.</p>
                <router-link to="home" class="btn btn-info btn-lg">Shop Now</router-link>
            </div>
        </div>
        <!-- <b-alert show variant="success" v-if="!user">
            <h4 class="alert-heading">Welcome!</h4>
                <p>
                    To get started and pre-order items from our farm stand, please click <router-link to="login">here</router-link> to login or <router-link to="sign-up">here</router-link> to create an account!
                </p>
                <hr>
                <p class="mb-0">
                    Items available will be on a first come, first served basis. We accept cash, check and credit cards.
                </p>
        </b-alert> -->
        <b-jumbotron>
            <template slot="header">
                Our CSA
            </template>
            <template slot="lead">
                <p>The UK Community Supported Agriculture (CSA) project is a part of the UK College of Agriculture,
                Department of Horticulture, and is an integral component of the Sustainable Agriculture (SAG)
                Undergraduate Curriculum. The CSA project links faculty, staff, and students from the UK community
                 with the Organic Farming Unit located at the UK Horticulture Research Farm. The CSA project is
                 not a commercial farm and is not managed for profit. All financial proceeds from the sale of CSA
                 shares support the production of food during the growing season and student educational activities
                 of the SAG program.</p>
            </template>
            <b-btn variant="primary" href="http://ukcsa.wordpress.com/">Blog</b-btn>
            <b-btn variant="success" href="http://facebook.com/uky.csa"><icon name="brands/facebook-f"></icon></b-btn>
            <b-btn variant="success" href="http://instagram.com/ukcsa"><icon name="brands/instagram"></icon></b-btn>
            <b-btn variant="success" href="http://flickr.com/ukcsa"><icon name="brands/flickr"></icon></b-btn>
        </b-jumbotron>
    </div>
</template>

<script>

export default {
  name: 'AboutUs',
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  }
}
</script>
<style scoped>
.bg-gradient {
    background: linear-gradient(40deg,#45cafc,#303f9f)!important;
}
</style>
