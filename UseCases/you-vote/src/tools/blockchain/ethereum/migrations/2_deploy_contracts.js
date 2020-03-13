var YouVote = artifacts.require("YouVote.vyper");

module.exports = function(deployer) {
  const MAXIMUM_PROPOSALS = 10;
  let proposals = new Array(MAXIMUM_PROPOSALS).fill("0x00");
  proposals[0] = "0x506970706f";
  proposals[1] = "0x506970708f";

  let expireTimestamp = Math.round(new Date().getTime()/1000) + 60

  let availableVotes = 10

  deployer.deploy(YouVote, availableVotes, expireTimestamp, proposals);
};
