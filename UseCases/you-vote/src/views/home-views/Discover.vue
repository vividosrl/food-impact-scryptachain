<template>
  <ion-app>
    <ion-content class="ion-padding" text-center :style="{'--background': '#156185' }">
      <ion-title>Discover</ion-title>
      <BlockchainSelector ref="BlockchainSelector" @blockchainSelected="setBlockchain($event)"></BlockchainSelector>
      <ion-grid>
        <ion-row>
          <ion-col
            v-for="election in elections"
            :key="election.electionAddress"
            size="fixed"
            size-sm="6"
            size-md="4"
            size-lg="3"
          >
            <Election :election="election"></Election>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-app>
</template>

<script>
import BlockchainSelector from "../../components/BlockchainSelector.vue";
import Election from "../../components/Election.vue";
export default {
  name: "discover",
  components: { BlockchainSelector, Election },
  data() {
    return {
      youvoteHash: "QmQMY49yzudWXF9XrtHxrJbWDamuKCWtkkC7CEvx5ziqwj/discover/",
      selectedBlockchain: "",
      electionsFile: [],
      elections: []
    };
  },
  methods: {
    async setBlockchain(selectedBlockchain) {
      this.selectedBlockchain = selectedBlockchain;
      await this.populateElection();
    },
    async populateElection() {
      this.elections = [];
      try {
        this.electionsFile = await this.$ipfs.getFolderContent(
          this.youvoteHash + this.selectedBlockchain + "/"
        );
      } catch (error) {
        this.$refs.BlockchainSelector.uncheck();
        alert("This blockchain is not supported yet");
        return;
      }
      this.electionsFile.forEach(async file => {
        let jsonElection = await this.$ipfs.getJson(file.hash);
        this.putIfAbsent(this.elections, jsonElection);
      });
    },
    putIfAbsent(array, obj) {
      if (
        array.find(
          election => election.electionAddress === obj.electionAddress
        ) === undefined
      )
        array.push(obj);
    }
  }
};
</script>