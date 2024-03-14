const express = require("express");
const router = express.Router();
const {
  getAccessPassPrices,
  getItemPrices,
  getTransmutePrices,
  checkAccessPass,
  validateReward,
} = require("../controllers/web3");

router.post("/prices", getAccessPassPrices);
router.post("/item-prices", getItemPrices);
router.post("/transmute-prices", getTransmutePrices);
router.post("/accesspass", checkAccessPass);
router.post("/validate-reward", validateReward);

module.exports = router;
