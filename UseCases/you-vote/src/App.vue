<template>
  <div id="app">
    <ion-app>
      <ion-vue-router>
        <Tab></Tab>
      </ion-vue-router>
    </ion-app>
  </div>
</template>

<script>
import Tab from "./views/Tabs.vue";
export default {
  name: "app",
  components: {
    Tab
  }
};
</script>