module.exports = (sequelize, DataTypes) => {
  const character_friendRequests = sequelize.define(
    "character_friendRequests",
    {
      character: {
        unique: true,
        type: DataTypes.STRING(80),
        validate: {
          notEmpty: true,
        },
      },
      inviteFrom: {
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: null,
      },
      className: {
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: null,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      guild: {
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: "character_friendRequests",
      freezeTableName: true,
      timestamps: false,
    }
  );

  character_friendRequests.removeAttribute("id");

  return character_friendRequests;
};
