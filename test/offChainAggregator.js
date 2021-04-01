const testContract = artifacts.require("AccessControlledOffchainAggregator");

contract('master chef', (accounts) => {
    it('eth util', async () => {
        const testfInstance = await testContract.deployed();
        let transmitterOne = accounts[0];
        let payeeOne = accounts[1];
        let transmitterTwo = accounts[3];
        let payeeTwo = accounts[4];

        let signerOneAddress = "0x824b3998700F7dcB7100D484c62a7b472B6894B6";
        let sinnerOnePrivateKey = "7f6965ae260469425ae839f5abc85b504883022140d5f6fc9664a96d480c068d";

        let signerTwoAddress = "0x90aE559e07f46eebF91bD95DD28889ef60A1E87B";
        let sinnerTwoPrivateKey = "996e00ecd273f49a96b1af85ee24b6724d8ba3d9957c5bdc5fc16fd1067d542a";

        

        let transmiters = [transmitterOne, transmitterTwo];
        let payees = [payeeOne, payeeTwo];
        let signers = [signerOneAddress, signerTwoAddress];

        let configVersion = 1;
        let encoded = "0x012df";

        await testfInstance.setPayees(transmiters, payees);
        await testfInstance.setConfig(signers, transmiters, configVersion, encoded);
        let config = await testfInstance.latestConfigDetails();
        //console.log(config.configDigest);


        let report = "0x000000000000f6f3ed664fd0e7be332f035ec351acf1000000000000000a030700040a00000000000000000000000000000000000000000000000000000000000a05617364617300000000000000000000000000000000000000000000000000";
        const messageHash = web3.utils.sha3(report);
        let signatureOne = web3.eth.accounts.sign(messageHash, sinnerOnePrivateKey);
        let signatureTwo = web3.eth.accounts.sign(messageHash, sinnerTwoPrivateKey);
        let rs = [signatureOne.r, signatureTwo.r];
        let ss = [signatureOne.s, signatureTwo.s];
        let vs = web3.utils.bytesToHex([signatureOne.v, signatureTwo.v, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0]);
        await testfInstance.transmit(report, rs, ss, vs);
        //await testInstance.verifySign3(report, signature.r, signature.s, signature.v);
        


        // function transmit(
        //     // NOTE: If these parameters are changed, expectedMsgDataLength and/or
        //     // TRANSMIT_MSGDATA_CONSTANT_LENGTH_COMPONENT need to be changed accordingly
        //     bytes calldata _report,
        //     bytes32[] calldata _rs,
        //     bytes32[] calldata _ss,
        //     bytes32 _rawVs // signatures
        // ) external {
    });
});


