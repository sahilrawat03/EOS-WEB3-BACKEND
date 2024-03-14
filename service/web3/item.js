const { sleep } = require("../../utils/utils");

// index means the ID of the token
const getBalanceOf = async (address, contract) => {
  let result = [];
  try {
    const itemIds = await contract.methods.itemIds().call();
    for (let i = 0; i <= itemIds; ++i) {
      await sleep(200);
      result[i] = await contract.methods.balanceOf(address, i).call();
    }
  } catch (err) {
    console.log(err);
  }

  return result;
};

// index means the ID of the token
const getBalanceOfBatch = async (itemIds, addresses, contract) => {
  let result = [];
  try {
    for (let id = 0; id <= itemIds; ++id) {
      let ids = [];
      for (let j = 0; j < addresses.length; ++j) ids[j] = id;
      const balances = await contract.methods
        .balanceOfBatch(addresses, ids)
        .call();
      result.push(balances);
      await sleep(50);
    }
  } catch (err) {
    console.log(err);
    return result;
  }

  return result;
};

const getBalanceOfBatchSingle = async (itemIds, address, contract) => {
  try {
    let ids = [];
    let addresses = [];
    // filling an array with the IDs as a serial
    for (let i = 0; i <= itemIds; ++i) ids[i] = i;
    // filling an array with the same address the amount of IDs long so we only need one call with balanceBatch
    for (let i = 0; i <= itemIds; ++i) addresses[i] = address;

    const balance = await contract.methods
      .balanceOfBatch(addresses, ids)
      .call();

    await sleep(50);

    return await balance;
  } catch (err) {
    console.log(err);
  }
  return [];
};

const mintFreeNFT = async (
  web3Http,
  itemContractHttp,
  id,
  amount,
  addressTo
) => {
  const tx = await itemContractHttp.methods.mintWithRole(
    id,
    amount,
    addressTo,
    false
  );
  const signer = await web3Http.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );

  let mintProcessingPromise = Promise.resolve();
  let txHash;
  try {
    await mintProcessingPromise;
    await send(web3Http, signer, tx).then(async (mintReceipt) => {
      txHash = await mintReceipt.transactionHash;
    });
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    mintProcessingPromise = Promise.resolve();
  }

  return await txHash;
};

module.exports = {
  getBalanceOf,
  getBalanceOfBatch,
  getBalanceOfBatchSingle,
  mintFreeNFT,
};
