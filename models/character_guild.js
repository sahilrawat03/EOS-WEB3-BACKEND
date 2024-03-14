module.exports = (sequelize, DataTypes) => {
  const character_guild = sequelize.define(
    "character_guild",
    {
      character: {
        unique: true,
        type: DataTypes.STRING(80),
        validate: {
          notEmpty: true,
        },
      },
      guild: {
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: null,
      },
      rank: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: "character_guild",
      freezeTableName: true,
      timestamps: false,
    }
  );

  character_guild.removeAttribute("id");

  return character_guild;
};
