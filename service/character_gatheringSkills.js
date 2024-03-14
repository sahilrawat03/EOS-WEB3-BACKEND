const models = require("../models");

const deleteGatheringSkills = async (username) => {
  const gatheringSkillsExists = await models.character_gatheringSkills.findOne({
    where: { character: username },
  });

  if (!gatheringSkillsExists) {
    return;
  }

  return await models.character_gatheringSkills.destroy({
    where: { character: username },
  });
};

module.exports = { deleteGatheringSkills };
