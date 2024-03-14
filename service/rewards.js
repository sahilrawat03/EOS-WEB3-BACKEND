const models = require("../models");
const { queryAddressByUsername } = require("./accounts");

/**
 * Update the date of the last opened chest for a player. If the player doesn't exist,
 * create a new entry with the current date.
 *
 * @param {string} address - The address of the player.
 * @param {string} chestType - The type of the chest ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H').
 */
const updateLastOpenedChest = async (address, chestType) => {
  try {
    const columnName = `lastOpenedChest${chestType.toUpperCase()}`;

    // Use findOrCreate to either find the existing player or create a new one
    const [player, created] = await models.rewards.findOrCreate({
      where: { address: address },
      defaults: {
        address: address,
        [columnName]: new Date(), // Set the current date for the specified chest
      },
    });

    if (!created) {
      // If the player already exists, update the specific lastOpenedChest field
      player[columnName] = new Date();
      await player.save();
    }

    return player;
  } catch (error) {
    console.error("Error updating the last opened chest:", error);
    throw error;
  }
};

/**
 * Retrieve the last opened chest dates for a given player.
 *
 * @param {string} address - The address of the player.
 * @returns An object containing the last opened dates for each chest or null if not found.
 */
const queryLastOpenedChestDates = async (address) => {
  try {
    const player = await models.rewards.findOne({
      where: { address: address },
      attributes: [
        "lastOpenedChestA",
        "lastOpenedChestB",
        "lastOpenedChestC",
        "lastOpenedChestD",
        "lastOpenedChestE",
        "lastOpenedChestF",
        "lastOpenedChestG",
        "lastOpenedChestH",
      ],
    });

    return player ? player.get({ plain: true }) : "empty";
  } catch (error) {
    console.error("Error fetching the last opened chest dates:", error);
    throw error;
  }
};

const deleteRewards = async (username) => {
  const address = await queryAddressByUsername(username);

  if (!address) {
    console.log("No address found for the given username.");
    return;
  }

  // Check if there are any rewards associated with the address
  const rewardExists = await models.rewards.findOne({
    where: { address: address },
  });

  if (!rewardExists) {
    console.log("No rewards found for the given address.");
    return;
  }

  // If rewards exist, proceed with the deletion
  return await models.rewards.destroy({
    where: { address: address },
  });
};

module.exports = {
  updateLastOpenedChest,
  queryLastOpenedChestDates,
  deleteRewards,
};
