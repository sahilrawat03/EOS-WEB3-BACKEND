const metadata = require("../../metadata/allItems.json");
const { getBalanceOfBatch, getBalanceOfBatchSingle } = require("./item.js");
// sending & signing web3 tx
const send = async (web3, signer, transaction) => {
  const options = {
    to: transaction._parent._address,
    data: transaction.encodeABI(),
    gas: await transaction.estimateGas({ from: signer.address }),
    gasPrice: await web3.eth.getGasPrice(),
    nonce: await web3.eth.getTransactionCount(signer.address, "pending"),
  };
  const signed = await web3.eth.accounts.signTransaction(
    options,
    signer.privateKey
  );
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
  return receipt;
};

// Helper function to get the transaction receipt
const getTransactionReceipt = async (
  web3Http,
  transactionHash,
  maxAttempts = 5
) => {
  let attempts = 0;

  const getReceipt = async () => {
    attempts++;
    try {
      const receipt = await web3Http.eth.getTransactionReceipt(transactionHash);
      if (receipt) return receipt;

      if (attempts < maxAttempts) {
        console.log(
          `Receipt not found, retrying... Attempt ${attempts}/${maxAttempts}`
        );
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return getReceipt();
      } else {
        throw new Error("Transaction receipt not found after maximum attempts");
      }
    } catch (error) {
      throw error;
    }
  };

  return getReceipt(); // Start the recursive attempt process
};

const checkRpcValid = async (contract) => {
  try {
    if ((await contract.methods.itemIds().call()) > 0) return true;
    else return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getNameOfItemByID = async (id) => {
  try {
    // length is the ID value which we can get from the allItems.json metadata sum file
    return metadata.items[id].name;
  } catch (err) {
    console.log(err);
  }
};

const collectItemsFromBlockchain = async (address, itemContractFuse) => {
  try {
    const itemsOnChainSummary = [];

    const itemIds = await itemContractFuse.methods.itemIds().call();

    // collect items from Fuse
    const itemsOnFuse = await getBalanceOfBatchSingle(
      itemIds,
      address,
      itemContractFuse
    );

    // summarizing them
    // length is the highest ID value which we can get from the allItems.json metadata sum file
    for (let i = 0; i <= metadata.items[metadata.items.length - 1].id; ++i) {
      itemsOnChainSummary.push(Number(itemsOnFuse[i]));
    }

    // count the amount of items for each type
    const itemOnChainAmounts = new Map();
    for (let i = 0; i < itemsOnChainSummary.length; ++i) {
      // ID (index) => [amount of that item type on all blockchains, name]
      itemOnChainAmounts.set(i, [
        itemsOnChainSummary[i],
        metadata.items[i].name,
      ]);
    }

    return itemOnChainAmounts;
  } catch (err) {
    console.log(err);
  }
};

const sumItemsFromBlockchainBatch = async (itemIds, itemsOnFuse) => {
  let itemsOnChainSummary = [];
  try {
    // summarizing them
    // length is the highest ID value which we can get from the allItems.json metadata sum file
    for (let i = 0; i <= itemIds; ++i) {
      itemsOnChainSummary.push(Number(itemsOnFuse[i]));
    }

    // count the amount of items for each type
    const itemOnChainAmounts = new Map();
    for (let i = 0; i < itemsOnChainSummary.length; ++i) {
      // ID (index) => [amount of that item type on all blockchains, name]
      itemOnChainAmounts.set(i, [
        itemsOnChainSummary[i],
        metadata.items[i].name,
      ]);
    }
    return itemOnChainAmounts;
  } catch (err) {
    console.log(err);
  }
};

const collectItemsFromBlockchainBatch = async (
  itemIds,
  addresses,
  itemContractFuse
) => {
  console.log("Collecting all addresses and blockchain balances.");
  try {
    const balancesArrayFuse = await getBalanceOfBatch(
      itemIds,
      addresses,
      itemContractFuse
    );

    const addressBalances = {};

    console.log("Summarizing balances from all blockchains.");
    for (let i = 0; i < addresses.length; ++i) {
      let tempArrayBalancesFuse = [];
      for (let id = 0; id <= itemIds; ++id) {
        tempArrayBalancesFuse[id] = balancesArrayFuse[id][i];
      }

      addressBalances[addresses[i]] = await sumItemsFromBlockchainBatch(
        itemIds,
        tempArrayBalancesFuse
      );
    }

    return addressBalances;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  send,
  getTransactionReceipt,
  checkRpcValid,
  getNameOfItemByID,
  collectItemsFromBlockchain,
  collectItemsFromBlockchainBatch,
  sumItemsFromBlockchainBatch,
};
