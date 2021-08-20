const express = require("express");
const router = express.Router();
const {
  newConversation,
  userConversation,
  findConversation,
} = require("../controller/conversation");

router.post("/new", newConversation);
router.get("/conversation/:userId", userConversation);
router.get("/find/:profileId/:userId", findConversation);

module.exports = router;
