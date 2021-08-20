const Message = require("../models/message");

//new message
exports.newMessage = async (req, res) => {
  const newMessage = new Message(req.body);

  await newMessage
    .save()
    .then((message) => {
      // console.log(message);
      return res.json(message);
    })
    .catch((err) => {
      // console.log(err);
      return res.status(400).json({
        error: err,
      });
    });
};

//Messages in conversation
exports.getConversation = async (req, res) => {
  await Message.find({ conversationId: req.params.conversationId })
    .then((message) => {
      // console.log(post);
      return res.json(message);
    })
    .catch((err) => {
      // console.log(err);
      return res.status(400).json({
        error: err,
      });
    });
};
