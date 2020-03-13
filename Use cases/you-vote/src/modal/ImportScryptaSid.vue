<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-title slot="start">Select Scrypta SID file</ion-title>
        <ion-subtitle slot="start">Actual account: {{addressAccount}}</ion-subtitle>
      </ion-toolbar>
    </ion-header>
    <ion-content text-center padding>
      <ion-button>
        <ion-input type="file" accept=".sid" @change="loadWalletFromFile" class="upload"/>Upload .sid file
        <ion-icon name="arrow-round-up"></ion-icon>
      </ion-button>
      <ion-button @click="openManent">
        Create account
        <ion-icon size="large" name="add" />
      </ion-button>
      <ion-button @click="close">
        Done
        <ion-icon size="large" name="close" />
      </ion-button>
    </ion-content>
    <ion-content text-center padding>
      <ion-input
        :value="password"
        type="password"
        show-hide-input
        @input="password = $event.target.value"
        placeholder="Password"
      ></ion-input>
      <ion-button @click="dismissModal">
        Unlock
        <ion-icon size="large" name="close" />
      </ion-button>
    </ion-content>
  </div>
</template>
 
<script>
export default {
  name: "ImportScryptaSid",
  props: ["scrypta", "closeMe"],
  async mounted() {
    this.addressAccount = await this.scrypta.keyExist();
  },
  methods: {
    loadWalletFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = function() {
        var dataKey = reader.result;
        console.log(reader.result);
        localStorage.setItem("SID", dataKey);
      };
      reader.readAsText(file);
    },
    openManent() {
      window.open("https://web.manent.app/#/");
    },
    async dismissModal() {
      let address = await window.scrypta.keyExist();
      if (!address) {
        window.alert("Account missing");
      } else {
        let account = await window.scrypta.readKey(this.password);
        if (!account) {
          window.alert("Wrong password");
          this.password = "";
        } else {
          this.$parent.$emit("closeImportAccountModal", {
            address: address,
            password: this.password
          });
        }
      }
    },
    close() {
      this.$parent.$emit("closeImportAccountModal");
    }
  },
  data() {
    return {
      addressAccount: "",
      password: ""
    };
  }
};
</script>