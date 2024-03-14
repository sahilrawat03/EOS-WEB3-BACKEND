module.exports = (sequelize, DataTypes) => {
  const rewards = sequelize.define(
    "rewards",
    {
      address: {
        primaryKey: true,
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lastOpenedChestA: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      lastOpenedChestB: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      lastOpenedChestC: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      lastOpenedChestD: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      lastOpenedChestE: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      lastOpenedChestF: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      lastOpenedChestG: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      lastOpenedChestH: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: "rewards",
      freezeTableName: true,
      timestamps: false,
    }
  );

  rewards.removeAttribute("id");

  return rewards;
};
