const models = require("../models");

const deleteBuffs = async (username) => {
  const buffsExists = await models.character_buffs.findOne({
    where: { character: username },
  });

  if (!buffsExists) {
    return;
  }

  return await models.character_buffs.destroy({
    where: { character: username },
  });
};

module.exports = { deleteBuffs };
