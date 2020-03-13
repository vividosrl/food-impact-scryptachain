<template>
  <ion-app>
    <ion-header>
      <ion-toolbar>
        <ion-title text-center>
          <h1>YouVote</h1>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding text-center>
      <ion-tabs>
        <ion-tab tab="/discover">
          <ion-vue-router name="discover"></ion-vue-router>
        </ion-tab>
        <ion-tab tab="/participate">
          <ion-vue-router name="participate"></ion-vue-router>
        </ion-tab>
        <ion-tab tab="/create-new">
          <ion-vue-router name="createnew"></ion-vue-router>
        </ion-tab>
        <ion-tab-bar slot="top">
          <ion-tab-button tab="Discover" :to="{ name: 'discover' }">
            <ion-label>Discover</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="Participate" :to="{ name: 'participate' }">
            <ion-label>Participate</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="CreateNew" :to="{ name: 'createnew' }">
            <ion-label>Create New</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-app>
</template>

<script>
export default {
  name: "home"
};
</script>