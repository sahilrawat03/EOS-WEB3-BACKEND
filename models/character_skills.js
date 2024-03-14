module.exports = (sequelize, DataTypes) => {
  const character_skills = sequelize.define(
    "character_skills",
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
      castTimeEnd: {
        type: DataTypes.FLOAT,
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
      tableName: "character_skills",
      freezeTableName: true,
      timestamps: false,
    }
  );

  character_skills.removeAttribute("id");

  return character_skills;
};
