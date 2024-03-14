const models = require("../models");

const deleteCraftingSkills = async (username) => {
  const craftingSkillsExists = await models.character_craftingSkills.findOne({
    where: { character: username },
  });

  if (!craftingSkillsExists) {
    return;
  }

  return await models.character_craftingSkills.destroy({
    where: { character: username },
  });
};

module.exports = { deleteCraftingSkills };
