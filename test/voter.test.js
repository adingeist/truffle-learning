const Voter = artifacts.require('./Voter.sol');

contract('Voter', (accounts) => {
  let voter;

  beforeEach(async () => {
    voter = await Voter.new(['one', 'two']);
  });

  it('has no votes by default', async () => {
    const votes = await voter.getVotes();
    expect(toNumbers(votes)).to.deep.equal([0, 0]);
  });

  it('allows to vote with a string option', async () => {
    const firstAccount = accounts[0];

    // way to call overloaded functions
    await voter.methods['vote(string)']('one', { from: firstAccount });
    // can be called normally since there's no overloads on this method
    const votes = await voter.getVotes();

    expect(toNumbers(votes)).to.deep.equal([1, 0]);
  });

  it('allows to vote with a number option', async () => {
    const firstAccount = accounts[0];

    await voter.methods['vote(uint256)'](0, { from: firstAccount });
    const votes = await voter.getVotes();

    expect(toNumbers(votes)).to.deep.equal([1, 0]);
  });

  it('does not allow to vote twice from the same account', async () => {
    try {
      const firstAccount = accounts[0];

      await voter.methods['vote(string)']('one', { from: firstAccount });
      await voter.methods['vote(string)']('one', { from: firstAccount });

      expect.fail('Should revert execution');
    } catch (error) {
      expect(error.message).to.include('Already voted');
    }
  });

  it('allows to vote from different accounts', async () => {
    const firstAccount = accounts[0];
    const secondAccount = accounts[1];

    await voter.methods['vote(string)']('one', { from: firstAccount });
    await voter.methods['vote(string)']('one', { from: secondAccount });
    const votes = await voter.getVotes();

    expect(toNumbers(votes)).to.deep.equal([2, 0]);
  });

  const toNumbers = (bigNumbers) => bigNumbers.map((n) => n.toNumber());
});
