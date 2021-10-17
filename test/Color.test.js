const Color = artifacts.require('./Color.sol');

require('chai').use(require('chai-as-promised')).should();

contract('Color', (accounts) => {
    let contract

    before(async () => {
        contract = await Color.deployed()
    })
    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = contract.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
            assert.notEqual(address, '')
        });
    });
    it('has a name', async () => {
        const name = await contract.name()
        assert.equal(name, 'Color')
    });
    it('has a symbol', async () => {
        const symbol = await contract.symbol()
        assert.equal(symbol, 'COL')
    });
    
    describe('minting', async () => {
        it('creates a new token', async() => {
            const result = await contract.mint('#ECEEEE')
            const totalSupply = await contract.totalSupply()
            assert.equal(totalSupply, 1)
            const event = result.logs[0].args
            assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
            assert.equal(event.to, accounts[0], 'to is correct')
            assert.equal(event.from, 0x0, 'from is correct')

            //failure test
            await contract.mint('#ECEEEE').should.be.rejected;
        })
    })

    describe('indexing', async () => {
        it('lists colors', async () => {
            await contract.mint('#FFFFFF')
            await contract.mint('#000000')
            await contract.mint('#FF0000')
            const totalSupply = await contract.totalSupply()

            let color
            let results = []

            for(var i = 1; i <= totalSupply; i++) {
                color = await contract.colors(i - 1)
                results.push(color)
            }
            let expected = ['#ECEEEE','#FFFFFF', '#000000', '#FF0000']
            assert.equal(results.join(','), expected.join(','))
        })
    })
})