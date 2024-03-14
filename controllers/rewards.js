const {
  queryLastOpenedChestDates,
  updateLastOpenedChest,
} = require("../service/rewards");

const updateLastOpenedChestDates = async (req, res) => {
  try {
    const address = req.body.address;
    const chestType = req.body.chestType;
    const player = await updateLastOpenedChest(address, chestType);
    res.json({
      message: "Updated last opened chest date for player",
      data: player,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getLastOpenedChestDates = async (req, res) => {
  try {
    const address = req.body.address;
    const dates = await queryLastOpenedChestDates(address);

    if (dates) {
      res.json({
        message: "Retrieved dates for player",
        data: dates,
      });
    } else {
      res
        .status(404)
        .json({ message: "No records found for the given player" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getLastOpenedChestDates, updateLastOpenedChestDates };
