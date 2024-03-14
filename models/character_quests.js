module.exports = (sequelize, DataTypes) => {
  const character_quests = sequelize.define(
    "character_quests",
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
      progress: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      completed: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: null,
      },
      killed_a: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      killed_b: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      killed_c: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      killed_d: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      killed_e: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      killed_f: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: "character_quests",
      freezeTableName: true,
      timestamps: false,
    }
  );

  character_quests.removeAttribute("id");

  return character_quests;
};
