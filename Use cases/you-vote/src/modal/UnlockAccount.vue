<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-title slot="start">Unlock Account</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content text-center padding>
      <ion-input :value="password" @input="password = $event.target.value" placeholder="Password"></ion-input>
      <ion-button @click="dismissModal">
        Unlock
        <ion-icon size="large" name="close" />
      </ion-button>
    </ion-content>
  </div>
</template>
 
<script>
export default {
  name: "UnlockAccount",
  methods: {
    dismissModal() {
      this.$parent.$emit("closeUnlockAccount", { password: this.password });
    }
  },
  data() {
    return {
      password: ""
    };
  }
};
</script>