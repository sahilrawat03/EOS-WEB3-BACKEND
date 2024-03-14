const models = require("../models");

const deleteFriendRequests = async (username) => {
  const friendRequestsExists = await models.character_friendRequests.findOne({
    where: { character: username },
  });

  if (!friendRequestsExists) {
    return;
  }

  return await models.character_friendRequests.destroy({
    where: { character: username },
  });
};

module.exports = { deleteFriendRequests };
