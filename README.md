# AElf - OCR Contract

## Getting Started

### 布置合约

AELINK Token contract => SimpleWriteAccessController contract => AccessControlledOffchainAggregator contract

migrations中有具体的配置信息。

### 初始化合约

1. 设置payee信息，AccessControlledOffchainAggregator contract： setPayees。
2. 设置节点配置信息，AccessControlledOffchainAggregator contract： setConfig。
3. 打入AELink token到AccessControlledOffchainAggregator合约地址。

### 经济系统

1. transmitter搬运数据获得AELink的补偿。
计算思路：估算用户transmit交易大概花费的gas fee， 按照一定比例换算成AELink。

2. aelf上搬运数据的节点获得AELink。
计算思路：按照用户在AElf上搬运数据的次数进行支付AELink。

### 合约api


### 签名工具

Tool/sign.js
- report： aelf上的report信息。
- private key： 签名需要的私钥。
