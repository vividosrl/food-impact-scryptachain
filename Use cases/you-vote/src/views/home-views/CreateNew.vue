<template>
  <ion-app>
    <ion-content class="ion-padding" text-center>
      <ion-title>Create new</ion-title>
      <ion-label v-if="accountAddress !== null">Your address {{accountAddress}}</ion-label>
      <ion-label v-else>Select one blockchain</ion-label>
      <BlockchainSelector ref="BlockchainSelector" @blockchainSelected="setBlockchain($event)"></BlockchainSelector>
      <ion-grid fixed>
        <ion-row>
          <ElectionForm :election="election" @setElection="setElection($event)"></ElectionForm>
          <CandidateForm
            :election="election"
            :selectedCandidate="selectedCandidate"
            @setElection="setElection($event)"
          ></CandidateForm>
        </ion-row>
      </ion-grid>
      <ion-grid fixed>
        <ion-row>
          <CandidatesList :election="election" @setCandidate="setCandidate($event)"></CandidatesList>
        </ion-row>
      </ion-grid>
      <ion-button @click="generateElection()">GENERATE ELECTION</ion-button>
    </ion-content>
  </ion-app>
</template>

<script>
import ElectionForm from "../../components/create-new-components/ElectionForm.vue";
import CandidateForm from "../../components/create-new-components/CandidateForm.vue";
import CandidatesList from "../../components/create-new-components/CandidatesList.vue";
import ElectionTemplate from "../../assets/template/Election.json";
import CandidateTemplate from "../../assets/template/Candidate.json";
import BlockchainSelector from "../../components/BlockchainSelector.vue";

export default {
  name: "createnew",
  components: {
    BlockchainSelector,
    ElectionForm,
    CandidateForm,
    CandidatesList
  },
  data() {
    return {
      election: JSON.parse(JSON.stringify(ElectionTemplate)),
      selectedCandidate: JSON.parse(JSON.stringify(CandidateTemplate)),
      accountAddress: null
    };
  },
  methods: {
    setElection(election) {
      this.election = election;
    },
    setCandidate(candidate) {
      this.selectedCandidate = JSON.parse(JSON.stringify(CandidateTemplate));
      this.selectedCandidate = candidate;
    },
    async setBlockchain(selectedBc) {
      const app = this;
      this.election.blockchain = selectedBc;
      try {
        this.blockchainTool = await this.$createBlockchainTool(
          this.election.blockchain
        );
        this.accountAddress = await this.blockchainTool.getAccountAddress(app);
      } catch (error) {
        this.accountAddress = null;
        this.blockchainTool = null;
        this.$refs.BlockchainSelector.uncheck();
        alert(error);
      }
    },

    async generateElection() {
      try {
        const app = this;
        this.election.availableVotes = parseInt(this.election.availableVotes);
        this.election.electionAddress = await this.blockchainTool.createElection(
          app,
          this.election
        );
        let ipfsHash = await this.$ipfs.addElection(
          Buffer.from(JSON.stringify(this.election))
        );
        console.log(ipfsHash);
        this.showElectionInfo(ipfsHash, this.election.electionAddress);
      } catch (error) {
        alert(error);
        this.$router.push({ name: "home" });
      }
    },
    showElectionInfo(ipfsHash, election) {
      return this.$ionic.modalController
        .create({
          component: () => import("../../modal/ElectionInfo.vue"),
          backdropDismiss: false,
          componentProps: {
            parent: this,
            propsData: {
              ipfsHash: ipfsHash,
              electionAddress: election,
              participateToElection: () => {
                this.$ionic.modalController.dismiss();
                this.$router.push({
                  name: "participate",
                  params: { ipfsHash: ipfsHash }
                });
              },
              closeMe: () => {
                this.$ionic.modalController.dismiss();
                this.$router.push({ name: "home" });
              }
            }
          }
        })
        .then(m => m.present());
    }
  }
};
</script>
