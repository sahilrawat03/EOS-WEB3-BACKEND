const {
  queryVirtualItemsByUser,
  isItemValidToTransmute,
} = require("../service/character_inventory");

const getItems = async (req, res) => {
  const username = req.body.username;
  try {
    if (!username) {
      return res.send([]);
    }
    const items = await queryVirtualItemsByUser(username);

    return res.send(items);
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};

const isValidToTransmute = async (req, res) => {
  const address = req.body.address;
  const slots = req.body.slots;
  try {
    const isValid = await isItemValidToTransmute(address, slots);

    return res.send(isValid);
  } catch (err) {
    console.log(err);
    return res.send(items);
  }
};

module.exports = {
  getItems,
  isValidToTransmute,
};
