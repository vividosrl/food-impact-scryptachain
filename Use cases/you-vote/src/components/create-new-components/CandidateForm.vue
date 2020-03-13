<template>
  <ion-col size="12" size-sm="12" size-md="6" size-lg="6">
    <ion-card>
      <ion-card-heared text-center>
        <ion-input
          placeholder="Name here"
          :value="candidate.name"
          @input="candidate.name = $event.target.value"
          v-on:keyup.enter="addCandidate"
        ></ion-input>
      </ion-card-heared>
      <ion-button @click="addCandidate()" :disabled="!isValidName()">
        <ion-icon name="person-add"></ion-icon>
      </ion-button>
      <ion-button>
        <ion-icon name="image"></ion-icon>
        <ion-input type="file" accept="image/*" @change="setImage($event)" class="upload"></ion-input>
      </ion-button>
      <ion-card-content text-center>
        <img class="img" :src="candidate.photo" />
      </ion-card-content>
    </ion-card>
  </ion-col>
</template>

<script>
import CandidateTemplate from "../../assets/template/Candidate.json";

export default {
  name: "CandidateForm",
  props: ["election", "selectedCandidate"],
  data() {
    return {
      candidate: JSON.parse(JSON.stringify(CandidateTemplate))
    };
  },
  watch: {
    selectedCandidate: {
      deep: true,
      handler() {
        this.candidate = this.selectedCandidate;
      }
    }
  },
  methods: {
    setImage(e) {
      const file = e.target.files[0];
      console.log(file);

      if (!file.type.includes("image/")) {
        alert("Please select an image file");
        return;
      }

      if (typeof FileReader === "function") {
        const reader = new FileReader();

        reader.onload = event => {
          this.candidate.photo = event.target.result;
          console.log(this.candidate.photo);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
      }
    },
    addCandidate() {
      if (this.isValidName()) {
        this.election.candidates.push(this.candidate);
        this.candidate = JSON.parse(JSON.stringify(CandidateTemplate));
        this.$emit("setElection", this.election);
      }
    },
    isValidName() {
      if (
        this.candidate.name !== "" &&
        this.election.candidates.find(
          candidate => candidate.name === this.candidate.name
        ) === undefined
      )
        return true;
      else return false;
    }
  }
};
</script>

<style>
.img {
  width: 100px;
  height: 200px;
  object-fit: scale-down;
}
.upload {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
  padding: 0;
  font-size: 20px;
  cursor: pointer;
  opacity: 0;
  filter: alpha(opacity=0);
}
</style>