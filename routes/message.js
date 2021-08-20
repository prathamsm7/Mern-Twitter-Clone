const express = require("express");
const router = express.Router();
const { newMessage, getConversation } = require("../controller/message");

router.post("/message", newMessage);
router.get("/message/:conversationId", getConversation);

module.exports = router;
