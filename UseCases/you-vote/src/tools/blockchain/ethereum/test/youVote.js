const YouVote = artifacts.require("YouVote");

contract("YouVote", () => {
  const MAXIMUM_PROPOSALS = 10;
  let youVote = undefined;
  let proposals = undefined
  let votesToProposals = undefined;

  beforeEach(async () => {
    let availableVotes = 10;
    let expireTimestamp = Math.round(new Date().getTime() / 1000) + 60;
    let proposalsNames = new Array(MAXIMUM_PROPOSALS).fill("0x00");
    proposalsNames[0] = "0x506970706f";
    proposalsNames[1] = "0x506970708f";
    youVote = await YouVote.new(availableVotes, expireTimestamp, proposalsNames);

    proposals = new Array(MAXIMUM_PROPOSALS).fill(0);
    votesToProposals = new Array(MAXIMUM_PROPOSALS).fill(0);
  });

  it("Should deploy smart contract", async () => {
    assert(youVote.address !== "");
  });

  it("Should return correct number of proposals", async () => {
    const proposalsNumber = await youVote.getProposalsNumber();
    assert.equal(proposalsNumber, 2);
  });

  it("Should doesn't pass the assert when voter vote twice", async () => {
    proposals[0] = 0;
    proposals[1] = 1;
    votesToProposals[0] = 4;
    votesToProposals[1] = 5;

    try {
      await youVote.vote(proposals, votesToProposals);
      await youVote.vote(proposals, votesToProposals);
    } catch (error) {
      assert.equal(error.reason, "Voter has voted yet");
    }
  });

  it("Should doesn't pass the assert when proposals number is wrong", async () => {
    proposals[0] = 0;
    proposals[1] = 1;
    proposals[2] = 2;
    votesToProposals[0] = 4;
    votesToProposals[1] = 5;

    try {
      await youVote.vote(proposals, votesToProposals);
    } catch (error) {
      assert.equal(error.reason, "Wrong proposal number");
    }
  });

  it("Should doesn't pass the assert when number of votes is wrong", async () => {
    proposals[0] = 0;
    proposals[1] = 1;
    votesToProposals[0] = 4;
    votesToProposals[1] = 7;

    try {
      await youVote.vote(proposals, votesToProposals);
    } catch (error) {
      assert.equal(error.reason, "Wrong number of votes");
    }
  });
});
