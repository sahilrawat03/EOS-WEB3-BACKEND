module.exports = (sequelize, DataTypes) => {
  const character_friends = sequelize.define(
    "character_friends",
    {
      character: {
        unique: true,
        type: DataTypes.STRING(80),
        validate: {
          notEmpty: true,
        },
      },
      friend: {
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: "character_friends",
      freezeTableName: true,
      timestamps: false,
    }
  );

  character_friends.removeAttribute("id");

  return character_friends;
};
