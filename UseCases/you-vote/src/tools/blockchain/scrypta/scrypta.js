import ScryptaCore from "scrypta-core/src/scrypta";
import messages from "../../../messages.js";

window.axios = require("axios");

export default class SelectedBlockchainTool {
  constructor() {
    new ScryptaCore();
    window.scrypta = ScryptaCore;
  }

  async getAccountAddress(app) {
    const pageName = app.$vnode.data.props.name;

    if (pageName === ("createnew" || "participate")) {
      try {
        return this.unlockAccount(app);
      } catch (e) {
        throw e;
      }
    } else return window.address;
  }

  async createElection(app, election) {
    try {
      let electionAccount = await this.createAndInitAddress();
      console.log(electionAccount);
      this.showWaitingAirdropModal(app);

      for (let count = 0; count < 12; count++) {
        if (await this.airdropIsCompleted(electionAccount.pub)) {
          app.$ionic.modalController.dismiss();
          election.electionAddress = electionAccount.pub;
          election.start = this.getNow();
          election.candidates.forEach(async candidate => {
            candidate.id = candidate.name;
          });

          let lightElection = this.cleanElection(election);

          let response = await this.writeData(
            electionAccount.pub,
            electionAccount.prv,
            lightElection
          );

          console.log(response);
          return election.electionAddress;
        } else await new Promise(r => setTimeout(r, 10000));
      }
      app.$ionic.modalController.dismiss();
      throw "Error sending transaction";
    } catch (error) {
      app.$ionic.modalController.dismiss();
      throw error;
    }
  }

  async verify(app, election) {
    return this.unlockAccount(app).then(async () => {
      if (this.electionIsExpired(election.expire)) {
        throw await this.getElectionResults(election);
      } else if (await this.userHasAlreadyVoted(election.electionAddress))
        throw messages.verify.voted;
      return true;
    });
  }

  // async validate(_, election) {
  //   if (this.electionIsExpired(election.expire))
  //     throw await this.getElectionResults(election);
  //   else if (this.userHasAlreadyVoted(election.electionAddress))
  //     throw messages.verify.voted;
  //   return true;
  // }

  async vote(app, election) {
    let accountAddress = await this.getAccountAddress(app);
    let account = await window.scrypta.readKey(window.accountPsw);
    let votes = new Array();

    election.candidates.forEach(candidate =>
      votes.push({ id: candidate.id, vote: candidate.votes })
    );

    await this.writeData(
      accountAddress,
      account.prv,
      votes,
      election.electionAddress
    );
  }

  async unlockAccount(app) {
    window.idaNode = await window.scrypta.connectNode();
    console.log(window.idaNode)
    this.showLoadAccountModal(app);
    return this.waitAccountIsSetted(app).then(address => {
      if (address === false) {
        throw "Account missing";
      } else {
        window.address = address;
        return address;
      }
    });
  }

  cleanElection(election) {
    let lightElection = JSON.parse(JSON.stringify(election));
    delete lightElection.logo;
    lightElection.candidates.forEach(candidate => delete candidate.photo);
    return lightElection;
  }

  async writeData(pubKey, prvKey, data, refID = "") {
    let parameters = new FormData();
    parameters.append("dapp_address", pubKey);
    parameters.append("private_key", prvKey);
    parameters.append("protocol", "youvote://");
    parameters.append("refID", refID);
    parameters.append("data", JSON.stringify(data));

    return await window.axios.post(window.idaNode + "/write", parameters);
  }

  electionIsExpired(expireTimestamp) {
    return expireTimestamp < this.getNow();
  }

  async userHasAlreadyVoted(electionAddress) {
    let response = await window.axios.post(window.idaNode + "/read", {
      address: window.address,
      protocol: "youvote://",
      refID: electionAddress
    });
    return response.data.data.length > 0;
  }

  async createAndInitAddress() {
    return window.scrypta
      .createAddress(this.getRandPsw(), false)
      .then(async response => {
        await window.axios.post(window.idaNode + "/init", {
          address: response.pub,
          api_secret: response.api_secret
        });
        return response;
      });
  }

  getNow() {
    return Math.round(new Date().getTime() / 1000);
  }

  getRandPsw() {
    return Math.random()
      .toString(36)
      .substring(2);
  }

  async airdropIsCompleted(electionAddress) {
    let result = await window.axios.get(
      window.idaNode + "/transactions/" + electionAddress
    );
    return result.data.data.length !== 0;
  }

  showLoadAccountModal(app) {
    return app.$ionic.modalController
      .create({
        component: () => import("../../../modal/ImportScryptaSid.vue"),
        backdropDismiss: false,
        componentProps: {
          parent: app,
          propsData: {
            scrypta: window.scrypta,
            closeMe: () => {
              app.$ionic.modalController.dismiss();
            }
          }
        }
      })
      .then(m => m.present());
  }

  showWaitingAirdropModal(app) {
    return app.$ionic.modalController
      .create({
        component: () => import("../../../modal/Loading.vue"),
        backdropDismiss: false,
        componentProps: {
          parent: app,
          propsData: {
            message: "Attend while transaction is processing!"
          }
        }
      })
      .then(m => m.present());
  }

  waitAccountIsSetted(app) {
    return new Promise((resolve, reject) => {
      app.$on("closeImportAccountModal", account => {
        app.$ionic.modalController.dismiss();
        if (account) {
          window.accountPsw = account.password;
          resolve(account.address);
        } else reject("Insert .sid then unlock your account");
      });
    });
  }

  async getElectionResults(election) {
    let electionVoteArray = await this.readElectionVote(
      election.electionAddress
    );
    if (electionVoteArray.length !== 0) {
      electionVoteArray = this.excludeInvalidVotes(electionVoteArray, election);
      let results = this.calculateVotes(electionVoteArray, election);
      return results;
    } else {
      return "There are no votes";
    }
  }

  async readElectionVote(electionAddress) {
    let electionVoteArray = await window.axios.post(window.idaNode + "/read", {
      protocol: "youvote://",
      refID: electionAddress
    });
    return electionVoteArray.data.data.reverse();
  }

  excludeInvalidVotes(electionVoteArray, election) {
    return electionVoteArray
      .filter(candidateVote => candidateVote.time < election.expire)
      .filter(
        candidateVote =>
          candidateVote.data.reduce((tot, candidate) => {
            return tot + candidate.vote;
          }, 0) <= election.availableVotes
      );
  }

  calculateVotes(electionVoteArray, election) {
    let validCandidateVote = {};
    let results = new Array();

    electionVoteArray.forEach(candidateVote => {
      if (validCandidateVote[candidateVote.address] === undefined)
        validCandidateVote[candidateVote.address] = candidateVote.data;
    });

    election.candidates.forEach(candidate => (results[candidate.id] = 0));

    Object.values(validCandidateVote).forEach(voting =>
      voting.forEach(singleVote => (results[singleVote.id] += singleVote.vote))
    );

    return results;
  }
}
