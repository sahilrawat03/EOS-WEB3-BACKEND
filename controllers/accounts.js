const Sequelize = require("sequelize");
const {
  verifyByHash,
  queryAddressExists,
  queryEmailExists,
  queryEmailVerified,
  insertAccount,
  queryNonce,
  queryAccountByEmail,
  queryAccountByAddress,
  updateNonce,
  queryAccountById,
  updatePasswordById,
  queryAddressByUsername,
  queryAccountByUsername,
  addNonce,
  addAddress,
  queryUsernameExists,
  countAccounts,
  queryAccountExists,
  queryHasReward,
  deleteAccount,
} = require("../service/accounts");
const {
  web3Ethereum,
  syncDatabasePlayer,
  syncSingleWithoutUnity,
  initContract,
  mintFreeNFT,
  web3Polygon,
} = require("../service/web3/web3");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../utils/mailer");
const {
  hashVerifyEmail,
  hashPassword,
  containsWhitespace,
  comparePassword,
  url,
  wsUrl,
} = require("../utils/utils");
const { deleteBuffs } = require("../service/character_buffs");
const {
  deleteCraftingRecipes,
} = require("../service/character_craftingRecipes");
const { deleteCraftingSkills } = require("../service/character_craftingSkills");
const { deleteFriendRequests } = require("../service/character_friendRequests");
const { deleteFriends } = require("../service/character_friends");
const {
  deleteGatheringSkills,
} = require("../service/character_gatheringSkills");
const { deleteGuild } = require("../service/character_guild");
const { deleteItemcooldowns } = require("../service/character_itemcooldowns");
const { deleteOrders } = require("../service/character_orders");
const { deleteQuests } = require("../service/character_quests");
const { deleteEquipment } = require("../service/character_equipment");
const { deleteInventory } = require("../service/character_inventory");
const { deleteSkills } = require("../service/character_skills");
const { deleteCharacter } = require("../service/characters");
const { deleteRewards } = require("../service/rewards");

const jwt = require("jsonwebtoken");
const WebSocket = require("ws");
const moment = require("moment");

const getAddress = async (req, res) => {
  const username = req.body.username;

  try {
    const address = await queryAddressByUsername(username);
    return res.send(address);
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};

const checkVerified = async (req, res) => {
  const hash = req.params.hash;
  try {
    await verifyByHash(hash);
  } catch (err) {
    console.log(err);
  }

  return res.redirect(`${url}/login`);
};

// if the address exists in the database then it isn't valid to register
const isAddressValid = async (req, res) => {
  try {
    if (
      req.body.address !== undefined &&
      (await queryAddressExists(req.body.address))
    )
      return res.json({
        valid: false,
      });
    else
      res.json({
        valid: true,
      });
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};

// if the email exists in the database then it isn't valid to regist
const isEmailValid = async (req, res) => {
  try {
    if (
      req.body.email !== undefined &&
      (await queryEmailExists(req.body.email))
    )
      return res.json({
        valid: false,
      });
    else
      res.json({
        valid: true,
      });
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};

// if the email exists in the database then it isn't valid to regist
const isUserValid = async (req, res) => {
  try {
    if (
      req.body.user !== undefined &&
      (await queryUsernameExists(req.body.user))
    )
      return res.json({
        valid: false,
      });
    else
      res.json({
        valid: true,
      });
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};

const isEmailVerified = async (req, res) => {
  try {
    const verified = await queryEmailVerified(req.body.email);

    return res.json({
      verified: verified,
    });
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};

const loginTria = async (req, res) => {
  const user = req.body.username;
  const address = req.body.address;

  if (user && address) {
    const username = user.replace("@tria", "");
    try {
      const dateCreated = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      const banned = 0;
      //const nonce = (Math.random() + 1).toString(36).substring(16);

      if (!(await queryAccountExists(username))) {
        //console.log("TRIA create account");
        if (
          await insertAccount(
            "",
            username,
            "",
            address,
            dateCreated,
            banned,
            "",
            false,
            ""
          )
        ) {
          const result = await queryAccountByUsername(username);
          const id = result.id;
          const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: 43200,
          });

          return res.json({
            auth: true,
            token: token,
            result: result,
            address: address,
            success: true,
            message: "Successful account creation.",
          });
        } else
          res.json({
            success: false,
            message: "Failed account creation.",
          });
      } else {
        //console.log("TRIA login account");

        const result = await queryAccountByUsername(username);
        //console.log(result);
        const id = result.id;
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: 43200,
        });

        return res.json({
          auth: true,
          token: token,
          result: result,
          address: address,
        });
      }
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Failed account creation.",
      });
    }
  } else {
    res.json({
      success: false,
      message: "Username or address null.",
    });
  }
};

