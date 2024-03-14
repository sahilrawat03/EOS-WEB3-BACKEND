const models = require("../models");

const deleteOrders = async (username) => {
  const ordersExists = await models.character_orders.findOne({
    where: { character: username },
  });

  if (!ordersExists) {
    return;
  }

  return await models.character_orders.destroy({
    where: { character: username },
  });
};

module.exports = { deleteOrders };
