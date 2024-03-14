const express = require("express");
const router = express.Router();
const {
  forgotPassword,
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
  hasCharacter,
  resetPassword,
  connectBlockchain,
  registerBlockchain,
  getNumberOfAccounts,
  registerAccountWithFreeNFT,
  loginTria,
  getHasReward,
  deletePlayer,
} = require("../controllers/accounts");
const { verifyJWT } = require("../utils/utils");

router.post("/address", getAddress);
router.get("/verify/:hash", checkVerified);
router.post("/is-address-valid", isAddressValid);
router.post("/is-email-valid", isEmailValid);
router.post("/is-user-valid", isUserValid);
router.post("/is-verified", isEmailVerified);
router.post("/register", registerAccount);
router.post("/register-free-nft", registerAccountWithFreeNFT);
router.get("/users/:address", getNonce);
router.get("/is-user-auth", verifyJWT, isUserAuthenticated);
router.post("/login", login);
router.post("/login/metamask", loginMetaMask);
router.post("/connect-blockchain", connectBlockchain);
router.post("/register-blockchain", registerBlockchain);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/has-character", hasCharacter);
router.get("/count-accounts", getNumberOfAccounts);
router.post("/tria-login", loginTria);
router.post("/has-reward", getHasReward);
router.post("/delete-player", deletePlayer);

module.exports = router;
