const {
  queryAllNftItemsByUser,
  addItem,
  removeItemInventory,
  isItemValidToTransmute,
  updateItemIsOnBlockchain,
} = require("../character_inventory");
const {
  queryAllEquippedNftItemsByUser,
  removeItemEquipment,
} = require("../character_equipment");
const { queryUsernameByAddress, queryAllAddresses } = require("../accounts");
const { bufferMessage } = require("../../utils/utils.js");
const {
  collectItemsFromBlockchainBatch,
  collectItemsFromBlockchain,
} = require("./utils.js");
const metadata = require("../../metadata/allItems.json");

// collecting NFT items from the inventory and equipment
const collectItemsFromMySQL = async (username) => {
  const itemsOffChainInventory = [];
  const itemsOffChainEquipment = [];
  let itemsOffChain = []; // merged (inventory + equipment)
  try {
    // from inventory
    await queryAllNftItemsByUser(username).then(async (itemsMySQLInventory) => {
      for (let i = 0; i < (await itemsMySQLInventory.length); ++i) {
        // get ID of item
        const itemNameMySQLInventory = await itemsMySQLInventory[
          i
        ].dataValues.name.slice(0, -4);
        const idx = metadata.items.findIndex(
          (item) => item.name === itemNameMySQLInventory
        );

        const itemID = metadata.items[idx];
        if (itemID !== undefined) itemsOffChainInventory.push(itemID.id);
      }
    });

    // from equipment
    await queryAllEquippedNftItemsByUser(username).then(
      async (itemsMySQLEquipment) => {
        for (let i = 0; i < (await itemsMySQLEquipment.length); ++i) {
          // get ID of item
          const itemNameMySQLEquipment = await itemsMySQLEquipment[
            i
          ].dataValues.name.slice(0, -4);
          const idx = metadata.items.findIndex(
            (item) => item.name === itemNameMySQLEquipment
          );

          const itemID = metadata.items[idx];
          if (itemID !== undefined) itemsOffChainEquipment.push(itemID.id);
        }
      }
    );

    // merging
    itemsOffChain = [...itemsOffChainInventory, ...itemsOffChainEquipment];

    // count the amount of each ID within the array
    // length is the highest ID value which we can get from the allItems.json metadata sum file
    let itemOffChainAmountsArray = [];
    for (let i = 0; i <= metadata.items[metadata.items.length - 1].id; ++i) {
      itemOffChainAmountsArray[i] = 0;

      for (let j = 0; j < itemsOffChain.length; ++j)
        if (metadata.items[i].id === itemsOffChain[j])
          itemOffChainAmountsArray[i]++;
    }

    // organize the amount result into a Map
    const itemOffChainAmounts = new Map();
    for (let i = 0; i < itemOffChainAmountsArray.length; ++i) {
      // ID (index) => [amount of that item type on all blockchains, name]
      itemOffChainAmounts.set(i, [
        itemOffChainAmountsArray[i],
        metadata.items[i].name,
      ]);
    }

    return itemOffChainAmounts;
  } catch (err) {
    console.log(err);
  }
};

const collectItemsFromMySQLBatch = async (addresses) => {
  console.log("Collecting items from MySQL DB.");
  const addressBalances = {};
  try {
    for (let i = 0; i < addresses.length; ++i) {
      const username = await queryUsernameByAddress(addresses[i]);
      addressBalances[addresses[i]] = await collectItemsFromMySQL(username);
    }

    return addressBalances;
  } catch (err) {
    console.log(err);
  }
};

const compareOffOnChainItems = async (address, itemContractFuse) => {
  try {
    const username = await queryUsernameByAddress(address);
    const itemsOnChain = await collectItemsFromBlockchain(
      address,
      itemContractFuse
    );
    const itemsOffChain = await collectItemsFromMySQL(username);

    // calculate the on-chain - off-chain difference to see what's missing in the MySQL DB
    const difference = new Map();
    let amountDifference;
    for (let i = 0; i < (await itemsOnChain.size); ++i) {
      amountDifference =
        Number(await itemsOnChain.get(i)[0]) -
        Number(await itemsOffChain.get(i)[0]);
      difference.set(i, [amountDifference, metadata.items[i].name]);
    }

    return difference;
  } catch (err) {
    console.log(err);
  }
};

