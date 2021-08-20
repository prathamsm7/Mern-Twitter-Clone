const Conversation = require("../models/conversation");

exports.newConversation = async (req, res) => {
  const newConv = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  await newConv
    .save()
    .then((conv) => {
      // console.log(post);
      return res.json(conv);
    })
    .catch((err) => {
      // console.log(err);
      return res.status(400).json({
        error: err,
      });
    });
};

//User conversation
exports.userConversation = async (req, res) => {
  await Conversation.find({
    members: { $in: [req.params.userId] },
  })
    .then((c) => {
      return res.json(c);
    })
    .catch((err) => {
      return res.status(400).json({
        error: err,
      });
    });
};

// conversation
exports.findConversation = async (req, res) => {
  //Finding conversation
  const conversation = await Conversation.findOne({
    members: { $all: [req.params.profileId, req.params.userId] },
  });

  //If conv not found create new conv
  if (!conversation) {
    // console.log("conv not found");
    // console.log("creating new conv");
    const newConv = await new Conversation({
      members: [req.params.profileId, req.params.userId],
    });
    await newConv
      .save()
      .then((conv) => {
        // console.log("new conv created");
        return res.json(conv);
      })
      .catch((err) => {
        // console.log(err);
        return res.status(400).json({
          error: err,
        });
      });
  }
  //If conversation found return it
  else {
    // console.log("conv already exist");
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.profileId, req.params.userId] },
    })
      .then((c) => {
        return res.json(c);
      })
      .catch((err) => {
        return res.status(400).json({
          error: err,
        });
      });
  }
};