const registerAccount = async (req, res) => {
  var re = new RegExp("^[a-zA-Z0-9_]+$");
  const email = req.body.email;
  const username = req.body.username;

  try {
    if (
      username.match(re) &&
      !containsWhitespace(username) &&
      email.includes("@")
    ) {
      const password = await hashPassword(req.body.password, req.body.username);
      const address = "";
      const dateCreated = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      const verifyHash = await hashVerifyEmail(req.body.username);
      const banned = 0;
      //const nonce = (Math.random() + 1).toString(36).substring(16);

      if (
        await insertAccount(
          email,
          username,
          password,
          address,
          dateCreated,
          banned,
          verifyHash,
          false,
          ""
        )
      ) {
        await sendVerificationEmail({
          toUser: req.body.email,
          hash: verifyHash,
        });

        res.json({
          success: true,
          message: "Successful account creation.",
        });
      } else
        res.json({
          success: false,
          message: "Failed account creation.",
        });
    }
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Failed account creation.",
    });
  }
};

const registerAccountWithFreeNFT = async (req, res) => {
  var re = new RegExp("^[a-zA-Z0-9_]+$");
  const email = req.body.email;
  const username = req.body.username;
  const address = req.body.address;

  try {
    if (
      username.match(re) &&
      !containsWhitespace(username) &&
      email.includes("@")
    ) {
      const password = await hashPassword(req.body.password, req.body.username);
      const dateCreated = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      const verifyHash = await hashVerifyEmail(req.body.username);
      const banned = 0;
      let txHash;
      //const nonce = (Math.random() + 1).toString(36).substring(16);

      if (
        await insertAccount(
          email,
          username,
          password,
          address,
          dateCreated,
          banned,
          verifyHash,
          false,
          ""
        )
      ) {
        await sendVerificationEmail({
          toUser: req.body.email,
          hash: verifyHash,
        });
        try {
          const itemContractPolygon = (await initContract())
            .itemContractHttpPolygon;
          txHash = await mintFreeNFT(
            web3Polygon,
            itemContractPolygon,
            0,
            1,
            address
          );
          //console.log(txHash);
        } catch (err) {
          console.log(err);
        }

        res.json({
          success: true,
          txHash: txHash,
          message: "Successful account creation.",
        });
      } else
        res.json({
          success: false,
          txHash: null,
          message: "Failed account creation.",
        });
    }
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      txHash: null,
      message: "Failed account creation.",
    });
  }
};

const getNonce = async (req, res) => {
  try {
    const nonce = await queryNonce(req.params.address);
    if (nonce != null)
      return res.json({
        nonce: nonce,
      });
    else return res.json({ message: "Wrong address." });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const isUserAuthenticated = async (req, res) => {
  return res.json({ auth: true, message: "Successful authentication." });
};

const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username.includes("@")) {
      const result = await queryAccountByUsername(username);
      if (result != null) {
        if (await comparePassword(password, username, result.password)) {
          const id = result.id;
          const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: 43200,
          });

          return res.json({
            auth: true,
            token: token,
            result: result,
            address: result.address,
          });
        } else {
          return res.json({
            auth: false,
            message: "Wrong username or password!",
          });
        }
      } else {
        return res.json({
          auth: false,
          message: "User doesn't exist!",
        });
      }
    } else {
      // username can be ambigous here, we don't know if email or username is coming from the client
      const result = await queryAccountByEmail(username);
      if (result != null) {
        if (await comparePassword(password, result.name, result.password)) {
          const id = result.id;
          const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: 43200,
          });

          return res.json({
            auth: true,
            token: token,
            result: result,
            address: result.address,
          });
        } else {
          return res.json({
            auth: false,
            message: "Wrong username or password!",
          });
        }
      } else
        res.json({
          auth: false,
          message: "User doesn't exist!",
        });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const loginMetaMask = async (req, res) => {
  const address = req.body.address;
  const signature = req.body.signature;
  try {
    const result = await queryAccountByAddress(address);

    if (result != null) {
      const recoveredAddress = web3Ethereum.eth.accounts.recover(
        `Login - Empire Of Sight (${result.nonce})`,
        signature
      );
      if (address.toUpperCase() === recoveredAddress.toUpperCase()) {
        const id = result.id;
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: 43200,
        });
        const newNonce = (Math.random() + 1).toString(36).substring(7);
        updateNonce(address, newNonce);

        return res.json({
          auth: true,
          token: token,
          user: result.name,
          result: result,
        });
      } else {
        return res.json({
          auth: false,
          message: "Failed MetaMask authentication.",
        });
      }
    } else {
      return res.json({ message: "Wrong address." });
    }
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};

