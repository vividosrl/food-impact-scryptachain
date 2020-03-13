<template>
  <ion-app>
    <ion-content text-center>
      <img
        class="center"
        :src="vividoLogo"
      />
      <ion-button @click="redirect(linkedin)">LINKEDIN</ion-button>
      <ion-button @click="redirect(medium)">MEDIUM</ion-button>
      <ion-button @click="redirect(site)">VIVIDO.IT</ion-button>
    </ion-content>
  </ion-app>
</template>

<script>
export default {
  name: "AboutUs",
  data(){
    return{
      linkedin:"https://www.linkedin.com/company/vivido-srl",
      medium:"https://medium.com/vivido-it",
      site:"https://www.vivido.it",
      vividoLogo: require('../assets/vivido-blockchain.png')
    }
  },
  methods:{
    redirect(site){
      window.open(site);
    }
  }
};
</script>

<style>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>