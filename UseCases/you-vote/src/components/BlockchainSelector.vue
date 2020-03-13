<template>
  <ion-grid fixed>
    <ion-row>
      <ion-col>
        <ion-segment scrollable>
          <ion-segment-button
            :checked="blockchainList.ethereum.checked"
            :value="blockchainList.ethereum.name"
            padding
            @ionSelect="emitSelectedBlockchain(blockchainList.ethereum.name)"
          >
            <ion-img :src="blockchainList.ethereum.img" class="icon"></ion-img>
            <ion-label>{{blockchainList.ethereum.name}}</ion-label>
          </ion-segment-button>
                    <ion-segment-button
            :checked="blockchainList.scrypta.checked"
            :value="blockchainList.scrypta.name"
            padding
            @ionSelect="emitSelectedBlockchain(blockchainList.scrypta.name)"
          >
            <ion-img :src="blockchainList.scrypta.img" class="icon"></ion-img>
            <ion-label>{{blockchainList.scrypta.name}}</ion-label>
          </ion-segment-button>
                    <ion-segment-button
            :checked="blockchainList.quadrans.checked"
            :value="blockchainList.quadrans.name"
            padding
            @ionSelect="emitSelectedBlockchain(blockchainList.quadrans.name)"
          >
            <ion-img :src="blockchainList.quadrans.img" class="icon"></ion-img>
            <ion-label>{{blockchainList.quadrans.name}}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script>
export default {
  name: "blockchainselector",
  data() {
    return {
      imageFolder: "@/assets/blockchain-icon/",
      vividoIcon: require("@/assets/vivido-blockchain.png"),
      blockchainList: {
        ethereum: {
          name: "ethereum",
          img: require("@/assets/blockchain-icon/ethereum.png"),
          checked: false
        },
        scrypta: {
          name: "scrypta",
          img: require("@/assets/blockchain-icon/scrypta.png"),
          checked: false
        },
        quadrans: {
          name: "quadrans",
          img: require("@/assets/blockchain-icon/quadrans.png"),
          checked: false
        }
      },
      selectedBlockchain: '',
    };
  },
  computed: {
    bcIcon(name) {
      return this.imageFolder + name;
    }
  },
  methods: {
    uncheck() {
      this.blockchainList[this.selectedBlockchain].checked = false;
    },
    check() {
      this.blockchainList[this.selectedBlockchain].checked = true;
    },
    emitSelectedBlockchain(blockchain) {
      this.selectedBlockchain = blockchain;
      this.check();
      this.$emit("blockchainSelected", blockchain);
    }
  }
};
</script>

<style>
.icon {
  width: 40px !important;
  height: 40px !important;
}
</style>