const forgotPassword = async (req, res) => {
  const email = req.body.email;
  try {
    const result = await queryAccountByEmail(email);
    if (result != null) {
      const id = result.id;
      const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      await sendPasswordResetEmail({
        toUser: req.body.email,
        id: id,
        hash: token,
      });

      return res.json({
        success: true,
        message: "Password reset link has been sent to your email address.",
      });
    } else
      return res.json({
        success: false,
        message: "Failed password reset.",
      });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Failed password reset.",
    });
  }
};

const resetPassword = async (req, res) => {
  const id = req.body.id;
  const password = req.body.password;
  const token = req.body.token;
  try {
    const result = await queryAccountById(id);

    if (result != null) {
      const passwordHash = await hashPassword(password, result.name);

      // Verify the token and handle possible errors
      jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
          // err.name will be 'TokenExpiredError' if the token has expired
          return res.json({
            success: false,
            message: "Token has expired.",
          });
        }

        if (Number(payload.id) === Number(id)) {
          if (await updatePasswordById(id, passwordHash)) {
            return res.json({
              success: true,
              message: "Successful password reset. Now you can log in!",
            });
          } else {
            return res.json({
              success: false,
              message: "Database update wasn't successful.",
            });
          }
        } else {
          return res.json({
            success: false,
            message: "Token isn't valid.",
          });
        }
      });
    } else {
      return res.json({
        success: false,
        message: "The account doesn't exist.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Failed password reset.",
    });
  }
};

