const CustomERC20 = artifacts.require('CustomERC20');

contract('CustomERC20', accounts => {
    let instance;

    beforeEach(async () => {
        instance = await CustomERC20.new("Salva", "SBR");
    });

    console.table(accounts);

    it('should have Salva as a name', async () => {
        let name = await instance.name.call();

        assert.equal(name, "Salva");
    });

    it('should have SBR as a symbol', async () => {
        let symbol = await instance.symbol.call();

        assert.equal(symbol, "SBR");
    });

    it('should have 18 decimals', async () => {
        let decimals = await instance.decimals.call();

        assert.equal(decimals, 18);
    });

    it('should deploy 1000 tokens from scratch', async () => {
        let totalInitialSuppy = await instance.totalSupply.call();
        assert.equal(totalInitialSuppy, 0);

        await instance.createTokens();

        totalInitialSuppy = await instance.totalSupply.call();
        assert.equal(totalInitialSuppy, 1000);

        let contractOwnerBalance = await instance.balanceOf.call(accounts[0]);
        assert.equal(contractOwnerBalance, 1000);
    });

    it('should transfer from contract owner (account 0) to account 1', async () => {
        await instance.createTokens();

        await instance.transfer(accounts[1], 10, { from: accounts[0] });

        let contractOwnerBalance = await instance.balanceOf.call(accounts[0]);
        assert.equal(contractOwnerBalance, 990);

        let destinyBalance = await instance.balanceOf.call(accounts[1]);
        assert.equal(destinyBalance, 10);
    });

    it('should approve, allowance & transferFrom', async () => {
        await instance.createTokens();

        let initialAllowance = await instance.allowance(accounts[0], accounts[1]);
        assert.equal(initialAllowance, 0);

        await instance.approve(accounts[1], 100, { from: accounts[0] });
        let currentAllowance = await instance.allowance(accounts[0], accounts[1]);
        assert.equal(currentAllowance, 100);

        let address1BalanceWithAllowance = await instance.balanceOf.call(accounts[1]);
        assert.equal(address1BalanceWithAllowance, 0);

        await instance.transferFrom(accounts[0], accounts[2], 100, { from: accounts[1] });
        let allowanceAfterTranfer = await instance.allowance(accounts[0], accounts[1]);
        assert.equal(allowanceAfterTranfer, 0);

        let address2BalanceAfterTransferingFrom = await instance.balanceOf.call(accounts[2]);
        assert.equal(address2BalanceAfterTransferingFrom, 100);
    });

    it('should increaseAllowance & decreaseAllowance', async () => {
        await instance.createTokens();
        
        await instance.approve(accounts[5], 100, { from: accounts[0] });
        let allowanceForAccount5 = await instance.allowance(accounts[0], accounts[5]);
        assert.equal(allowanceForAccount5, 100);

        await instance.increaseAllowance(accounts[5], 200);

        let newAllowanceForAccount5 = await instance.allowance(accounts[0], accounts[5]);
        assert.equal(newAllowanceForAccount5, 300);

        await instance.decreaseAllowance(accounts[5], 50);

        let newAllowanceForAccount5AfterDecreasing = await instance.allowance(accounts[0], accounts[5]);
        assert.equal(newAllowanceForAccount5AfterDecreasing, 250);
    });
});