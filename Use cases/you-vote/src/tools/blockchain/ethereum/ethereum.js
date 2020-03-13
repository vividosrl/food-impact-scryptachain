import Web3 from "web3";
import YouVote from "./build/contracts/YouVote.json";
import messages from "../../../messages.js";

export default class SelectedBlockchainTool {
  maximum_proposals = 20;

  async getAccountAddress() {
    try {
      await this.loadWeb3();
    } catch (error) {
      throw "Account not found";
    }
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
  }

  async createElection(app, election) {
    let proposals = new Array(this.maximum_proposals).fill("0x00");
    let accountAddress = await this.getAccountAddress();

    for (let index = 0; index < election.candidates.length; index++) {
      election.candidates[index].id = index;
      proposals[index] = window.web3.utils.fromAscii(
        election.candidates[index].name
      );
    }
    try {
      return this.createAndDeployContract(
        app,
        accountAddress,
        election,
        proposals
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verify(_, election) {
    try {
      let contractAddress = election.electionAddress;
      let accountAddress = await this.getAccountAddress();
      let contract = await this.getContract(contractAddress, accountAddress);

      let hasExpired = await this.getHasExpired(contract, contractAddress);
      
      if (hasExpired) {
        let results = new Array();
        for (
          let proposal = 0;
          proposal < election.candidates.length;
          proposal++
        ) {
          let votes = await this.getProposalResult(
            contract,
            accountAddress,
            proposal
          );
          results.push(
            JSON.stringify({
              name: election.candidates[proposal].name,
              votes: votes
            })
          );
        }
        throw results;
      }

      let hasVoted = await this.getHasVoted(contract, accountAddress);
      if (!hasVoted) {
        return true;
      } else {
        throw messages.verify.voted;
      }
    } catch (error) {
      throw error;
    }
  }

  async vote(app, election) {
    let accountAddress = await this.getAccountAddress();
    let contract = await this.getContract(election.electionAddress);

    let smartContractProposals = new Array(this.maximum_proposals).fill(0);
    let smartContractVotesToProposals = new Array(this.maximum_proposals).fill(
      0
    );

    let proposals = new Array();
    let voteToProposals = new Array();
    election.candidates.forEach(candidate => {
      proposals.push(candidate.id);
      voteToProposals.push(candidate.votes);
    });

    for (let index = 0; index < proposals.length; index++) {
      smartContractProposals[index] = index;
      smartContractVotesToProposals[index] = voteToProposals[index];
    }

    await contract.methods
      .vote(smartContractProposals, smartContractVotesToProposals)
      .send({ from: accountAddress })
      .on("transactionHash", function(transactionHash) {
        console.log("transactionHash", transactionHash);
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
      })
      .on("error", function(error) {
        throw error;
      })
      .on("receipt", function(receipt) {
        console.log(receipt.contractAddress);
        app.$ionic.modalController.dismiss();
      });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      window.alert(window.web3);
    } else {
      throw "Non-Ethereum browser detected. You should consider trying MetaMask!";
    }
  }

  async getHasVoted(contract, accountAddress) {
    return await contract.methods.getHasVoted().call({ from: accountAddress });
  }

  async getProposalResult(contract, accountAddress, index) {
    return await contract.methods
      .getProposalResult(index)
      .call({ from: accountAddress });
  }

  async getHasExpired(contract, accountAddress) {
    return await contract.methods
      .getHasExpired()
      .call({ from: accountAddress });
  }

  async getContract(contractAddress, accountAddress) {
    let contract = await new window.web3.eth.Contract(
      YouVote.abi,
      contractAddress,
      {
        from: accountAddress,
        data: YouVote.bytecode
      }
    );
    return contract;
  }

  async createAndDeployContract(app, accountAddress, election, proposals) {
    let contract = await new window.web3.eth.Contract(YouVote.abi, {
      from: accountAddress,
      data: YouVote.bytecode
    });
    try {
      return await contract
        .deploy({
          data: YouVote.bytecode,
          arguments: [election.availableVotes, election.expire, proposals]
        })
        .send({
          from: accountAddress
        })
        .on("error", error => {
          console.log(error.stack);
        })
        .on("transactionHash", function(transactionHash) {
          console.log("transactionHash", transactionHash);
          return app.$ionic.modalController
            .create({
              component: () => import("../../../modal/Loading.vue"),
              backdropDismiss: false,
              componentProps: {
                parent: app,
                propsData: {
                  message: "Attend! Deploying Smart contract"
                }
              }
            })
            .then(m => m.present());
        })
        .on("receipt", function(receipt) {
          console.log(receipt.contractAddress); // contains the new contract address
          app.$ionic.modalController.dismiss();
        })
        .then(function(newContractInstance) {
          console.log(newContractInstance);
          return newContractInstance.options.address;
        });
    } catch (error) {
      throw error.stack;
    }
  }
}
