<template>
  <ion-col>
    <ion-segment scrollable>
      <ion-segment-button
        @click="removeCandidate(candidate)"
        v-for="candidate in e.candidates"
        :key="candidate.name"
        padding
      >
        <ion-img :src="candidate.photo" class="icon-image"></ion-img>
        <ion-label>{{candidate.name}}</ion-label>
        <ion-button>
          <ion-icon name="trash"></ion-icon>
        </ion-button>
      </ion-segment-button>
    </ion-segment>
  </ion-col>
</template>

<script>
export default {
  name: "CandidatesList",
  props: ["election"],
  methods: {
    removeCandidate(selectedCandidate) {
      var index = this.election.candidates.indexOf(selectedCandidate);
      if (index >= 0) {
        this.election.candidates.splice(index, 1);
      }
      this.$emit("setElection", this.election);
    }
  },
  watch: {
    election: {
      deep: true,
      immediate: true,
      handler() {
        this.e = this.election;
      }
    }
  }
};
</script>


<style>
.icon-image {
  width: 60px !important;
  height: 60px !important;
}
</style>