<template>
  <ion-col size="12" size-sm="12" size-md="6" size-lg="6">
    <ion-card>
      <ion-card-content text-center>
        <img class="img" :src="election.logo" />
        <ion-button>
          <ion-icon name="image"></ion-icon>
          <ion-input type="file" accept="image/*" @change="setImage($event)" class="upload"></ion-input>
          Change logo
        </ion-button>
      </ion-card-content>
      <ion-input
        :value="election.title"
        @input="election.title = $event.target.value"
        placeholder="Election title"
      ></ion-input>
      <ion-input
        :value="election.question"
        @input="election.question = $event.target.value"
        placeholder="Election question"
      ></ion-input>
      <ion-input
        type="number"
        min="0"
        max="50"
        :value="election.availableVotes"
        @input="election.availableVotes = $event.target.value"
        placeholder="Number of Vote"
      ></ion-input>
      <ion-datetime
        text-center
        v-bind:value="expire"
        @ionChange="calculateExpire($event.target.value)"
        placeholder="Expire"
        displayFormat="MM/DD/YYYY"
        min="2000-01-01"
        max="3000-12-31"
      ></ion-datetime>
    </ion-card>
  </ion-col>
</template>

<script>
export default {
  name: "ElectionForm",
  props: ["election"],
  data() {
    return {
      expire: undefined
    };
  },
  methods: {
    calculateExpire(expire) {
      this.election.expire =
        Math.round(new Date(expire).getTime() / 1000) + 100;
      console.log(this.election.expire);
      return expire;
    },
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
          this.election.logo = event.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
      }
    }
  }
};
</script>