module.exports = (sequelize, DataTypes) => {
  const characters = sequelize.define(
    "characters",
    {
      name: {
        primaryKey: true,
        type: DataTypes.STRING(80),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      account: {
        type: DataTypes.STRING(80),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      classname: {
        type: DataTypes.STRING(80),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      x: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      y: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      health: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      mana: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      strength: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      intelligence: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      experience: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
      },
      skillExperience: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
      },
      gold: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
      },
      coins: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
      },
      online: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: null,
      },
      lastsaved: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      deleted: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: "characters",
      freezeTableName: true,
      timestamps: false,
    }
  );

  characters.removeAttribute("id");

  return characters;
};
