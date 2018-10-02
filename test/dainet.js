const Token = artifacts.require('./dainet.sol');
const assert = require('assert');

var contractInstance;

contract('Dainet', function (accounts) {

    var tsup = 1300000000000000000000000000;
    var tosel = 845000000000000000000000000;
    var unitsPeth = 2000;
    var unitsPethChange = 1000;
    contractInstance = Token.deployed();

    it("Total supply should be " + tsup, function () {
        return Token.deployed().then(function (instance) {
            var token = instance;
            return token.totalSupply.call();
        }).then(function (result) {
            assert.equal(result.toNumber(), tsup, 'Total supply is wrong');
        })
    });



    it("Balance of token owner should be: " + tsup, function () {
        var token;
        return Token.deployed().then(function (instance) {
            token = instance;
            return token.balanceOf.call(accounts[0]);
        }).then(function (result) {
            assert.equal(result.toNumber(), tsup, 'Balance of token owner is wrong');
        })
    });

    it("Balance of token to sell should be: " + tosel, function () {
        var token;
        return Token.deployed().then(function (instance) {
            token = instance;
            return token.maxDainSell.call();
        }).then(function (result) {
            assert.equal(result.toNumber(), tosel, 'Balance to sell is wrong');
        })
    });


    it("Rate of sell sholud be: " + unitsPeth, function () {
        var token;
        return Token.deployed().then(function (instance) {
            token = instance;
            return token.unitsPerEth.call();
        }).then(function (result) {
            assert.equal(result.toNumber(), unitsPeth, 'Sell rate is wrong');
        })
    });


    it("Rate of sell after change shuld be: " + unitsPethChange, function () {
        var token;
        return Token.deployed().then(function (instance) {
            token = instance;
            token.changeUnitsPerEth(unitsPethChange);
            return token.unitsPerEth.call();
        }).then(function (result) {
            assert.equal(result.toNumber(), unitsPethChange, 'Sell rate after change is wrong');
        })
    });


    it("One ETH should buy Dainet Tokens in amount: " + unitsPethChange, function () {
        var token;
        var tosend = 1;
        return Token.deployed().then(function (instance) {
            token = instance;
            const tokenAddress = instance.address;
            const nodeToken = Token.at(tokenAddress);

            const data = instance.sendTransaction({from: accounts[6], value: web3.toWei(tosend, "ether")});

            const tokenAmount = nodeToken.balanceOf(accounts[6]);
            return tokenAmount;
        }).then(function (result) {
            var sum = unitsPethChange * web3.toWei(tosend, "ether");
            assert.equal(result.toNumber(), sum, 'The sender did not receive the tokens as per rate');
        })
    });

    it("Need revert exception when sending lower then a minimum transaction", function () {
        var token;
        var tosend = 0.04;// minimum is 0.05

        return Token.deployed().then(function (instance) {
            token = instance;
            const tokenAddress = instance.address;
            const nodeToken = Token.at(tokenAddress);

            instance.sendTransaction({from: accounts[4], value: (web3.toWei(tosend, "ether"))}, function(error){
                // 
            });
            
            const tokenAmount = nodeToken.balanceOf(accounts[4]);
            return tokenAmount;
        }).then(function (result) {
            assert.equal(result.toNumber(), 0, 'Something went wrong');
        });
    });

});
