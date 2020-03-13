#YouVote Smart Contract

struct Voter:
    voted: bool
    vote: map(int128, int128)

struct Proposal:
    name: bytes32
    voteCount: int128

Voted: event({_from: indexed(address), _name: bytes32, _value: int128})
Election: event({ _from: indexed(address), _creationTimestamp: timestamp, _expire: timestamp, _proposalNumber: int128})

MAXIMUM_PROPOSALS: constant(int128) = 20
voters: public(map(address, Voter))
proposals: public(map(int128, Proposal))
numberOfproposals: int128
availableVotes: int128
electionExpire: public(timestamp)
expired: public(bool)
winner: public(Proposal)

@public
def __init__(_availableVotes: int128, _electionDuration: timestamp, _proposalNames: bytes32[MAXIMUM_PROPOSALS]):
    self.availableVotes = _availableVotes
    self.electionExpire = _electionDuration
    
    for index in range(MAXIMUM_PROPOSALS):
        if convert(_proposalNames[index], bool):
            self.proposals[index] = Proposal({
                name: _proposalNames[index],
                voteCount: 0
            })
            self.numberOfproposals+=1
        else:
            break
    log.Election(msg.sender, block.timestamp, self.electionExpire, self.numberOfproposals)

@private
def _vote( _voterAddress: address, _proposal: int128, _votesToProposal: int128 ):
    self.proposals[_proposal].voteCount+=_votesToProposal
    self.voters[_voterAddress].vote[_proposal] = _votesToProposal
    log.Voted(_voterAddress, self.proposals[_proposal].name, _votesToProposal )
    

@public
def vote(_proposals: int128[MAXIMUM_PROPOSALS], _votesToProposals: int128[MAXIMUM_PROPOSALS]):
    assert not self.voters[msg.sender].voted, 'Voter has voted yet'
    assert self.electionExpire > block.timestamp, 'Election expired'
    for proposal in _proposals:
        assert proposal < self.numberOfproposals, 'Wrong proposal number'
    totalVotes : int128 = 0
    for votes in _votesToProposals:
        totalVotes+=votes
    assert totalVotes <= self.availableVotes, 'Wrong number of votes'
    
    for index in range(MAXIMUM_PROPOSALS):
        if index < self.numberOfproposals:
            self._vote( msg.sender, _proposals[index], _votesToProposals[index] )
        else: 
            break
    self.voters[msg.sender].voted = True

@public
@constant
def getProposalResult(index:int128) -> int128:
    assert self.electionExpire < block.timestamp, 'Election not expired yet'
    return self.proposals[index].voteCount

@public
@constant
def getProposalsNumber()->int128:
    return self.numberOfproposals

@public
@constant
def getHasVoted() -> bool:
    return self.voters[msg.sender].voted


@public
@constant
def getHasExpired() -> bool:
    return self.electionExpire < block.timestamp