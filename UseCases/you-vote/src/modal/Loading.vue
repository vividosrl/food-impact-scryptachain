<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-title slot="start">...LOADING...</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content text-center padding>
      {{message}}
    </ion-content>
  </div>
</template>
 
<script>
export default {
  name: "Loading",
  props: ["message"],
};
</script>