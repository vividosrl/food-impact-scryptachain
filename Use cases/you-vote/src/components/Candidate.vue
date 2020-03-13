<template>
  <ion-card padding class="card" :style="'--shadow:' + shadow">
    <ion-card-heared text-center>
      <ion-card-title>{{name}}</ion-card-title>
    </ion-card-heared>
    <ion-card-content text-center>
      <img v-bind:src="photo" class="img" />
      <ion-button @click="changeVote(-1)" :disabled="this.voteCounter===0">-</ion-button>
      {{voteCounter}}
      <ion-button @click="changeVote(+1)" :disabled="this.availableVotes===0">+</ion-button>
    </ion-card-content>
  </ion-card>
</template>
 
<script>
export default {
  name: "Candidate",
  props: ["candidate", "availableVotes"],
  data: function() {
    return {
      id: this.candidate.id,
      name: this.candidate.name,
      photo: this.candidate.photo,
      voteCounter: this.candidate.votes,
      totalVote: this.availableVotes
    };
  },
  computed: {
    avg() {
      return (this.voteCounter * 10) / this.totalVote;
    },
    shadow() {
      return (
        "0 " +
        this.avg * 2 +
        "px " +
        this.avg * 2 +
        "px " +
        this.avg +
        "px rgba(0,0,0,.2), 0 2px " +
        this.avg * 2 +
        "px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)"
      );
    }
  },
  methods: {
    changeVote(value) {
      this.voteCounter += value;
      this.$emit("voteChanged", {
        id: this.id,
        value: value
      });
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

.card {
  box-shadow: var(--shadow);
}
</style>
