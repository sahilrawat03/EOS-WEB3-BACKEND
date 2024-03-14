const models = require("../models");

const queryAccountExists = async (user) => {
  return await models.accounts
    .findOne({ where: { name: user } })
    .then(async (account) => {
      return account !== null;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

const queryAddressByUsername = async (user) => {
  return await models.accounts
    .findAll({ where: { name: user } })
    .then(async (result) => {
      array = await result;
      if (array.length > 0) return await array[0].dataValues.address;
      else return null;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

const queryUsernameByAddress = async (address) => {
  return await models.accounts
    .findAll({ where: { address: address } })
    .then(async (result) => {
      array = await result;
      if (array.length > 0) return await array[0].dataValues.name;
      else return null;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

const verifyByHash = async (hash) => {
  return await models.accounts
    .findAll({ where: { verifyhash: hash } })
    .then(async (result) => {
      if ((await result.length) > 0) {
        await models.accounts
          .update({ verified: true }, { where: { verifyhash: hash } })
          .then(() => {
            return true;
          })
          .catch((err) => {
            console.log(err);
            return false;
          });
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const queryAddressExists = async (address) => {
  return await models.accounts
    .findAll({ where: { address: address } })
    .then(async (result) => {
      array = await result;
      if (array.length > 0) return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const queryEmailExists = async (email) => {
  return await models.accounts
    .findAll({ where: { email: email } })
    .then(async (result) => {
      array = await result;
      if (array.length > 0) return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const queryUsernameExists = async (user) => {
  return await models.accounts
    .findAll({ where: { name: user } })
    .then(async (result) => {
      array = await result;
      if (array.length > 0) return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const queryEmailVerified = async (email) => {
  return await models.accounts
    .findAll({ where: { email: email } })
    .then(async (result) => {
      array = await result;

      if (array.length > 0) {
        //console.log("VERIFIED: " + array[0].verified);
        return array[0].verified;
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const insertAccount = async (
  email,
  name,
  password,
  address,
  created,
  banned,
  verifyhash,
  verified,
  nonce
) => {
  return await models.accounts
    .create({
      email: email,
      name: name,
      password: password,
      address: address,
      created: created,
      banned: banned,
      verifyhash: verifyhash,
      verified: verified,
      nonce: nonce,
      hasCharacter: false,
      resethash: "",
    })
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const queryNonce = async (address) => {
  return await models.accounts
    .findAll({ where: { address: address } })
    .then(async (result) => {
      array = await result;
      if (array.length > 0) return array[0].dataValues.nonce;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

const queryAccountByUsername = async (username) => {
  return await models.accounts
    .findAll({ where: { name: username } })
    .then(async (result) => {
      array = await result;
      if (array.length > 0) return array[0].dataValues;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

const queryAccountByEmail = async (email) => {
  return await await models.accounts
    .findAll({ where: { email: email } })
    .then(async (result) => {
      array = await result;
      //console.log("array " + array);
      if (array.length > 0) return array[0].dataValues;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

const queryAccountByAddress = async (address) => {
  return await models.accounts
    .findAll({ where: { address: address } })
    .then(async (result) => {
      array = await result;
      if (array.length > 0) return array[0].dataValues;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

const updateNonce = async (address, newNonce) => {
  return await models.accounts
    .update({ nonce: newNonce }, { where: { address: address } })
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const addNonce = async (user, newNonce) => {
  return await models.accounts
    .update({ nonce: newNonce }, { where: { name: user } })
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const addAddress = async (user, address) => {
  return await models.accounts
    .update({ address: address }, { where: { name: user } })
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const queryAccountById = async (id) => {
  return await models.accounts
    .findAll({ where: { id: id } })
    .then(async (result) => {
      array = await result;
      if (array.length > 0) return array[0].dataValues;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

const updatePasswordById = async (id, passwordHash) => {
  return await models.accounts
    .update({ password: passwordHash }, { where: { id: id } })
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const updateHasCharacterByName = async (user) => {
  return await models.accounts
    .update({ hasCharacter: true }, { where: { name: user } })
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const updateInviterByName = async (user, inviter) => {
  return await models.accounts
    .update({ inviter: inviter }, { where: { name: user } })
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const updateHasRewardByAddress = async (address) => {
  return await models.accounts
    .update({ hasReward: true }, { where: { address: address } })
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const queryAllAccounts = async () => {
  return await models.accounts
    .findAll()
    .then(async (result) => {
      return await result;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

const queryAllAddresses = async () => {
  return await models.accounts
    .findAll()
    .then(async (result) => {
      let addresses = [];
      await result.forEach((account) => {
        if (account.address) addresses.push(account.address);
      });

      return await addresses;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
};

const countAccounts = async () => {
  return await models.accounts
    .count()
    .then(async (count) => {
      return await count;
    })
    .catch((err) => {
      console.error("Error:", err);
      return null;
    });
};

const queryHasReward = async (address) => {
  return await models.accounts
    .findOne({
      where: {
        address: address,
      },
    })
    .then((account) => {
      // process the result
      if (account) {
        return account.dataValues.hasReward;
      } else {
        console.log(
          "No account with a reward and the specified address found."
        );
        return null;
      }
    })
    .catch((error) => {
      // handle error
      console.error(error);
      return null;
    });
};

const deleteAccount = async (username) => {
  return await models.accounts.destroy({
    where: { name: username },
  });
};

module.exports = {
  queryAddressByUsername,
  queryUsernameByAddress,
  verifyByHash,
  queryAddressExists,
  queryEmailExists,
  queryUsernameExists,
  queryEmailVerified,
  insertAccount,
  queryNonce,
  queryAccountByUsername,
  queryAccountByEmail,
  queryAccountByAddress,
  updateNonce,
  queryAccountById,
  updatePasswordById,
  updateHasCharacterByName,
  addNonce,
  addAddress,
  queryAllAccounts,
  queryAllAddresses,
  countAccounts,
  queryAccountExists,
  queryHasReward,
  updateInviterByName,
  updateHasRewardByAddress,
  deleteAccount,
};
