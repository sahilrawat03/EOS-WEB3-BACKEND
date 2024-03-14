const Web3 = require("web3");
const dotenv = require("dotenv").config();
const CONFIG = require("../../config/config.json");
const itemABI = require("../../artifacts/Item.json");
const itemFuseABI = require("../../artifacts/ItemFuse.json");
const rewardABI = require("../../artifacts/Reward.json");
const accessPassABI = require("../../artifacts/AccessPass.json");

const web3Ethereum = new Web3(CONFIG.WEB3.NETWORK.ETHEREUM.WEBSOCKET);
const web3HttpEthereum = new Web3(CONFIG.WEB3.NETWORK.ETHEREUM.RPC_PUBLIC);
const web3BSC = new Web3(CONFIG.WEB3.NETWORK.BSC.WEBSOCKET);
const web3HttpBSC = new Web3(CONFIG.WEB3.NETWORK.BSC.RPC_PUBLIC);
const web3Avalanche = new Web3(CONFIG.WEB3.NETWORK.AVALANCHE.WEBSOCKET);
const web3HttpAvalanche = new Web3(CONFIG.WEB3.NETWORK.AVALANCHE.RPC_PUBLIC);
const web3Polygon = new Web3(CONFIG.WEB3.NETWORK.POLYGON.WEBSOCKET);
const web3HttpPolygon = new Web3(CONFIG.WEB3.NETWORK.POLYGON.RPC_PUBLIC);
const web3Fuse = new Web3(
  new Web3.providers.WebsocketProvider(CONFIG.WEB3.NETWORK.FUSE.WEBSOCKET, {
    clientConfig: {
      keepalive: true,
      keepaliveInterval: 5000,
    },
    reconnect: {
      auto: true,
      delay: 5000,
      maxAttempts: 5,
      onTimeout: false,
    },
  })
);
const web3HttpFuse = new Web3(CONFIG.WEB3.NETWORK.FUSE.RPC_PUBLIC);

const initContract = async () => {
  try {
    const itemContractEthereum = await new web3BSC.eth.Contract(
      itemABI,
      CONFIG.WEB3.NETWORK.BSC.ITEM_ADDRESS
    );
    const itemContractHttpEthereum = await new web3HttpBSC.eth.Contract(
      itemABI,
      CONFIG.WEB3.NETWORK.BSC.ITEM_ADDRESS
    );
    const itemContractBSC = await new web3BSC.eth.Contract(
      itemABI,
      CONFIG.WEB3.NETWORK.BSC.ITEM_ADDRESS
    );
    const itemContractHttpBSC = await new web3HttpBSC.eth.Contract(
      itemABI,
      CONFIG.WEB3.NETWORK.BSC.ITEM_ADDRESS
    );
    const itemContractAvalanche = await new web3Avalanche.eth.Contract(
      itemABI,
      CONFIG.WEB3.NETWORK.AVALANCHE.ITEM_ADDRESS
    );
    const itemContractHttpAvalanche = await new web3HttpAvalanche.eth.Contract(
      itemABI,
      CONFIG.WEB3.NETWORK.AVALANCHE.ITEM_ADDRESS
    );
    const itemContractPolygon = await new web3Polygon.eth.Contract(
      itemABI,
      CONFIG.WEB3.NETWORK.POLYGON.ITEM_ADDRESS
    );
    const itemContractHttpPolygon = await new web3HttpPolygon.eth.Contract(
      itemABI,
      CONFIG.WEB3.NETWORK.POLYGON.ITEM_ADDRESS
    );
    const itemContractFuse = await new web3Fuse.eth.Contract(
      itemFuseABI,
      CONFIG.WEB3.NETWORK.FUSE.ITEM_ADDRESS
    );
    const itemContractHttpFuse = await new web3HttpFuse.eth.Contract(
      itemFuseABI,
      CONFIG.WEB3.NETWORK.FUSE.ITEM_ADDRESS
    );
    const rewardContractFuse = await new web3Fuse.eth.Contract(
      rewardABI,
      CONFIG.WEB3.NETWORK.FUSE.REWARD_ADDRESS
    );
    const rewardContractHttpFuse = await new web3HttpFuse.eth.Contract(
      rewardABI,
      CONFIG.WEB3.NETWORK.FUSE.REWARD_ADDRESS
    );
    const accessPassContractEthereum = await new web3Ethereum.eth.Contract(
      accessPassABI,
      CONFIG.WEB3.NETWORK.ETHEREUM.ACCESS_PASS_ADDRESS
    );

    const accessPassContractBSC = await new web3BSC.eth.Contract(
      accessPassABI,
      CONFIG.WEB3.NETWORK.BSC.ACCESS_PASS_ADDRESS
    );

    const accessPassContractAvalanche = await new web3Avalanche.eth.Contract(
      accessPassABI,
      CONFIG.WEB3.NETWORK.AVALANCHE.ACCESS_PASS_ADDRESS
    );

    const accessPassContractPolygon = await new web3Polygon.eth.Contract(
      accessPassABI,
      CONFIG.WEB3.NETWORK.POLYGON.ACCESS_PASS_ADDRESS
    );

    return {
      itemContractEthereum,
      itemContractHttpEthereum,
      itemContractBSC,
      itemContractHttpBSC,
      itemContractAvalanche,
      itemContractHttpAvalanche,
      itemContractPolygon,
      itemContractHttpPolygon,
      accessPassContractEthereum,
      accessPassContractBSC,
      accessPassContractAvalanche,
      accessPassContractPolygon,
      itemContractHttpFuse,
      itemContractFuse,
      rewardContractFuse,
      rewardContractHttpFuse,
    };
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  web3Ethereum,
  web3HttpEthereum,
  web3BSC,
  web3HttpBSC,
  web3Avalanche,
  web3HttpAvalanche,
  web3Polygon,
  web3HttpPolygon,
  web3HttpFuse,
  web3Fuse,
  initContract,
};
