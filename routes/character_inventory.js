const express = require("express");
const router = express.Router();
const {
  getItems,
  isValidToTransmute,
} = require("../controllers/character_inventory");

router.post("/character-inventory", getItems);
router.post("/character-inventory/is-valid-to-transmute", isValidToTransmute);

module.exports = router;