const compareOffOnChainItemsBatch = async (
  addresses,
  itemIds,
  itemContractFuse
) => {
  try {
    const blockchainItems = await collectItemsFromBlockchainBatch(
      itemIds,
      addresses,
      itemContractFuse
    );
    const mySQLItems = await collectItemsFromMySQLBatch(addresses);

    const addressDifferences = {};

    console.log("Calculating difference between balances.");
    for (let i = 0; i < addresses.length; ++i) {
      let balanceDifference = new Map();

      for (let j = 0; j <= itemIds; ++j) {
        let amountDifference =
          Number(await blockchainItems[addresses[i]].get(j)[0]) -
          Number(await mySQLItems[addresses[i]].get(j)[0]);
        balanceDifference.set(j, [amountDifference, metadata.items[j].name]);
      }

      addressDifferences[addresses[i]] = balanceDifference;
    }

    return addressDifferences;
  } catch (err) {
    console.log(err);
  }
};

const syncDatabasePlayer = async (
  address,
  difference,
  ws,
  messageStack,
  messageRate
) => {
  try {
    // add or remove items to reflect the blockchain
    for (let i = 0; i < difference.size; ++i) {
      // if it's more than 0 then we have to add this amount of items from the type which the index defines
      if (difference.get(i)[0] > 0) {
        // we only add 1 at a time so we loop through
        for (let j = 0; j < difference.get(i)[0]; ++j) {
          // sending it on websocket to the Unity server
          const jsonArray = {
            type: "add",
            player: address,
            id: i,
            name: difference.get(i)[1],
            amount: 1,
          };
          await addItem(difference.get(i)[1], 1, address, false);

          await bufferMessage(
            ws,
            JSON.stringify(jsonArray),
            messageStack,
            messageRate
          );
        }
      }
      // if it's less than 0 we have to remove the corresponding amount
      else if (difference.get(i)[0] < 0) {
        // we only remove 1 at a time so we loop through
        for (let j = 0; j < -1 * Number(difference.get(i)[0]); ++j) {
          // sending it on websocket to the Unity server
          const jsonArray = {
            type: "remove",
            player: address,
            id: i,
            name: difference.get(i)[1],
            amount: 1,
          };

          let isRemovedFromInventory = await removeItemInventory(
            difference.get(i)[1],
            1,
            address,
            false
          );

          if ((await isRemovedFromInventory) === false)
            await removeItemEquipment(difference.get(i)[1], 1, address, false);

          await bufferMessage(
            ws,
            JSON.stringify(jsonArray),
            messageStack,
            messageRate
          );
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const syncDatabasePlayerWithoutUnity = async (address, difference) => {
  try {
    // add or remove items to reflect the blockchain
    for (let i = 0; i < difference.size; ++i) {
      // if it's more than 0 then we have to add this amount of items from the type which the index defines
      if (difference.get(i)[0] > 0) {
        // we only add 1 at a time so we loop through
        for (let j = 0; j < difference.get(i)[0]; ++j) {
          await addItem(difference.get(i)[1], 1, address, false);
        }
      }
      // if it's less than 0 we have to remove the corresponding amount
      else if (difference.get(i)[0] < 0) {
        // we only remove 1 at a time so we loop through
        for (let j = 0; j < -1 * Number(difference.get(i)[0]); ++j) {
          let isRemovedFromInventory = await removeItemInventory(
            difference.get(i)[1],
            1,
            address,
            false
          );

          if ((await isRemovedFromInventory) === false)
            await removeItemEquipment(difference.get(i)[1], 1, address, false);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const syncAll = async (itemContractFuse) => {
  /*
  try {
    const addresses = await queryAllAddresses();

    const itemIds = await itemContractFuse.methods.itemIds().call();
    let addressDifferences = await compareOffOnChainItemsBatch(
      addresses,
      itemIds,
      itemContractFuse
    );

    console.log("Syncing inventory...");
    for (let i = 0; i < addresses.length; ++i) {
      await syncDatabasePlayerWithoutUnity(
        addresses[i],
        addressDifferences[addresses[i]]
      );
    }

    console.log("Database syncing finished!");
  } catch (err) {
    console.log(err);
  }*/
};

const syncSingle = async (
  address,
  itemContractFuse,
  ws,
  messageStack,
  messageRate
) => {
  try {
    if (address !== "") {
      await compareOffOnChainItems(address, itemContractFuse).then(
        async (difference) => {
          await syncDatabasePlayer(
            address,
            difference,
            ws,
            messageStack,
            messageRate
          );
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
};

const syncSingleWithoutUnity = async (address, itemContractFuse) => {
  try {
    if (address !== "") {
      await compareOffOnChainItems(address, itemContractFuse).then(
        async (difference) => {
          await syncDatabasePlayerWithoutUnity(address, difference);
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  collectItemsFromMySQL,
  collectItemsFromMySQLBatch,
  compareOffOnChainItems,
  compareOffOnChainItemsBatch,
  syncDatabasePlayer,
  syncDatabasePlayerWithoutUnity,
  syncAll,
  syncSingle,
  syncSingleWithoutUnity,
};
