const {
  send,
  getTransactionReceipt,
  getNameOfItemByID,
} = require("./utils.js");
const { updateLastOpenedChest } = require("../rewards.js");
const {
  bufferMessage,
  sumArray,
  getChestType,
  getRewardVirtualItems,
} = require("../../utils/utils.js");
const {
  addItem,
  updateItemIsOnBlockchain,
  removeItemInventory,
  isItemValidToTransmute,
} = require("../character_inventory.js");
const { removeItemEquipment } = require("../character_equipment.js");

const handleRewardClaiming = async (
  event,
  web3Http,
  itemContractHttp,
  processingPromise,
  ws,
  messageStack,
  messageRate,
  signer
) => {
  try {
    await processingPromise;
    const receipt = await getTransactionReceipt(
      web3Http,
      event.transactionHash
    );
    if (receipt) {
      // if the asked item is valid to mint then we start minting
      const tx = itemContractHttp.methods.mintWithRole(
        event.returnValues.id,
        1,
        event.returnValues.claimer,
        true
      );

      let mintProcessingPromise = Promise.resolve();
      try {
        await mintProcessingPromise;
        await send(web3Http, signer, tx).then(async (mintReceipt) => {
          if (await mintReceipt) {
            // adding type to the websocket message
            const itemName = await getNameOfItemByID(
              await event.returnValues.id
            );

            if (itemName !== "Fuse Shard") {
              const jsonArray = {
                type: "add",
                player: event.returnValues.claimer,
                id: event.returnValues.id,
                name: itemName,
                amount: 1,
              };

              await addItem(itemName, 1, event.returnValues.claimer, false);
              await updateLastOpenedChest(
                event.returnValues.claimer,
                getChestType(event.returnValues.id)
              );

              console.log("handleRewardClaiming messageStack: ");
              console.log(messageStack);

              await bufferMessage(
                ws,
                JSON.stringify(jsonArray),
                messageStack,
                messageRate
              );
            }
          }
        });
      } catch (err) {
        console.log(err);
      } finally {
        mintProcessingPromise = Promise.resolve();
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    processingPromise = Promise.resolve();
  }
};

// Adds virtual items
const handleRewardClaimingVirtualItems = async (
  event,
  web3Http,
  processingPromise,
  ws,
  messageStack,
  messageRate
) => {
  try {
    await processingPromise;
    const receipt = await getTransactionReceipt(
      web3Http,
      event.transactionHash
    );
    if (receipt) {
      console.log("handleRewardClaimingVirtualPack ");

      const item = await getRewardVirtualItems(await event.returnValues.id);

      let amount;
      if (item === "Fuse Orb") amount = 1;
      else amount = Math.floor(Math.random() * 3) + 3; // Generate a random number between 3 and 5

      console.log("item: " + item);
      console.log("amount: " + amount);

      const jsonArray = {
        type: "add-virtual",
        player: event.returnValues.claimer,
        id: event.returnValues.id,
        name: item,
        amount: amount,
      };

      await addItem(item, amount, event.returnValues.claimer, false, true);

      await bufferMessage(
        ws,
        JSON.stringify(jsonArray),
        messageStack,
        messageRate
      );

      console.log(messageStack);

      await updateLastOpenedChest(
        event.returnValues.claimer,
        getChestType(event.returnValues.id)
      );
    }
  } catch (err) {
    console.log(err);
  }
};

const handleMintedEvent = async (
  event,
  web3Http,
  processingPromise,
  ws,
  messageStack,
  messageRate
) => {
  console.log("handleMintedEvent");
  console.log(event.returnValues.isTransmuting);
  if (!event.returnValues.isTransmuting) {
    try {
      await processingPromise;
      const receipt = await getTransactionReceipt(
        web3Http,
        event.transactionHash
      );

      if (receipt) {
        // adding type to the websocket message
        const itemName = await getNameOfItemByID(await event.returnValues.id);

        const jsonArray = {
          type: "add",
          player: event.returnValues.player,
          id: event.returnValues.id,
          name: itemName,
          amount: event.returnValues.amount,
        };

        // we can stack only one for NFTs, so we have to add only one at a time
        for (let i = 0; i < event.returnValues.amount; ++i)
          await addItem(itemName, 1, event.returnValues.player, false);

        console.log("handleMintedEvent messageStack: ");
        console.log(messageStack);

        await bufferMessage(
          ws,
          JSON.stringify(jsonArray),
          messageStack,
          messageRate
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      processingPromise = Promise.resolve();
    }
  }
};

const handleTransmutedEvent = async (
  event,
  web3Http,
  itemContractHttp,
  processingPromise,
  ws,
  messageStack,
  messageRate,
  signer
) => {
  try {
    await processingPromise;
    console.log("waiting for transmute receipt");
    console.log("event.transactionHash: " + event.transactionHash);
    const receipt = await getTransactionReceipt(
      web3Http,
      event.transactionHash
    );
    if (await receipt) {
      console.log("transmute receipt received");
      if (
        await isItemValidToTransmute(
          event.returnValues.player,
          event.returnValues.slots
        )
      ) {
        console.log("item is valid to transmute");
        let amount = sumArray(event.returnValues.amounts);

        // if the asked item is valid to mint then we start minting
        const tx = itemContractHttp.methods.mintWithRole(
          event.returnValues.id,
          amount,
          event.returnValues.player,
          true
        );

        let mintProcessingPromise = Promise.resolve();
        try {
          await mintProcessingPromise;
          console.log("sending mint tx");
          await send(web3Http, signer, tx).then(async (mintReceipt) => {
            if (await mintReceipt) {
              console.log("mint receipt received");
              // adding type to the websocket message
              const itemName = await getNameOfItemByID(
                await event.returnValues.id
              );
              const jsonArray = {
                type: "transmute",
                player: event.returnValues.player,
                id: event.returnValues.id,
                name: itemName,
                amount: event.returnValues.amounts[0],
                slot: event.returnValues.slots[0],
              };
              await updateItemIsOnBlockchain(
                itemName,
                event.returnValues.amounts[0],
                event.returnValues.slots[0],
                event.returnValues.player,
                true
              );

              console.log("handletrans messageStack: ");
              console.log(messageStack);

              await bufferMessage(
                ws,
                JSON.stringify(jsonArray),
                messageStack,
                messageRate
              );
            }
          });
        } catch (err) {
          console.log(err);
        } finally {
          mintProcessingPromise = Promise.resolve();
        }
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    processingPromise = Promise.resolve();
  }
};

const handleTransferredEvent = async (
  event,
  web3Http,
  processingPromise,
  ws,
  messageStack,
  messageRate
) => {
  try {
    await processingPromise;
    const receipt = await getTransactionReceipt(
      web3Http,
      event.transactionHash
    );
    if (receipt) {
      const itemName = await getNameOfItemByID(await event.returnValues.id);
      // sender
      const jsonArraySender = {
        type: "remove",
        player: event.returnValues.from,
        id: event.returnValues.id,
        name: itemName,
        amount: event.returnValues.value,
      };

      // we can stack only one for NFTs, so we have to remove only one at a time
      for (let i = 0; i < event.returnValues.value; ++i) {
        await removeItemInventory(
          itemName,
          1,
          event.returnValues.from,
          false
        ).then(async (success) => {
          if (success === false)
            await removeItemEquipment(
              itemName,
              1,
              event.returnValues.from,
              false
            );
        });
      }

      console.log("handleTransferredEvent messageStack: ");
      console.log(messageStack);

      await bufferMessage(
        ws,
        JSON.stringify(jsonArraySender),
        messageStack,
        messageRate
      );

      // receiver
      const jsonArrayReceiver = {
        type: "add",
        player: event.returnValues.to,
        id: event.returnValues.id,
        name: itemName,
        amount: event.returnValues.value,
      };

      // we can stack only one for NFTs, so we have to add only one at a time
      for (let i = 0; i < event.returnValues.value; ++i)
        await addItem(itemName, 1, event.returnValues.to, false);

      await bufferMessage(
        ws,
        JSON.stringify(jsonArrayReceiver),
        messageStack,
        messageRate
      );
    }
  } catch (err) {
    console.log(err);
  } finally {
    processingPromise = Promise.resolve();
  }
};

const handleBurntEvent = async (
  event,
  web3Http,
  processingPromise,
  ws,
  messageStack,
  messageRate
) => {
  try {
    await processingPromise;
    const receipt = await getTransactionReceipt(
      web3Http,
      event.transactionHash
    );
    if (receipt) {
      const itemName = await getNameOfItemByID(await event.returnValues.id);
      // sender
      const jsonArraySender = {
        type: "remove",
        player: event.returnValues.from,
        id: event.returnValues.id,
        name: itemName,
        amount: event.returnValues.value,
      };

      // we can stack only one for NFTs, so we have to remove only one at a time
      for (let i = 0; i < event.returnValues.value; ++i) {
        await removeItemInventory(
          itemName,
          1,
          event.returnValues.from,
          false
        ).then(async (success) => {
          if (success === false)
            await removeItemEquipment(
              itemName,
              1,
              event.returnValues.from,
              false
            );
        });
      }

      console.log("handleBurntEvent messageStack: ");
      console.log(messageStack);

      await bufferMessage(
        ws,
        JSON.stringify(jsonArraySender),
        messageStack,
        messageRate
      );
    }
  } catch (err) {
    console.log(err);
  } finally {
    processingPromise = Promise.resolve();
  }
};

module.exports = {
  handleRewardClaiming,
  handleMintedEvent,
  handleTransmutedEvent,
  handleTransferredEvent,
  handleBurntEvent,
  handleRewardClaimingVirtualItems,
};
