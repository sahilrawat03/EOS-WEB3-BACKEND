const models = require("../models");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { queryUsernameByAddress } = require("./accounts");

const queryAllEquippedNftItemsByUser = async (user) => {
  return await models.character_equipment
    .findAll({
      where: {
        character: user,
        name: {
          [Op.like]: "%(B)",
        },
        isNft: true,
      },
    })
    .then(async (result) => {
      return await result;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
};

const removeItemEquipment = async (
  itemName,
  amount,
  address,
  isVirtualItem
) => {
  const username = await queryUsernameByAddress(address);

  const slotsDb = await models.character_equipment.findAll({
    where: { character: username, isNft: true },
  });
  //console.log("equipment slotsDb " + username);
  //console.log("slotsDb.length " + slotsDb.length);
  if (slotsDb.length > 0) {
    const signedItemName = !isVirtualItem
      ? itemName + " (B)"
      : itemName + " (V)";
    let i = 0;
    while (slotsDb.length > i && slotsDb[i].dataValues.name !== signedItemName)
      i++;

    const finalSlot = slotsDb[i].dataValues.slot;

    //console.log("REMOVE EQUIPMENT: " + itemName + " " + username);
    if (slotsDb[i].dataValues.name === signedItemName)
      await models.character_equipment
        .destroy({
          where: {
            character: username,
            slot: finalSlot,
            name: signedItemName,
            amount: amount,
          },
        })
        .then(() => {
          return true;
        })
        .catch((err) => {
          console.log(err);

          return false;
        });
    else return false;
  } else return false;
};

const deleteEquipment = async (username) => {
  const equipmentExists = await models.character_equipment.findOne({
    where: { character: username },
  });

  if (!equipmentExists) {
    return;
  }

  return await models.character_equipment.destroy({
    where: { character: username },
  });
};

module.exports = {
  queryAllEquippedNftItemsByUser,
  removeItemEquipment,
  deleteEquipment,
};
