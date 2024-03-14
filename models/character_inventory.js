module.exports = (sequelize, DataTypes) => {
  const character_inventory = sequelize.define(
    "character_inventory",
    {
      character: {
        unique: true,
        type: DataTypes.STRING(80),
        validate: {
          notEmpty: true,
        },
      },
      slot: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        foreignKey: "character",
      },
      name: {
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: null,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      summonedHealth: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      summonedLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      summonedExperience: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
      },
      isOnBlockchain: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: null,
      },
      isNft: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: null,
      },
      txHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: "character_inventory",
      freezeTableName: true,
      timestamps: false,
    }
  );

  character_inventory.removeAttribute("id");

  return character_inventory;
};
