module.exports = (sequelize, DataTypes) => {
  const character_gatheringSkills = sequelize.define(
    "character_gatheringSkills",
    {
      character: {
        unique: true,
        type: DataTypes.STRING(80),
        validate: {
          notEmpty: true,
        },
      },
      miningLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      harvestingLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      miningExp: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
      },
      harvestingExp: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: "character_gatheringSkills",
      freezeTableName: true,
      timestamps: false,
    }
  );

  character_gatheringSkills.removeAttribute("id");

  return character_gatheringSkills;
};
