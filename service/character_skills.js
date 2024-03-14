const models = require("../models");

const deleteSkills = async (username) => {
  const skillsExists = await models.character_skills.findOne({
    where: { character: username },
  });

  if (!skillsExists) {
    return;
  }

  return await models.character_skills.destroy({
    where: { character: username },
  });
};

module.exports = { deleteSkills };
