const models = require("../models");

const deleteFriends = async (username) => {
  const friendsExists = await models.character_friends.findOne({
    where: { character: username },
  });

  if (!friendsExists) {
    return;
  }

  return await models.character_friends.destroy({
    where: { character: username },
  });
};

module.exports = { deleteFriends };
