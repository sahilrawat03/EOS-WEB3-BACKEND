const models = require("../models");

const deleteItemcooldowns = async (username) => {
  const itemcooldownsExists = await models.character_itemcooldowns.findOne({
    where: { character: username },
  });

  if (!itemcooldownsExists) {
    return;
  }

  return await models.character_itemcooldowns.destroy({
    where: { character: username },
  });
};

module.exports = { deleteItemcooldowns };
