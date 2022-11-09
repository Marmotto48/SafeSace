const Post = require("../models/postSchema");
const cache = require("../config/redisConfig");

//post routes controll
module.exports = {
  newPost: async (req, res) => {
    try {
      const { title, description, private, category, private_2 } = req.body;
      const newPost = await Post.create({
        title,
        description,
        author: req.userID,
        private,
        category,
        private_2,
      });
      res.json(newPost);
    } catch (error) {
      res.status(500).send({ msg: error });
      console.log(error);
    }
  },
  getPosts: async (req, res) => {
    try {
      const posts = await Post.find({}).populate("author", "-password");
      res.json(posts);
    } catch (error) {
      res.status(500).send({ msg: "can not get posts", error });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { description, title } = req.body;
      const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
        description,
        title,
      });
      res.json({ msg: "Post upadated.", updatedPost });
    } catch (error) {
      res.status(500).json({ msg: "can not update post", error });
    }
  },

  likes: async (req, res) => {
    try {
      const postId = req.params.id;
      const existPost = await Post.findById(postId);
      const liked = await existPost.likes.find((like) => like == req.userID);
      if (liked) {
        const updatedPost = await Post.findByIdAndUpdate(postId, {
          $pull: { likes: req.userID },
        });
        res.json(updatedPost);
      } else {
        const updatedPost = await Post.findByIdAndUpdate(postId, {
          $push: { likes: req.userID },
        });
        res.json(updatedPost);
      }
    } catch (error) {
      res.status(500).json({ msg: "Can not like post.", error });
      console.log(error);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate("author", "-password")
        .populate("comments.commentOwner", "-password ");
      res.json(post);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error });
    }
  },
  addComment: async (req, res) => {
    try {
      const { desc } = req.body;
      const newPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $push: { comments: { commentOwner: req.userID, desc } },
        },
        { new: true }
      )
        .populate("author")
        .populate("comments.commentOwner", "-password");
      res.json({ msg: "Comment added.", newPost });
    } catch (error) {
      res.status(500).send({ msg: "can not add comment.", error });
    }
  },
  deleteComment: async (req, res) => {
    // try {
    //   const post = await Post.findById(req.params.id);

    //   // Pull out comment
    //   const comment = post.comments.findByIdAndDelete(
    //     (comment) => comment.id === req.params.comment_id
    //   )

    //   await post.save();

    //   res.json(post.comments);
    try {
      // Schema.updateOne(
      //   { cn: req.params.name },
      //   { $pullAll: { uid: [req.params.deleteUid] } }
      // );
      const deleteComment = await Post.findByIdAndUpdate(req.params.id, {
        $pull: { comments },
      });
      res.json({ msg: "Comment deleted.", deleteComment });
    } catch (error) {
      res.status(500).send({ msg: "can not delete comment.", error });
      console.log(error);
    }
  },
  getPrivatePosts: async (req, res) => {
    try {
      const posts = await Post.find({ private_2: "Private" }).populate(
        "author",
        "-password"
      );

      res.json(posts);
    } catch (error) {
      res.status(500).json({ msg: "can not get private posts", error });
    }
  },
  deletePost: async (req, res) => {
    try {
      const deletePost = await Post.findByIdAndDelete(req.params.id);
      res.json({ msg: "Post deleted.", deletePost });
    } catch (error) {
      res.status(500).json({ msg: "Can not delete post.", error });
    }
  },
  getUserPosts: async (req, res) => {
    try {
      const posts = await Post.find({ author: req.params.userId }).populate(
        "author",
        "-password"
      );
      res.json(posts);
    } catch (error) {
      res.status(500).send({ msg: "can not get private posts", error });
      console.log(error);
    }
  },
  getPublicPosts: async (req, res) => {
    try {
      const products = await Post.find({ private_2: "Public" }).populate(
        "author",
        "-password"
      );
      // .cache(120);
      res.json(products);
    } catch (error) {
      console.log(error);
    }
  },
  getTopLiked: async (req, res) => {
    const posts = await Post.find({}).sort({ likes: -1 }).limit(3);
    res.json(posts);
  },
  getCUPosts: async (req, res) => {
    try {
      const posts = await Post.find({ author: req.userID })
        .sort({
          createdAt: 1,
        })
        .populate("author", "-password");
      res.json(posts);
    } catch (error) {
      console.log(error);
      res.status(500).send({ msg: "can not get posts", error });
    }
  },
  getCUComments: async (req, res) => {
    try {
      const posts = await Post.find({ comments: { commentOwner: req.userID } })
        .sort({
          createdAt: 1,
        })
        .populate("author", "-password");
      res.json(posts);
    } catch (error) {
      console.log(error);
      res.status(500).send({ msg: "can not get posts", error });
    }
  },
  getCULikes: async (req, res) => {
    try {
      const posts = await Post.find({ comments: { commentOwner: req.userID } })
        .sort({
          createdAt: 1,
        })
        .populate("author", "-password");
      res.json(posts);
    } catch (error) {
      console.log(error);
      res.status(500).send({ msg: "can not get posts", error });
    }
  },
};
