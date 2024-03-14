const {
  handleMintedEvent,
  handleBurntEvent,
  handleRewardClaiming,
  handleTransferredEvent,
  handleTransmutedEvent,
  handleRewardClaimingVirtualItems,
} = require("./handlers.js");
const CONFIG = require("../../config/config.json");

const initRewardClaimedEventListener = async (
  rewardContractWs,
  web3Http,
  itemContract,
  processingPromise,
  ws,
  messageStack,
  messageRate,
  signer
) => {
  await rewardContractWs.events
    .RewardClaimed({})
    .on("data", async function (event) {
      console.log("RewardClaimed event received:");
      console.log(event.returnValues.id);
      // 10001, 10002: Chest Opening without rewards
      if (
        Number(event.returnValues.id) !== 10001 &&
        Number(event.returnValues.id) !== 10002
      ) {
        if (Number(event.returnValues.id) >= 2000) {
          // >= 2000: for Virtual Items
          await handleRewardClaimingVirtualItems(
            event,
            web3Http,
            processingPromise,
            ws,
            messageStack,
            messageRate
          );
        } else {
          // for NFTs
          await handleRewardClaiming(
            event,
            web3Http,
            itemContract,
            processingPromise,
            ws,
            messageStack,
            messageRate,
            signer
          );
        }
      }
    })
    .on("error", function (error, receipt) {
      // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
      console.log("Error in RewardClaimed event listener:", error);
    });
};

const initializeMintedEventListener = async (
  itemContractWs,
  itemContractHttp,
  processingPromise,
  ws,
  messageStack,
  messageRate
) => {
  await itemContractWs.events
    .Minted({})
    .on("data", async (event) => {
      await handleMintedEvent(
        await event,
        itemContractHttp,
        processingPromise,
        ws,
        messageStack,
        messageRate
      );
    })
    .on("error", (error) => {
      console.log("Error in Minted event listener:", error);
    });
};

const initializeTransmutedEventListener = async (
  itemContractWs,
  itemContractHttp,
  web3Http,
  processingPromise,
  ws,
  messageStack,
  messageRate,
  signer
) => {
  await itemContractWs.events
    .Transmuted({})
    .on("data", async (event) => {
      console.log("Transmuted event received:");
      console.log(event);
      await handleTransmutedEvent(
        event,
        web3Http,
        itemContractHttp,
        processingPromise,
        ws,
        messageStack,
        messageRate,
        signer
      );
    })
    .on("error", (error) => {
      console.log("Error in Minted event listener:", error);
    });
};

const initializeTransferSingleEventListener = async (
  itemContractWs,
  web3Http,
  processingPromise,
  ws,
  messageStack,
  messageRate
) => {
  await itemContractWs.events.TransferSingle({}).on("data", async (event) => {
    if (
      event.returnValues.from !== CONFIG.WEB3.UTILS.ZERO_ADDRESS &&
      event.returnValues.to !== CONFIG.WEB3.UTILS.ZERO_ADDRESS
    ) {
      await handleTransferredEvent(
        event,
        web3Http,
        processingPromise,
        ws,
        messageStack,
        messageRate
      );
    } else if (event.returnValues.to === CONFIG.WEB3.UTILS.ZERO_ADDRESS) {
      await handleBurntEvent(
        event,
        web3Http,
        processingPromise,
        ws,
        messageStack,
        messageRate
      );
    }
  });
};

module.exports = {
  initRewardClaimedEventListener,
  initializeMintedEventListener,
  initializeTransmutedEventListener,
  initializeTransferSingleEventListener,
};