const hasCharacter = async (req, res) => {
  const user = req.body.user;

  try {
    const result = await queryAccountByUsername(user);

    if (result != null) {
      return res.json({
        hasCharacter: result.hasCharacter,
      });
    } else return res.json({ message: "Username doesn't exist." });
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};

const registerBlockchain = async (req, res) => {
  const user = req.body.username;
  const address = req.body.address;
  const signature = req.body.signature;

  if (await queryAddressExists(address))
    return res.json({
      success: false,
      message: "Address taken.",
    });
  else {
    try {
      const recoveredAddress = await web3Ethereum.eth.accounts.recover(
        `Blockchain address registration - Empire of Sight`,
        signature
      );
      const newNonce = (Math.random() + 1).toString(36).substring(7);

      if (address.toUpperCase() === recoveredAddress.toUpperCase()) {
        if (
          (await addNonce(user, newNonce)) &&
          (await addAddress(user, address))
        ) {
          try {
            const itemContractEthereum = (await initContract())
              .itemContractEthereum;
            const itemContractBSC = (await initContract()).itemContractBSC;
            const itemContractAvalanche = (await initContract())
              .itemContractAvalanche;
            const itemContractPolygon = (await initContract())
              .itemContractPolygon;
            await syncSingleWithoutUnity(
              address,
              itemContractEthereum,
              itemContractBSC,
              itemContractAvalanche,
              itemContractPolygon
            );

            const ws = await new WebSocket(wsUrl);
            await ws.on("open", async () => {
              console.log("ws connection open");

              // sync all the NFTs into the game that might be on the account
              const message = JSON.stringify({
                type: "sync",
                address: address,
              });
              await ws.send(message);
              ws.close();
            });

            return res.json({
              success: true,
            });
          } catch (err) {
            console.log(err);

            return res.json({
              success: false,
            });
          }
        } else
          return res.json({
            success: false,
          });
      } else {
        return res.json({
          success: false,
        });
      }
    } catch (err) {
      console.log(err);

      return res.json({
        success: false,
      });
    }
  }
};

/*
const registerBlockchain = async (req, res) => {
  const user = req.body.username;
  const address = req.body.address;
  const signature = req.body.signature;

  try {
    const recoveredAddress = await web3Ethereum.eth.accounts.recover(
      `Blockchain address registration - Empire of Sight`,
      signature
    );
    const newNonce = (Math.random() + 1).toString(36).substring(7);

    if (address.toUpperCase() === recoveredAddress.toUpperCase()) {
      if (!queryAddressExists(address)) {
        if (
          (await addNonce(user, newNonce)) &&
          (await addAddress(user, address))
        ) {
          try {
            const itemContractEthereum = (await initContract())
              .itemContractEthereum;
            const itemContractBSC = (await initContract()).itemContractBSC;
            const itemContractAvalanche = (await initContract())
              .itemContractAvalanche;
            const itemContractPolygon = (await initContract())
              .itemContractPolygon;
            await syncSingleWithoutUnity(
              address,
              itemContractEthereum,
              itemContractBSC,
              itemContractAvalanche,
              itemContractPolygon
            );

            const ws = await new WebSocket(wsUrl);
            await ws.on("open", async () => {
              console.log("ws connection open");

              // sync all the NFTs into the game that might be on the account
              const message = JSON.stringify({
                type: "sync",
                address: address,
              });
              await ws.send(message);
              ws.close();
            });

            return res.json({
              success: true,
            });
          } catch (err) {
            console.log(err);

            return res.json({
              success: false,
            });
          }
        } else
          return res.json({
            success: false,
          });
      } else {
        return res.json({
          success: false,
          message: "Address already in use.",
        });
      }
    } else {
      return res.json({
        success: false,
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
    });
  }
};
*/

const connectBlockchain = async (req, res) => {
  const address = req.body.address;
  const signature = req.body.signature;
  try {
    const result = await queryAccountByAddress(address);

    if (result != null) {
      const recoveredAddress = await web3Ethereum.eth.accounts.recover(
        `Connect - Empire of Sight (${result.nonce})`,
        signature
      );
      if (address.toUpperCase() === recoveredAddress.toUpperCase()) {
        const newNonce = (Math.random() + 1).toString(36).substring(7);
        await updateNonce(address, newNonce);

        return res.json({
          success: true,
        });
      } else {
        return res.json({
          success: false,
        });
      }
    } else
      return res.json({
        success: false,
      });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
    });
  }
};

const getNumberOfAccounts = async (req, res) => {
  try {
    const count = await countAccounts();
    return res.json({
      count: count,
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const getHasReward = async (req, res) => {
  try {
    const hasReward = await queryHasReward(req.body.address);

    return res.json({
      hasReward: hasReward,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      hasReward: null,
    });
  }
};

const deletePlayer = async (req, res) => {
  const username = req.body.username;

  try {
    await deleteRewards(username);
    await deleteEquipment(username);
    await deleteInventory(username);
    await deleteSkills(username);
    await deleteBuffs(username);
    await deleteCraftingRecipes(username);
    await deleteCraftingSkills(username);
    await deleteFriendRequests(username);
    await deleteFriends(username);
    await deleteGatheringSkills(username);
    await deleteGuild(username);
    await deleteItemcooldowns(username);
    await deleteOrders(username);
    await deleteQuests(username);
    await deleteCharacter(username);
    await deleteAccount(username);
  } catch (error) {
    throw error; // Or handle the error as per your application's requirements
  }
};

module.exports = {
  getAddress,
  checkVerified,
  isAddressValid,
  isEmailValid,
  isUserValid,
  isEmailVerified,
  registerAccount,
  getNonce,
  isUserAuthenticated,
  login,
  loginMetaMask,
  forgotPassword,
  resetPassword,
  hasCharacter,
  connectBlockchain,
  registerBlockchain,
  getNumberOfAccounts,
  registerAccountWithFreeNFT,
  loginTria,
  getHasReward,
  deletePlayer,
};
