module.exports = (sequelize, DataTypes) => {
  const character_itemcooldowns = sequelize.define(
    "character_itemcooldowns",
    {
      character: {
        unique: true,
        type: DataTypes.STRING(80),
        validate: {
          notEmpty: true,
        },
      },
      category: {
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: null,
      },
      cooldownEnd: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: "character_itemcooldowns",
      freezeTableName: true,
      timestamps: false,
    }
  );

  character_itemcooldowns.removeAttribute("id");

  return character_itemcooldowns;
};
