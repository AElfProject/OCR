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

        let signerOneAddress = "0x824b3998700F7dcB7100D484c62a7b472B6894B6";  // generate on aelf
        //let signerOnePrivateKey = "7f6965ae260469425ae839f5abc85b504883022140d5f6fc9664a96d480c068d";
        let signerOneR = "0xdf3895ed02447160699037386795a014bbefbea7a9ad3c3973b502dc8cfb5738";
        let signerOneS = "0x40fcc076303729f58aa114be00fc0446593be6659956c45646c311a84f01507c";
        let signerOneV = 0;

        let signerTwoAddress = "0x90aE559e07f46eebF91bD95DD28889ef60A1E87B";  // generated on aelf
        //let signerTwoPrivateKey = "996e00ecd273f49a96b1af85ee24b6724d8ba3d9957c5bdc5fc16fd1067d542a";
        let signerTwoR = "0x89d764aaca08b717422ccbf5fb173fd3e6b0954407a15392128b214b6f6fed21";
        let signerTwoS = "0x6809eaf90021b8e53ca0e8ed4123e1e85a559f5110cf9d5da353e8d88b79203b";
        let signerTwoV = 1;

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
        let rs = [signerOneR, signerTwoR];
        let ss = [signerOneS, signerTwoS];
        let vs = web3.utils.bytesToHex([signerOneV, signerTwoV, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0]);
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

        let signerOneAddress = "0x824b3998700F7dcB7100D484c62a7b472B6894B6";  // generated on aelf
        //let signerOnePrivateKey = "7f6965ae260469425ae839f5abc85b504883022140d5f6fc9664a96d480c068d";
        let signerOneR = "0x366740b1d0afaed7dcabe6008068675a8e65a8cdaa4ed1b2f042ddcec9c242d7";
        let signerOneS = "0x13afc3c576972824fe5d252c7276639710ff1ee45330948bf335c086241ea8a6";
        let signerOneV = 1;


        let signerTwoAddress = "0x90aE559e07f46eebF91bD95DD28889ef60A1E87B";  // generated on aelf
        //let signerTwoPrivateKey = "996e00ecd273f49a96b1af85ee24b6724d8ba3d9957c5bdc5fc16fd1067d542a";
        let signerTwoR = "0x446dfa1ada5c498c5c689ae0a7c28d8e7f9632465f17574a7841f2c630538e80";
        let signerTwoS = "0x30974bcb26f23d06f9af47798fd4bc234d03cc3a1467f90a06943c5b2dda1109";
        let signerTwoV = 0;

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
        let rs = [signerOneR, signerTwoR];
        let ss = [signerOneS, signerTwoS];
        let vs = web3.utils.bytesToHex([signerOneV, signerTwoV, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0]);
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

        let transmitOneObservationCount = await testfInstance.oracleObservationCount(transmitterOne);
        assert.equal(transmitOneObservationCount.toString(), 0, "wrong round id");
        console.log(transmitOneObservationCount.toString());

        let transmitTwoObservationCount = await testfInstance.oracleObservationCount(transmitterTwo);
        assert.equal(latestRound, 11, "wrong round id");
        console.log(transmitTwoObservationCount.toString());
    });

    it('configuration test', async () => {
        const testfInstance = await testContract.deployed();
        await testfInstance.requestNewRound();
        let requestNewRoundEvent = (await testfInstance.getPastEvents('RoundRequested'))[0].returnValues;
        assert.equal(requestNewRoundEvent.requester, accounts[0], "invalid requester info");
        assert.equal(requestNewRoundEvent.roundId, 11, "current round id should be 11");
        await testfInstance.setBilling(1000, 500, 400, 500, 800);
        let billingInfo = await testfInstance.getBilling();
        assert.equal(billingInfo.maximumGasPrice, 1000, "wrong maximumGasPrice");
        assert.equal(billingInfo.reasonableGasPrice, 500, "wrong reasonableGasPrice");
        assert.equal(billingInfo.microLinkPerEth, 400, "wrong microLinkPerEth");
        assert.equal(billingInfo.linkGweiPerObservation, 500, "wrong linkGweiPerObservation");
        assert.equal(billingInfo.linkGweiPerTransmission, 800, "wrong linkGweiPerTransmission");
    });
});


