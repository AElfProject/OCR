const testContract = artifacts.require("AccessControlledOffchainAggregator");
const LinkContract = artifacts.require("MockLinkToken");

contract('master chef', (accounts) => {
    it('single one observation', async () => {
        const testfInstance = await testContract.deployed();
        const linkTokenInstance = await LinkContract.deployed();
        let transmitterOne = accounts[0];
        let payeeOne = accounts[1];
        let transmitterTwo = accounts[3];
        let payeeTwo = accounts[4];

        let signerOneAddress = "0x824b3998700F7dcB7100D484c62a7b472B6894B6";
        let signerOnePrivateKey = "7f6965ae260469425ae839f5abc85b504883022140d5f6fc9664a96d480c068d";

        let signerTwoAddress = "0x90aE559e07f46eebF91bD95DD28889ef60A1E87B";
        let signerTwoPrivateKey = "996e00ecd273f49a96b1af85ee24b6724d8ba3d9957c5bdc5fc16fd1067d542a";

        let transmiters = [transmitterOne, transmitterTwo];
        let payees = [payeeOne, payeeTwo];
        let signers = [signerOneAddress, signerTwoAddress];

        let configVersion = 1;
        let encoded = "0x012df";

        await testfInstance.setPayees(transmiters, payees);
        await testfInstance.setConfig(signers, transmiters, configVersion, encoded);
        let config = await testfInstance.latestConfigDetails();
        //console.log(config.configDigest);

        let report = "0x000000000000f6f3ed664fd0e7be332f035ec351acf1000000000000000a0007000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f0a056173646173000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000000";
        const messageHash = web3.utils.sha3(report);
        let signatureOne = web3.eth.accounts.sign(messageHash, signerOnePrivateKey);
        let signatureTwo = web3.eth.accounts.sign(messageHash, signerTwoPrivateKey);

        // console.log(signatureOne.r);
        // console.log(signatureOne.s);
        // console.log(signatureOne.v);
        let rs = [signatureOne.r, signatureTwo.r];
        let ss = [signatureOne.s, signatureTwo.s];
        let vs = web3.utils.bytesToHex([signatureOne.v, signatureTwo.v, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0]);
        await testfInstance.transmit(report, rs, ss, vs);
        let latestAnswer = await testfInstance.latestAnswer();
        assert.equal(latestAnswer['0'], "0x0a05617364617300000000000000000000000000000000000000000000000000", "wrong latest answer");
        assert.equal(latestAnswer['1'], 7, "wrong latest answer length");
        assert.equal(latestAnswer['2'], "0x0000000000000000000000000000000000000000000000000000000000000000", "observations's index should all be 0s");
        assert.equal(latestAnswer['3'], "0x0000000000000000000000000000000000000000000000000000000000000000", "observations's data valid bytes should all be 0s");
        assert.equal(latestAnswer['4'].length, 0, "observations should be all 0s");
        let latestRound = await testfInstance.latestRound();
        assert.equal(latestRound, 10, "wrong round id");

        let payeeOneBal = await linkTokenInstance.balanceOf(payeeOne);
        assert.equal(payeeOneBal, 0, "before withrawing, balance should be 0");
        let owedPayment = await testfInstance.owedPayment(transmitterOne);

        let depositAmount = '100000000000000000000000';
        await linkTokenInstance.deposit(testContract.address, depositAmount);
        await testfInstance.withdrawPayment(transmitterOne, {from: payeeOne});
        payeeOneBal = await linkTokenInstance.balanceOf(payeeOne);
        assert.equal(payeeOneBal.toString(), owedPayment.toString(), "withdraw failed");
    });

    it('multiple observations', async () => {
        const testfInstance = await testContract.deployed();
        const linkTokenInstance = await LinkContract.deployed();
        let transmitterOne = accounts[0];
        let payeeOne = accounts[1];
        let transmitterTwo = accounts[3];
        let payeeTwo = accounts[4];

        let signerOneAddress = "0x824b3998700F7dcB7100D484c62a7b472B6894B6";
        let signerOnePrivateKey = "7f6965ae260469425ae839f5abc85b504883022140d5f6fc9664a96d480c068d";

        let signerTwoAddress = "0x90aE559e07f46eebF91bD95DD28889ef60A1E87B";
        let signerTwoPrivateKey = "996e00ecd273f49a96b1af85ee24b6724d8ba3d9957c5bdc5fc16fd1067d542a";

        let transmiters = [transmitterOne, transmitterTwo];
        let payees = [payeeOne, payeeTwo];
        let signers = [signerOneAddress, signerTwoAddress];

        let configVersion = 1;
        let encoded = "0x012df";

        await testfInstance.setPayees(transmiters, payees);
        await testfInstance.setConfig(signers, transmiters, configVersion, encoded);
        let config = await testfInstance.latestConfigDetails();
        //console.log(config.configDigest);

        let report = "0x00000000000022d6f8928689ea183a3eb24df3919a94000000000000000b0320000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a080001020000000000000000000000000000000000000000000000000000000000060606000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000030a0431203a3400000000000000000000000000000000000000000000000000000a0431203a3500000000000000000000000000000000000000000000000000000a0431203a360000000000000000000000000000000000000000000000000000";
        const messageHash = web3.utils.sha3(report);
        let signatureOne = web3.eth.accounts.sign(messageHash, signerOnePrivateKey);
        let signatureTwo = web3.eth.accounts.sign(messageHash, signerTwoPrivateKey);

        // console.log(signatureOne.r);
        // console.log(signatureOne.s);
        // console.log(signatureOne.v);
        let rs = [signatureOne.r, signatureTwo.r];
        let ss = [signatureOne.s, signatureTwo.s];
        let vs = web3.utils.bytesToHex([signatureOne.v, signatureTwo.v, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0]);
        await testfInstance.transmit(report, rs, ss, vs);
        let latestAnswer = await testfInstance.latestAnswer();
        //console.log(latestAnswer);
        assert.equal(latestAnswer['0'], "0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08", "wrong latest answer");
        assert.equal(latestAnswer['1'], 32, "wrong latest answer length");
        assert.equal(latestAnswer['2'], "0x0001020000000000000000000000000000000000000000000000000000000000", "invalid observations's index");
        assert.equal(latestAnswer['3'], "0x0606060000000000000000000000000000000000000000000000000000000000", "observations's data valid bytes should all be 6");
        assert.equal(latestAnswer['4'].length, 3, "observations's count should be 3");
        assert.equal(latestAnswer['4'][0], "0x0a0431203a340000000000000000000000000000000000000000000000000000", "invalid observation at index 0");
        assert.equal(latestAnswer['4'][1], "0x0a0431203a350000000000000000000000000000000000000000000000000000", "invalid observation at index 1");
        assert.equal(latestAnswer['4'][2], "0x0a0431203a360000000000000000000000000000000000000000000000000000", "invalid observation at index 2");
        let latestRound = await testfInstance.latestRound();
        assert.equal(latestRound, 11, "wrong round id");
    });
});


