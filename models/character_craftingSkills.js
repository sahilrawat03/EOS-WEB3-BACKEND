module.exports = (sequelize, DataTypes) => {
  const character_craftingSkills = sequelize.define(
    "character_craftingSkills",
    {
      character: {
        unique: true,
        type: DataTypes.STRING(80),
      },
      lvs: {
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: null,
      },
      exp: {
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: "character_craftingSkills",
      freezeTableName: true,
      timestamps: false,
    }
  );

  character_craftingSkills.removeAttribute("id");

  return character_craftingSkills;
};
