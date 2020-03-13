<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-icon @click="closeMe" slot="end" size="large" name="close" />
      </ion-toolbar>
    </ion-header>
    <ion-content text-center padding>
      IPFS: {{ ipfsHash }}
      <ion-button @click="participateToElection">Go to vote</ion-button>
      <br />
      Blockchain Address: {{ electionAddress }}
      <br />
      <ion-button @click="closeMe">
        <ion-icon size="large" name="home" />
      </ion-button>
    </ion-content>
  </div>
</template>
 
<script>
export default {
  name: "ElectionInfo",
  props: {
    ipfsHash: {
      type: String,
      default: ""
    },
    electionAddress: {
      type: String,
      default: ""
    },
    participateToElection: { type: Function, default: () => {} },
    closeMe: { type: Function, default: () => {} }
  },
  data() {
    return {
      content: "Content"
    };
  }
};
</script>