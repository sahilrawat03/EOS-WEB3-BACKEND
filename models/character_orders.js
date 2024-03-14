module.exports = (sequelize, DataTypes) => {
  const character_orders = sequelize.define(
    "character_orders",
    {
      orderid: {
        type: DataTypes.INTEGER,
      },
      character: {
        unique: true,
        type: DataTypes.STRING(80),
        validate: {
          notEmpty: true,
        },
      },
      coins: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
      },
      processed: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: "character_orders",
      freezeTableName: true,
      timestamps: false,
    }
  );

  character_orders.removeAttribute("id");

  return character_orders;
};
