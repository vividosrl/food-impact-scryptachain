<template>
  <ion-app>
    <ion-header>
      <ion-toolbar text-center>
        <ion-title>{{electionTitle}}</ion-title>
        <ion-title>Expire : {{new Date(election.expire * 1000)}}</ion-title>
        <ion-label>Remaining Vote: {{election.availableVotes}}</ion-label>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-title text-center></ion-title>
      <ion-item>Election address: {{election.electionAddress}}</ion-item>
      <hr />
      <ion-item>Your address: {{votantAddress}}</ion-item>
      <ion-grid>
        <ion-row>
          <ion-col
            v-for="candidate in candidates"
            :key="candidate.id"
            size="fixed"
            size-sm="6"
            size-md="4"
            size-lg="3"
          >
            <Candidate
              :candidate="candidate"
              :availableVotes="election.availableVotes"
              @voteChanged="updateVote($event)"
            ></Candidate>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    <ion-button @click="submit()" :disabled="this.blockchainTool===undefined">VOTE</ion-button>
  </ion-app>
</template>

<script>
import Candidate from "../components/Candidate";
import templateElection from "../assets/bc-election-test/CandidatesTest.json";
export default {
  name: "youvote",
  components: { Candidate },
  data() {
    return {
      election: {},
      candidates: {},
      votantAddress: "0xADDRESS",
      blockchainTool: undefined
    };
  },
  computed: {
    electionTitle() {
      return this.election.title == undefined
        ? "YouVote"
        : this.election.title + ": " + this.election.question;
    }
  },
  async created() {
    this.election = this.electionObject();
    this.candidates = this.election.candidates;
    await this.loadBlockchainTool();
  },
  methods: {
    electionObject() {
      return typeof this.$route.params.test !== "undefined"
        ? this.$route.params.test
        : templateElection;
    },
    async loadBlockchainTool() {
      const app = this;
      try {
        this.blockchainTool = await this.$createBlockchainTool(
          this.election.blockchain
        );
        this.votantAddress = await this.blockchainTool.getAccountAddress(app);
      } catch{
        //alert(`Blockchain "${this.election.blockchain}" is not supported`)
        }
    },
    updateVote(candidateIdValue) {
      this.candidateById(candidateIdValue.id).votes += candidateIdValue.value;
      this.election.availableVotes += -1 * candidateIdValue.value;
    },
    async submit() {
      try {
        const app = this;
        await this.blockchainTool.vote(app, this.election);
        this.$router.push({ name: "home" });
      } catch (error) {
        alert("Something went wrong " + error);
        this.$router.push({ name: "home" });
      }
    },
    candidateById(id) {
      return this.candidates.find(candidate => candidate.id === id);
    }
  }
};
</script>