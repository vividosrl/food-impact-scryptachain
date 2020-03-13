<template>
  <ion-app>
    <ion-content>
      <ion-tabs>
        <ion-tab tab="/">
          <ion-vue-router name="home"></ion-vue-router>
        </ion-tab>

        <ion-tab tab="/you-vote">
          <ion-vue-router name="youvote"></ion-vue-router>
        </ion-tab>

        <ion-tab tab="/about-us">
          <ion-vue-router name="aboutus"></ion-vue-router>
        </ion-tab>

        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="Home" :to="{ name: 'home' }">
            <ion-icon name="home"></ion-icon>
            <ion-label>Home</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="YouVote" :to="{ name: 'youvote' }">
            <ion-icon name="create"></ion-icon>
            <ion-label>YouVote</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="AboutUs" :to="{ name: 'aboutus' }">
            <ion-icon name="information-circle"></ion-icon>
            <ion-label>About us</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-app>
</template>

<script>
export default {
  name: "Tabs"
};
</script>

