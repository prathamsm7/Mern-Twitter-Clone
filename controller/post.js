const { findById } = require("../models/posts");
const Post = require("../models/posts");
const User = require("../models/user");

//New Post
exports.newPost = async (req, res) => {
  let img;
  if (!req.file) {
    img = "";
  } else {
    img = req.file.path;
  }

  const post = await new Post({
    content: req.body.content,
    postedBy: req.user,
    image: img,
  });

  post
    .save()
    .then((post) => {
      // console.log(post);
      return res.json(post);
    })
    .catch((err) => {
      // console.log(err);
      return res.status(400).json({
        error: err,
      });
    });
};

//Get all Post
exports.getAllPost = async (req, res) => {
  const filter = req.query;
  const results = await Post.find(filter)
    .populate("postedBy")
    .populate("comments")
    .sort({ _id: -1 });

  // console.log(results);
  await User.populate(results, { path: "comments.commentBy" }).then(
    (posts, err) => {
      if (err) {
        return res.status(400).json({
          error: "Something Went Wrong",
        });
      }
      return res.json(posts);
    }
  );
};

// DONE:
//Get post Id
exports.getPostId = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy likes", "firstName lastName email")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({
          error: err,
        });
      }
      req.post = post;
      next();
    });
};

//Get post
exports.getPost = (req, res) => {
  return res.json(req.post);
};

//Like post
exports.likePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;
  const user = await User.findById(userId)
    .then((user) => {
      if (user.likes.includes(postId)) {
        user.likes.pull(postId);
      } else {
        user.likes.addToSet(postId);
      }
      user.save();
    })
    .catch((err) => {
      // console.log(err);
    });

  const post = await Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(400).json({
          error: "Post Not found",
        });
      }

      if (post.likes.includes(userId)) {
        post.likes.pull(userId);
      } else {
        post.likes.addToSet(userId);
      }

      post.save();
      return res.json(post);
    })
    .catch((err) => {
      // console.log(err);
    });
};

exports.createComment = async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.postId;

  const comment = {
    text: req.body.text,
    commentBy: req.user,
  };

  await User.findByIdAndUpdate(
    userId,
    {
      $push: { replyTo: postId },
    },
    {
      new: true,
    }
  );

  await Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.commentBy", "_id firstName lastName")
    .exec((err, post) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      } else {
        res.json(post);
      }
    });
};
