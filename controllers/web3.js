const {
  web3Ethereum,
  web3HttpEthereum,
  web3BSC,
  web3HttpBSC,
  web3Avalanche,
  web3HttpAvalanche,
  web3Polygon,
  web3HttpPolygon,
  web3HttpFuse,
  send,
  initContract,
  handleRewardClaiming,
} = require("../service/web3/web3");
const { queryAccountByUsername } = require("../service/accounts");

const getAccessPassPrices = async (req, res) => {
  const accesPassID = req.body.accessPassID;
  const accessPassContractBSC = (await initContract()).accessPassContractBSC;
  const accessPassContractAvalanche = (await initContract())
    .accessPassContractAvalanche;
  const accessPassContractPolygon = (await initContract())
    .accessPassContractPolygon;

  try {
    /*const priceEthereum = await accessPassContractEthereum.methods
          .getAccessPassNativePrice(accesPassID)
          .call();*/
    const priceBSC = await accessPassContractBSC.methods
      .getAccessPassNativePrice(accesPassID)
      .call();
    const pricePolygon = await accessPassContractPolygon.methods
      .getAccessPassNativePrice(accesPassID)
      .call();
    const priceAvalanche = await accessPassContractAvalanche.methods
      .getAccessPassNativePrice(accesPassID)
      .call();

    return res.json({
      //Ethereum: priceEthereum,
      BSC: priceBSC,
      Polygon: pricePolygon,
      Avalanche: priceAvalanche,
    });
  } catch (err) {
    console.log(err);

    return res.json({
      message: "Smart contracts are not accessible.",
    });
  }
};

const getItemPrices = async (req, res) => {
  const itemIDs = req.body.itemIDs;
  try {
    const itemContractHttpFuse = (await initContract()).itemContractHttpFuse;
    let prices = {};

    for (let i = 0; i < itemIDs.length; i++) {
      const itemID = Number(itemIDs[i]);
      const itemAmount = Number(1); // Default to 1 if no amount specified

      const priceFuse = await itemContractHttpFuse.methods
        .getItemsNativePrice(itemID, itemAmount)
        .call();

      prices[itemID] = { priceFuse };
    }

    return res.json(prices);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error accessing smart contracts.",
    });
  }
};

const getTransmutePrices = async (req, res) => {
  try {
    const itemContractEthereum = (await initContract())
      .itemContractHttpEthereum;
    const itemContractBSC = (await initContract()).itemContractHttpBSC;
    const itemContractAvalanche = (await initContract())
      .itemContractHttpAvalanche;
    const itemContractPolygon = (await initContract()).itemContractHttpPolygon;

    const priceEthereum = await itemContractEthereum.methods
      .transmuteFee()
      .call();
    const priceBSC = await itemContractBSC.methods.transmuteFee().call();
    const pricePolygon = await itemContractPolygon.methods
      .transmuteFee()
      .call();
    const priceAvalanche = await itemContractAvalanche.methods
      .transmuteFee()
      .call();

    res.json({
      Ethereum: priceEthereum,
      BSC: priceBSC,
      Polygon: pricePolygon,
      Avalanche: priceAvalanche,
    });
  } catch (err) {
    console.log(err);

    res.json({
      message: "Smart contracts are not accessible.",
    });
  }
};

const checkAccessPass = async (req, res) => {
  const user = String(req.body.user);
  let ethereum = [];
  let bsc = [];
  let polygon = [];
  let avalanche = [];
  let address;
  try {
    const accessPassContractBSC = (await initContract()).accessPassContractBSC;
    const accessPassContractAvalanche = (await initContract())
      .accessPassContractAvalanche;
    const accessPassContractPolygon = (await initContract())
      .accessPassContractPolygon;

    let result = await queryAccountByUsername(user);
    if (result !== undefined && result !== null) {
      if (address !== null) {
        address = String(result.address);
        for (let i = 0; i <= 5; i++) {
          try {
            /*ethereum[i] = await accessPassContractEthereum.methods
              .balanceOf(address, i)
              .call(); */
            bsc[i] = await accessPassContractBSC.methods
              .balanceOf(address, i)
              .call();
            polygon[i] = await accessPassContractPolygon.methods
              .balanceOf(address, i)
              .call();
            avalanche[i] = await accessPassContractAvalanche.methods
              .balanceOf(address, i)
              .call();
          } catch (err) {
            console.log(err);

            return res.json({
              message: "The server couldn't reach the smart contracts.",
            });
          }

          if (
            //Number(ethereum[i]) > 0 ||
            Number(bsc[i]) > 0 ||
            Number(polygon[i]) > 0 ||
            Number(avalanche[i]) > 0
          ) {
            return res.json({
              hasAccessPass: true,
            });
          }
        }
      } else
        return res.json({
          message: "There's no blockchain address added yet.",
        });
    } else return res.json({ message: "This username is not found." });
  } catch (err) {
    console.log(err);
    return res.json({
      message: "The server couldn't reach the smart contracts.",
    });
  }
};

const validateReward = async (req, res) => {
  /*
  console.log("validateReward");
  const claimer = req.body.claimer;
  const id = req.body.id;
  try {
    const itemContractHttpFuse = (await initContract()).itemContractHttpFuse;
    const itemContractHttpPolygon = (await initContract())
      .itemContractHttpPolygon;
    const signer = await web3HttpFuse.eth.accounts.privateKeyToAccount(
      process.env.PRIVATE_KEY
    );
    await web3HttpFuse.eth.accounts.wallet.add(signer);

    await handleRewardClaiming(
      claimer,
      id,
      1,
      itemContractHttpPolygon,
      itemContractHttpFuse,
      signer
    );
  } catch (err) {
    console.log(err);
  }
  */
};

module.exports = {
  getAccessPassPrices,
  getItemPrices,
  getTransmutePrices,
  checkAccessPass,
  validateReward,
};
