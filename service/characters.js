const models = require("../models");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

models.characters.hasMany(models.accounts, {
  foreignKey: "inviter",
  sourceKey: "name",
});
models.accounts.belongsTo(models.characters, {
  foreignKey: "inviter",
});

const queryCharacterScores = async () => {
  try {
    const highScores = await models.characters.findAll({
      attributes: [
        "name",
        "level",
        [Sequelize.fn("COUNT", Sequelize.col("accounts.id")), "invited"],
        [
          Sequelize.literal(
            "(`characters`.`level` * 5) + COUNT(`accounts`.`id`)"
          ),
          "totalScores",
        ],
      ],
      include: [
        {
          model: models.accounts,
          attributes: [],
          duplicating: false,
        },
      ],
      group: ["characters.name", "characters.level"],
      order: [[Sequelize.literal("totalScores"), "DESC"]],
      raw: true,
    });

    // Adding ranks to the results
    highScores.forEach((score, index) => {
      score.rank = index + 1;
    });

    return highScores;
  } catch (error) {
    console.error("Error in fetching high scores: ", error);
    throw error;
  }
};

const queryCharacterByAddress = async (address) => {
  return await models.characters
    .findAll({ where: { account: address } })
    .then(async (result) => {
      array = await result;
      if (array.length > 0) return array[0].dataValues;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

const insertCharacter = async (
  name,
  account,
  classname,
  x,
  y,
  level,
  health,
  mana,
  strength,
  intelligence,
  experience,
  skillExperience,
  gold,
  coins,
  online,
  lastsaved,
  deleted
) => {
  return await models.characters
    .create({
      name: name,
      account: account,
      classname: classname,
      x: x,
      y: y,
      level: level,
      health: health,
      mana: mana,
      strength: strength,
      intelligence: intelligence,
      experience: experience,
      skillExperience: skillExperience,
      gold: gold,
      coins: coins,
      online: online,
      lastsaved: lastsaved,
      deleted: deleted,
    })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

const insertEquipment = async (
  character,
  slot,
  name,
  amount,
  summonedHealth,
  summonedLevel,
  summonedExperience
) => {
  return await models.character_equipment
    .create({
      character: character,
      slot: slot,
      name: name,
      amount: amount,
      summonedHealth: summonedHealth,
      summonedLevel: summonedLevel,
      summonedExperience: summonedExperience,
    })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

const insertSkill = async (
  character,
  name,
  level,
  castTimeEnd,
  cooldownEnd
) => {
  return await models.character_skills
    .create({
      character: character,
      name: name,
      level: level,
      castTimeEnd: castTimeEnd,
      cooldownEnd: cooldownEnd,
    })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};
const insertInventory = async (
  character,
  slot,
  name,
  amount,
  summonedHealth,
  summonedLevel,
  summonedExperience
) => {
  return await models.character_inventory
    .create({
      character: character,
      slot: slot,
      name: name,
      amount: amount,
      summonedHealth: summonedHealth,
      summonedLevel: summonedLevel,
      summonedExperience: summonedExperience,
    })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

const deleteCharacter = async (username) => {
  const charactersExists = await models.characters.findOne({
    where: { name: username },
  });

  if (!charactersExists) {
    return;
  }

  return await models.characters.destroy({
    where: { name: username },
  });
};

const queryLastSavedDate = async (username) => {
  try {
    const character = await models.characters.findOne({
      attributes: ["lastsaved"], // Only fetch the lastsaved field
      where: {
        name: username,
      },
    });

    if (character) {
      return character.lastsaved; // Return the lastsaved date
    } else {
      return null; // Character not found
    }
  } catch (error) {
    console.error("Error querying lastsaved date:", error);
    throw error; // Rethrow or handle as needed
  }
};

const countDailyActiveUsers = async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // Subtract 1 day to get yesterday's date

  try {
    const dauCount = await models.characters.count({
      where: {
        lastsaved: {
          [Op.gt]: yesterday, // Greater than yesterday's date, i.e., within the last 24 hours
        },
      },
      distinct: true, // Ensure counting is distinct
      col: "account",
    });

    return dauCount;
  } catch (error) {
    console.error("Error counting daily active users:", error);
    throw error; // Rethrow or handle as needed
  }
};

module.exports = {
  queryCharacterByAddress,
  insertCharacter,
  insertEquipment,
  insertSkill,
  insertInventory,
  queryCharacterScores,
  deleteCharacter,
  queryLastSavedDate,
  countDailyActiveUsers,
};
