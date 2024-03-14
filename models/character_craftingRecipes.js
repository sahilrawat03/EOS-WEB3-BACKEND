module.exports = (sequelize, DataTypes) => {
  const character_craftingRecipes = sequelize.define(
    "character_craftingRecipes",
    {
      character: {
        unique: true,
        type: DataTypes.STRING(80),
        validate: {
          notEmpty: true,
        },
      },
      recipe: {
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: "character_craftingRecipes",
      freezeTableName: true,
      timestamps: false,
    }
  );

  character_craftingRecipes.removeAttribute("id");

  return character_craftingRecipes;
};
