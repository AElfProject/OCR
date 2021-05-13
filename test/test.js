const MyTest = artifacts.require("Test");

contract('MyTest', (accounts) => {
  it('code test', async () => {
    const testInstance = await MyTest.deployed();
    await testInstance.generateBytes32("0x123456789abcd");
    let a = await testInstance.bytes32v();
    let b = await testInstance.decodeBytes32(a);
    let context = "0x0000000000000000000000070707070707070707070707070707070000001010";
    let observers = "0x0001020304000000000000000000000000000000000000000000000000000000";
    let dataList = ["0x000000000000000000000000000000000000000000000000000000000000007b",
    "0x00000000000000000000000000000000000000000000000000000000000000f5",
    "0x0000000000000000000000000000000000000000000000000000000000c99dc3",
    "0x000000000000000000000000000000000000000000000000000070100b76d385",
    "0x0000000000000000000000000000000000000000000000000000000000000001"];
    await testInstance.generate(context, observers, dataList);
    let report = await testInstance.report();
    let myCode = "0x0000000000000000000000070707070707070707070707070707070000001010000102030400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000000007b00000000000000000000000000000000000000000000000000000000000000f50000000000000000000000000000000000000000000000000000000000c99dc3000000000000000000000000000000000000000000000000000070100b76d3850000000000000000000000000000000000000000000000000000000000000001";
    assert.equal(myCode, report, "invalid format");
    let reportStr = myCode;
    const messageHash = web3.utils.sha3(reportStr);
    let userOne = web3.eth.accounts.create(web3.utils.randomHex(32));
    let signature = web3.eth.accounts.sign(messageHash, userOne.privateKey);
    await testInstance.verifySign3(report, signature.r, signature.s, signature.v);
    let hash = await testInstance.reportHash();
    let signer = await testInstance.publicKey();
    assert.equal(signer, userOne.address, "invalid sign");
  });

  it('sha test', async () => {
    const testInstance = await MyTest.deployed();
    let context = "0x0000000000000000000000070707070707070707070707070707070000001010";
    let observers = "0x0001020304000000000000000000000000000000000000000000000000000000";
    let dataList = ["0x000000000000000000000000000000000000000000000000000000000000007b",
    "0x00000000000000000000000000000000000000000000000000000000000000f5",
    "0x0000000000000000000000000000000000000000000000000000000000c99dc3",
    "0x000000000000000000000000000000000000000000000000000070100b76d385",
    "0x0000000000000000000000000000000000000000000000000000000000000001"];
    await testInstance.generate(context, observers, dataList);
    let report = await testInstance.report();
    let sha = await testInstance.calSha256(report);
    let hashFromAelf = "0x90c8905400249e6c663ca108c82090230601e91f0d2577c67d6c428dbe175f39";
    assert.equal(sha, hashFromAelf, "invalid hash op");
  });

  it('decode report', async () => {
    const testInstance = await MyTest.deployed();
    let encodeData = "0x00000000000007070707070707070707070707070707000000000000000a030700040a00000000000000000000000000000000000000000000000000000000000a05617364617300000000000000000000000000000000000000000000000000";
    let decodeData = await testInstance.decodeReport2(encodeData);
    assert.equal(decodeData.roundId, 10, "invalid round id");
    assert.equal(decodeData.observerCount, 3, "invalid observerCount");
    assert.equal(decodeData.validBytesCount, 7, "invalid validBytesCount");
    assert.equal(decodeData.observation, "0x0a05617364617300000000000000000000000000000000000000000000000000", "invalid observation");
    assert.equal(decodeData.rawObservers, "0x00040a0000000000000000000000000000000000000000000000000000000000", "invalid observation");

    encodeData = "0x00000000000007070707070707070707070707070707000000000000000a033500040a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000020a33617364617361736461736464e890a8e58da1e698afe59296e595a1e590a7e698afe59296e595a1e590a7e5bab7e5b888e582850000000000000000000000";
    decodeData = await testInstance.decodeReport3(encodeData);
    assert.equal(decodeData.dataCount, 53, "report 3 decode invalid data count");
    assert.equal(decodeData.data[0], "0x0a33617364617361736461736464e890a8e58da1e698afe59296e595a1e590a7", "report 3 decode invalid data");
    assert.equal(decodeData.data[1], "0xe698afe59296e595a1e590a7e5bab7e5b888e582850000000000000000000000", "report 3 decode invalid data");
  });

  it('fee test', async () => {
    const testInstance = await MyTest.deployed();
    let gweiAmount = await testInstance.getGweiAmount();
    assert.equal(gweiAmount.toString(), 1000000000);
    let gasPrice = await testInstance.getGasPrice();
    //console.log(gasPrice.toString());
  });

  it('decode 4 with multple observations test', async () => {
    const testInstance = await MyTest.deployed();
    let encodeData = "0x000000000000f6f3ed664fd0e7be332f035ec351acf1000000000000000a0307000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e00000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e000a056173646173000000000000000000000000000000000000000000000000000001020000000000000000000000000000000000000000000000000000000000060606000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000030a0431203a3400000000000000000000000000000000000000000000000000000a0431203a3500000000000000000000000000000000000000000000000000000a0431203a360000000000000000000000000000000000000000000000000000";
    let decodeData = await testInstance.decodeReport4(encodeData);
    assert.equal(decodeData._observerOrder.length, 3, "invalid _observerOrder");
    assert.equal(decodeData._observerOrder[0], 0, "invalid _observerOrder one");
    assert.equal(decodeData._observerOrder[1], 1, "invalid _observerOrder two");
    assert.equal(decodeData._observerOrder[2], 2, "invalid _observerOrder three");
    assert.equal(decodeData._validBytesCount.toString(), 7, "invalid _validBytesCount");
    assert.equal(decodeData._aggregateData, "0x0a05617364617300000000000000000000000000000000000000000000000000", "invalid _aggregateData");
    assert.equal(decodeData._observations.length, 3, "invalid _observations");
    assert.equal(decodeData._observations[0], "0x0a0431203a340000000000000000000000000000000000000000000000000000", "invalid _observations one");
    assert.equal(decodeData._observations[1], "0x0a0431203a350000000000000000000000000000000000000000000000000000", "invalid _observations two");
    assert.equal(decodeData._observations[2], "0x0a0431203a360000000000000000000000000000000000000000000000000000", "invalid _observations three");
    assert.equal(decodeData._observationsLength.length, 3, "invalid _observerOrder");
    assert.equal(decodeData._observationsLength[0].toString(), 6, "invalid _observerOrder one");
  });

  it('decode 4 with multple observations test2', async () => {
    const testInstance = await MyTest.deployed();
    let encodeData = "0x00000000000022d6f8928689ea183a3eb24df3919a94000000000000000b0320000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a080001020000000000000000000000000000000000000000000000000000000000060606000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000030a0431203a3400000000000000000000000000000000000000000000000000000a0431203a3500000000000000000000000000000000000000000000000000000a0431203a360000000000000000000000000000000000000000000000000000";
    let decodeData = await testInstance.decodeReport4(encodeData);
    assert.equal(decodeData._count.toString(), 3, "invalid count");
    assert.equal(decodeData._observerCount, "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f", "invalid _observerCount");
  });

  it('decode 4 with single observation test', async () => {
    const testInstance = await MyTest.deployed();
    let encodeData = "0x000000000000f6f3ed664fd0e7be332f035ec351acf1000000000000000a0007000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e00000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e000a056173646173000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000000";
    let decodeData = await testInstance.decodeReport4(encodeData);
    assert.equal(decodeData._observerOrder.length, 0, "invalid _observerOrder");
    assert.equal(decodeData._validBytesCount.toString(), 7, "invalid _validBytesCount");
    assert.equal(decodeData._aggregateData, "0x0a05617364617300000000000000000000000000000000000000000000000000", "invalid _aggregateData");
    assert.equal(decodeData._observations.length, 0, "invalid _observations");
    assert.equal(decodeData._observationsLength.length, 0, "invalid _observerOrder");
  });

  it('sign verification', async () => {
    const testInstance = await MyTest.deployed();
    let report = "0x000000000000f6f3ed664fd0e7be332f035ec351acf1000000000000000a0007000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f0a056173646173000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000000";
    let address = "0x824b3998700F7dcB7100D484c62a7b472B6894B6";
    let privateKey = "7f6965ae260469425ae839f5abc85b504883022140d5f6fc9664a96d480c068d";
    let hashData = "0x8075a4369dda42e20fa41f7fa2f477ba6fcecfdf0edcdc86979ffdbaac0cad77";
    let v = "0x00";
    let r = "0xdf3895ed02447160699037386795a014bbefbea7a9ad3c3973b502dc8cfb5738";
    let s = "0x40fcc076303729f58aa114be00fc0446593be6659956c45646c311a84f01507c";
    let recoverAddress = await testInstance.recoverAddress(hashData, v,r,s)
    assert.equal(recoverAddress, address, "invalid _observerOrder");
  });
  
  it('test bytes copy', async () => {
    const testInstance = await MyTest.deployed();
    let a = await testInstance.getString("lw", 2);
    console.log(a);
  });
});

