const express = require("express");
const router = express.Router();
const {
  getCharacterByAddress,
  addCharacter,
  getHighScores,
  getDailyActiveUsers,
} = require("../controllers/characters");

router.post("/character", getCharacterByAddress);
router.post("/addcharacter", addCharacter);
router.get("/high-scores", getHighScores);
router.get("/daily-active-users", getDailyActiveUsers);

module.exports = router;
