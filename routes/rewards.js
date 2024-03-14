const express = require("express");
const router = express.Router();
const {
  getLastOpenedChestDates,
  updateLastOpenedChestDates,
} = require("../controllers/rewards");

router.post("/last-opened-dates", getLastOpenedChestDates);
//router.post("/update-opened-dates", updateLastOpenedChestDates);

module.exports = router;
