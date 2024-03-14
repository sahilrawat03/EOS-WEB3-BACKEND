const {
  queryCharacterByAddress,
  insertCharacter,
  insertEquipment,
  insertSkill,
  insertInventory,
  queryCharacterScores,
  countDailyActiveUsers,
} = require("../service/characters");
const {
  updateHasCharacterByName,
  updateInviterByName,
} = require("../service/accounts");

const moment = require("moment");

const getHighScores = async (req, res) => {
  const result = await queryCharacterScores();

  if (result != null) {
    return res.json({
      result,
    });
  } else return res.json({ message: "High Scores query failed." });
};

const getCharacterByAddress = async (req, res) => {
  const account = req.body.account;
  const result = await queryCharacterByAddress(account);

  if (result != null) {
    return res.json({
      classname: result.classname,
      level: result.level,
      health: result.health,
      mana: result.mana,
      strength: result.strength,
      intelligence: result.intelligence,
      experience: result.experience,
      skillExperience: result.skillExperience,
      gold: result.gold,
      coins: result.coins,
    });
  } else return res.json({ message: "Wrong address." });
};

const addCharacter = async (req, res) => {
  const name = req.body.name;
  const account = req.body.name;
  const classname = req.body.classname;
  const inviter = req.body.inviter;

  const lastSaved = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  const x = -65.25;
  const y = -82.5;
  const level = 1;
  const health = 10;
  const mana = 10;
  const gold = 25;
  const coins = 0;
  const online = 0;
  const deleted = 0;
  const strength = 0;
  const intelligence = 0;
  const experience = 0;
  const skillExperience = 0;
  const summonedHealth = 0;
  const summonedLevel = 0;
  const summonedExperience = 0;

  const slot = 6;
  const amount = 1;
  let itemName;

  let firstSkillName;
  let secondSkillName;
  let thirdSkillName;
  let fourthSkillName;
  const skillLevel = 1;
  const castTimeEnd = 0;
  const cooldownEnd = 0;

  const healthPotionSlot = 2;
  const healthPotionName = "Apprentice Health Potion";
  const potionAmount = 5;

  const manaPotionSlot = 3;
  const manaPotionName = "Apprentice Mana Potion";

  if (classname === "Kagutsuchi the Shinto") {
    itemName = "Clever";
    firstSkillName = "Smash";
    secondSkillName = "Soil Slam";
    thirdSkillName = "Engulfing Aura";
    fourthSkillName = "Vulcanic Burst";
  } else if (classname === "Donovan the Shadow Stepper") {
    itemName = "Clever";
    firstSkillName = "Swift Strike";
    secondSkillName = "Darkest Night";
    thirdSkillName = "Shadow Aura";
    fourthSkillName = "Rushing Darkness";
  } else if (classname === "Isabella the Temptress") {
    itemName = "Sceptre";
    firstSkillName = "Void Shot";
    secondSkillName = "Frost Bolt";
    thirdSkillName = "Aura of Spirits";
    fourthSkillName = "Tempest Storm";
  } else if (classname === "Princess PingYang the Warrioress") {
    itemName = "Clever";
    firstSkillName = "Slash";
    secondSkillName = "Wind Sheer";
    thirdSkillName = "Aura of the Winds";
    fourthSkillName = "Eye of the Storm";
  } else if (classname === "Lucas the Wanderer") {
    itemName = "Crossbow";
    firstSkillName = "Quick Shot";
    secondSkillName = "Nature Shot";
    thirdSkillName = "Swiftness Aura";
    fourthSkillName = "Natures Fury";
  }
  try {
    const createCharacter = await insertCharacter(
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
      lastSaved,
      deleted
    );
    const createEquipment = await insertEquipment(
      name,
      slot,
      itemName,
      amount,
      summonedHealth,
      summonedLevel,
      summonedExperience
    );
    const createFirstSkill = await insertSkill(
      name,
      firstSkillName,
      skillLevel,
      castTimeEnd,
      cooldownEnd
    );
    const createSecondSkill = await insertSkill(
      name,
      secondSkillName,
      skillLevel,
      castTimeEnd,
      cooldownEnd
    );
    const createThirdSkill = await insertSkill(
      name,
      thirdSkillName,
      skillLevel,
      castTimeEnd,
      cooldownEnd
    );
    const createFourthSkill = await insertSkill(
      name,
      fourthSkillName,
      skillLevel,
      castTimeEnd,
      cooldownEnd
    );
    const createHealthPotion = await insertInventory(
      name,
      healthPotionSlot,
      healthPotionName,
      potionAmount,
      summonedHealth,
      summonedLevel,
      summonedExperience
    );
    const createManaPotion = await insertInventory(
      name,
      manaPotionSlot,
      manaPotionName,
      potionAmount,
      summonedHealth,
      summonedLevel,
      summonedExperience
    );
    if (
      createCharacter &&
      createEquipment &&
      createFirstSkill &&
      createSecondSkill &&
      createThirdSkill &&
      createFourthSkill &&
      createHealthPotion &&
      createManaPotion
    ) {
      if (await updateHasCharacterByName(name)) {
        if (inviter) {
          if (await updateInviterByName(name, inviter)) {
            return res.json({
              success: true,
              message: "Successful character creation.",
            });
          } else
            return res.json({
              success: false,
              message: "Character creation error.",
            });
        } else {
          return res.json({
            success: true,
            message: "Successful character creation.",
          });
        }
      } else
        return res.json({
          success: false,
          message: "Character creation error.",
        });
    } else
      return res.json({
        success: false,
        message: "Character creation error.",
      });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Character creation error.",
    });
  }
};

const getDailyActiveUsers = async (req, res) => {
  try {
    const count = await countDailyActiveUsers();
    res.status(200).json({
      success: true,
      message: "Daily active users count retrieved successfully.",
      data: {
        count,
      },
    });
  } catch (error) {
    console.error("Failed to get daily active users count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve daily active users count.",
      error: error.message, // Sending the error message back is optional and should be done considering security and privacy implications
    });
  }
};

module.exports = {
  getCharacterByAddress,
  addCharacter,
  getHighScores,
  getDailyActiveUsers,
};
