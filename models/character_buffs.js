module.exports = (sequelize, DataTypes) => {
  const character_buffs = sequelize.define(
    "character_buffs",
    {
      character: {
        unique: true,
        type: DataTypes.STRING(80),
        validate: {
          notEmpty: true,
        },
      },
      name: {
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: null,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      buffTimeEnd: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: "character_buffs",
      freezeTableName: true,
      timestamps: false,
    }
  );

  character_buffs.removeAttribute("id");

  return character_buffs;
};
