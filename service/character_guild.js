const models = require("../models");

const deleteGuild = async (username) => {
  const guildExists = await models.character_guild.findOne({
    where: { character: username },
  });

  if (!guildExists) {
    return;
  }

  return await models.character_guild.destroy({
    where: { character: username },
  });
};

module.exports = { deleteGuild };
