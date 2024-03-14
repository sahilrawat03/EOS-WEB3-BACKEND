const models = require("../models");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { queryUsernameByAddress } = require("./accounts");

const queryVirtualItemsByUser = async (user) => {
  let items;

  await models.character_inventory
    .findAll({
      where: {
        character: user,
        name: {
          [Op.like]: "%(V)",
        },
        isNft: true,
      },
    })
    .then(async (result) => {
      items = await result;
    })
    .catch((err) => {
      console.log(err);
    });

  //console.log(items);

  return await items;
};

const queryAllNftItemsByUser = async (user) => {
  return await models.character_inventory
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

const isItemValidToTransmute = async (address, slots) => {
  const username = await queryUsernameByAddress(address);

  return await models.character_inventory
    .findAll({ where: { character: username, slot: slots[0] } })
    .then(async (result) => {
      const length = await result.length;
      const slicedName = await result[0].dataValues.name.slice(-3);

      if (length > 0 && slicedName === "(V)") return true;
      else return false;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const addItem = async (
  itemName,
  amount,
  address,
  isVirtualItem,
  isPurelyVirtual = false
) => {
  const username = await queryUsernameByAddress(address);
  const slots = new Array(54);
  try {
    // init slots
    for (let i = 0; i < slots.length; ++i)
      slots[i] = {
        dataValues: {
          slot: i,
          amount: 0,
        },
      };

    const slotsDb = await models.character_inventory.findAll({
      where: { character: username },
    });

    for (let i = 0; i < slotsDb.length; ++i)
      slots[slotsDb[i].dataValues.slot] = slotsDb[i];

    let finalSlot = 0;
    while (slots.length > finalSlot && slots[finalSlot].dataValues.amount > 0)
      finalSlot++;
    //console.log("add item: " + itemName);
    if (isPurelyVirtual) {
      await models.character_inventory
        .create({
          character: username,
          slot: finalSlot,
          name: itemName,
          amount: amount,
          summonedHealth: 0,
          summonedLevel: 0,
          summonedExperience: 0,
          //isOnBlockchain: true,
          isNft: false,
        })
        .then(() => {
          return true;
        })
        .catch((err) => {
          console.log(err);

          return false;
        });
    } else
      await models.character_inventory
        .create({
          character: username,
          slot: finalSlot,
          name: !isVirtualItem ? itemName + " (B)" : itemName + " (V)",
          amount: amount,
          summonedHealth: 0,
          summonedLevel: 0,
          summonedExperience: 0,
          //isOnBlockchain: true,
          isNft: true,
        })
        .then(() => {
          return true;
        })
        .catch((err) => {
          console.log(err);

          return false;
        });
  } catch (err) {
    console.log(err);
    return false;
  }
};

const addSpecificItemSlot = async (
  itemName,
  amount,
  address,
  slot,
  isVirtualItem
) => {
  const username = await queryUsernameByAddress(address);

  await models.character_inventory
    .create({
      character: username,
      slot: slot,
      name: !isVirtualItem ? itemName + " (B)" : itemName + " (V)",
      amount: amount,
      summonedHealth: 0,
      summonedLevel: 0,
      summonedExperience: 0,
      //isOnBlockchain: true,
      isNft: true,
    })
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);

      return false;
    });
};

const removeItemInventory = async (
  itemName,
  amount,
  address,
  isVirtualItem
) => {
  const username = await queryUsernameByAddress(address);

  const slotsDb = await models.character_inventory.findAll({
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

    if (i === slotsDb.length) return false;
    else {
      const finalSlot = slotsDb[i].dataValues.slot;
      //console.log("REMOVE INVENTORY: " + itemName + " " + username);
      if (slotsDb[i].dataValues.name === signedItemName)
        await models.character_inventory
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
    }
  } else return false;
};

const removeSpecificItemSlot = async (
  itemName,
  amount,
  address,
  slot,
  isVirtualItem
) => {
  const username = await queryUsernameByAddress(address);

  await models.character_inventory
    .destroy({
      where: {
        character: username,
        slot: slot,
        name: !isVirtualItem ? itemName + " (B)" : itemName + " (V)",
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
};

const updateItemIsOnBlockchain = async (
  itemName,
  amount,
  slot,
  address,
  isTransmute
) => {
  if (isTransmute)
    await removeSpecificItemSlot(itemName, amount, address, slot, true)
      .then(async () => {
        await addSpecificItemSlot(itemName, amount, address, slot, false)
          .then(() => {
            return true;
          })
          .catch((err) => {
            console.log(err);
            return false;
          });
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  else
    await removeSpecificItemSlot(itemName, amount, address, false)
      .then(async () => {
        await addSpecificItemSlot(itemName, amount, address, slot, true)
          .then(() => {
            return true;
          })
          .catch((err) => {
            console.log(err);
            return false;
          });
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
};

const deleteInventory = async (username) => {
  const inventoryExists = await models.character_inventory.findOne({
    where: { character: username },
  });

  if (!inventoryExists) {
    return;
  }

  return await models.character_inventory.destroy({
    where: { character: username },
  });
};

module.exports = {
  queryVirtualItemsByUser,
  isItemValidToTransmute,
  queryAllNftItemsByUser,
  addItem,
  removeItemInventory,
  updateItemIsOnBlockchain,
  removeSpecificItemSlot,
  deleteInventory,
};
