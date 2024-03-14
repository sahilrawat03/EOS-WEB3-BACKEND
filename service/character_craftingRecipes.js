const models = require("../models");

const deleteCraftingRecipes = async (username) => {
  const craftingRecipesExists = await models.character_craftingRecipes.findOne({
    where: { character: username },
  });

  if (!craftingRecipesExists) {
    return;
  }

  return await models.character_craftingRecipes.destroy({
    where: { character: username },
  });
};

module.exports = { deleteCraftingRecipes };
