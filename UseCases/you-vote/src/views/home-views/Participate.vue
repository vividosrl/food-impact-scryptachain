<template>
  <ion-app>
    <ion-content text-center center :style="{'--background': '#156185' }">
      <ion-title padding>Participate</ion-title>
      <ion-item>
        <ion-input
          placeholder="ipfs hash here"
          :value="ipfsHash"
          @input="ipfsHash = $event.target.value"
          v-on:keyup.enter="partecipate(ipfsHash)"
        ></ion-input>
      </ion-item>
      <ion-button @click="partecipate(ipfsHash)">Vote</ion-button>
    </ion-content>
  </ion-app>
</template>

<script>
export default {
  name: "participate",
  data() {
    return {
      ipfsHash:
        this.$route.params.ipfsHash !== undefined
          ? this.$route.params.ipfsHash
          : null
    };
  },
  methods: {
    async partecipate(ipfsHash) {
      try {
        let election = await this.getElectionJSON(ipfsHash);
        let blockchainTool = await this.$createBlockchainTool(
          election.blockchain
        );
        const app = this;
        let verified = await blockchainTool.verify(app, election);
        if (verified) {
          this.$router.push({
            name: "youvote",
            params: { test: election }
          });
        }
      } catch (error) {
        alert(error);
        this.$router.push({ name: "home" });
      }
    },
    async getElectionJSON(ipfsHash) {
      try {
        return await this.$ipfs.getJson(ipfsHash);
      } catch (error) {
        throw "IPFS: " + error;
      }
    }
  }
};
</script>

<style>
</style>