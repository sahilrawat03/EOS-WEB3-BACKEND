const models = require("../models");

const deleteQuests = async (username) => {
  const questsExists = await models.character_quests.findOne({
    where: { character: username },
  });

  if (!questsExists) {
    return;
  }

  return await models.character_quests.destroy({
    where: { character: username },
  });
};

module.exports = { deleteQuests };
