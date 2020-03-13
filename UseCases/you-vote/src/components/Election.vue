<template>
  <ion-card class="ion-card" padding @click="participate()">
    <ion-card-heared text-center>
      <ion-card-title>{{this.election.title}}</ion-card-title>
    </ion-card-heared>
    <ion-card-content>
      <img v-bind:src="this.election.logo" class="img" />
    </ion-card-content>
  </ion-card>
</template>
 
<script>
export default {
  name: "Election",
  props: ["election"],
  methods: {
    participate() {
      this.$router.push({ name: "youvote", params: { test: this.election } });
    }
  }
};
</script>

<style>
img {
  width: 100px;
  height: 200px;
  object-fit: scale-down;
}
.ion-card:hover {
  cursor: pointer;
}
</style>
