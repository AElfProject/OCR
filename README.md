# AElf - OCR Contract

## 布置合约

AELINK Token contract => SimpleWriteAccessController contract => AccessControlledOffchainAggregator contract

migrations中有具体的配置信息。

## 初始化合约

1. 设置payee信息，AccessControlledOffchainAggregator contract： setPayees。
2. 设置节点配置信息，AccessControlledOffchainAggregator contract： setConfig。
3. 打入AELink token到AccessControlledOffchainAggregator合约地址。

## 经济系统

1. transmitter搬运数据获得AELink的补偿。
计算思路：估算用户transmit交易大概花费的gas fee， 按照一定比例换算成AELink。

2. aelf上搬运数据的节点获得AELink。
计算思路：按照用户在AElf上搬运数据的次数进行支付AELink。

3. 使用

## 合约主要api

### **设置收费地址(setPayees)**

```plain
  function setPayees(
    address[] calldata _transmitters,
    address[] calldata _payees
  )
    external
    onlyOwner()
    
  event PayeeshipTransferred(
    address indexed transmitter,
    address indexed previous,
    address indexed current
  );
```
由合约owner调用，用于设置transmitter的收费地址。
* **输入参数**
    * **_transmitters**: 数据提交者的地址。
    * **_payees**:**配置版本。
* **PayeeshipTransferred事件**
    * **transmitter**: transmitter的地址。
    * **previous**: transmiiter前一次收费地址。
    * **current**: transmitter当前的收费地址。

## 签名工具
参考AElfProject/aelf-oracle项目中的Contracts/ReportGenerator。
