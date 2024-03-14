const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const url = "https://empireofsight.com";
const wsUrl = "ws://164.92.232.20:8080/server-unity-web3";

const jsonConcat = async (o1, o2) => {
  for (var key in o2) {
    o1[key] = o2[key];
  }
  return o1;
};

hashVerifyEmail = (username) => {
  return new Promise((resolve, reject) => {
    const salt = process.env.SALT + username;
    const iterations = 10000;
    const keylen = 20;
    const digest = "sha256";

    crypto.pbkdf2(username, salt, iterations, keylen, digest, (err, key) => {
      if (err) {
        reject(err);
      } else {
        resolve(key.toString("hex"));
      }
    });
  });
};

const hashPassword = (password, username) => {
  return new Promise((resolve, reject) => {
    const salt = process.env.SALT + password + username;
    const iterations = 10000;
    const keylen = 20;
    const digest = "sha1";

    crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, key) => {
      if (err) {
        reject(err);
      } else {
        resolve(key.toString("hex").toUpperCase());
      }
    });
  });
};

const comparePassword = async (passwordUser, username, passwordDb) => {
  return (await hashPassword(passwordUser, username)) === passwordDb;
};

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    res.send("There is no token.");
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "Failed authentication." });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

const containsWhitespace = (str) => {
  return /\s/.test(str);
};

const bufferMessage = async (ws, message, messageStack, messageRate) => {
  // Push the message to the stack
  messageStack.push(message);

  // Delay for the specified message rate
  await new Promise((resolve) => setTimeout(resolve, messageRate));

  // Send messages in LIFO order
  while (messageStack.length > 0) {
    const messageTemp = messageStack.pop();
    console.log("send: " + messageTemp);
    await ws.send(messageTemp);
  }
};

const isJSONString = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
};

const sumArray = (array) => {
  let sum = 0;
  for (let i = 0; i < array.length; ++i) sum += Number(array[i]);

  return Number(sum);
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getChestType = (itemID) => {
  const id = Number(itemID);

  if ([15, 17, 20, 25, 35].includes(id)) {
    return "A";
  }
  if ([1, 0].includes(id)) {
    return "B";
  }
  if ([5, 12, 16, 31, 29].includes(id)) {
    return "C";
  }
  if ([41].includes(id)) {
    return "D";
  }
  if ([49].includes(id)) {
    return "E";
  }
  if ([50, 51, 52, 53].includes(id)) {
    return "F";
  }
  //  Fuse Crafting Package
  if ([2001, 2002, 2003, 2004].includes(id)) {
    return "G";
  }
  // Fuse Orb
  if ([2000].includes(id)) {
    return "H";
  }
};

const getRewardVirtualItems = (chestID) => {
  if (Number(chestID) === 2000) {
    return "Fuse Orb";
  } else if (Number(chestID) === 2001) {
    return "Blank Rune";
  } else if (Number(chestID) === 2002) {
    return "Iron Bar";
  } else if (Number(chestID) === 2003) {
    return "Leather Patch";
  } else if (Number(chestID) === 2004) {
    return "Bolt of Cloth";
  }
};

module.exports = {
  bufferMessage,
  jsonConcat,
  hashVerifyEmail,
  hashPassword,
  comparePassword,
  verifyJWT,
  containsWhitespace,
  isJSONString,
  sumArray,
  url,
  sleep,
  wsUrl,
  getChestType,
  getRewardVirtualItems,
};
