module.exports = (sequelize, DataTypes) => {
  const accounts = sequelize.define(
    "accounts",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      name: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: null,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lastlogin: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      banned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      verifyhash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      verified: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      nonce: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      hasCharacter: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      resethash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      hasReward: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: null,
      },
      lastReward: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      inviter: {
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: "accounts",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return accounts;
};
