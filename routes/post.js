const express = require("express");
const router = express.Router();

const {
  newPost,
  getAllPost,
  getPostId,
  getPost,
  likePost,
  createComment,
  myPost,
} = require("../controller/post");
const {
  getUserById,
  isSignedIn,
  isAuthenticated,
} = require("../controller/auth");

const upload = require("../multer");

router.param("userId", getUserById);
router.param("postId", getPostId);

router.post(
  "/newpost/:userId",
  upload.single("image"),
  isSignedIn,
  isAuthenticated,
  newPost
);

router.get("/posts", getAllPost);

router.get("/post/:postId/:userId", isSignedIn, isAuthenticated, getPost);

router.patch(
  "/post/:postId/like/:userId",
  isSignedIn,
  isAuthenticated,
  likePost
);

router.put(
  "/post/:postId/comments/:userId",
  isSignedIn,
  isAuthenticated,
  createComment
);

module.exports = router;
