const Chatroom = require("../models/convoSchema");
const User = require("../models/userSchema");

module.exports = {
  createChatroom: async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
      console.log("UserId param not sent with request");
      return res.status(400);
    }

    var isChat = await Chatroom.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.userID } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    const findUser = await User.findById({ _id: userId });

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "fullname avatar email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: findUser.fullname,
        isGroupChat: false,
        users: [req.userID, userId],
      };

      try {
        const createdChat = await Chatroom.create(chatData);
        const FullChat = await Chatroom.findOne({
          _id: createdChat._id,
        }).populate("users", "-password");
        res.status(200).json(FullChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
  },
  getGroupChatroom: async (req, res) => {
    try {
      Chatroom.find({
        users: { $elemMatch: { $eq: req.userID } },
      })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "fullname avatar email",
          });
          res.status(200).json(results);
        });
    } catch (error) {
      res.status(400);
      console.log("error", error);
      throw new Error(error.message);
    }
  },
  getTwoChatroom: async (req, res) => {
    try {
      Chatroom.find({
        $and: [
          { users: { $elemMatch: { $eq: req.userID } } },
          { isGroupChat: false },
        ],
      })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "fullname avatar email",
          });
          res.status(200).json(results);
        });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  },
  getSingleChatroom: async (req, res) => {
    try {
      Chatroom.findById(req.params.id, {
        users: { $elemMatch: { $eq: req.userID } },
      })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "fullname avatar email",
          });
          res.status(200).json(results);
        });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  },
  cerateGroup: async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).json({ message: "Fill all the feilds" });
    }
    const users = JSON.parse(req.body.users);
    if (users.length < 2) {
      return res.status(400).json({ message: "More than 2 users." });
    }
    users.push(req.userID); //add logged in user in the chat
    try {
      const groupChat = await Chatroom.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.userID,
      });

      const fullGroupChat = await Chatroom.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  },
  updateGroup: async (req, res) => {
    const { chatId, chatName } = req.body;
    const updatedName = await Chatroom.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedName) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(updatedName);
    }
  },
  addToGroup: async (req, res) => {
    const userId = JSON.parse(req.body.userId);
    const { chatId } = req.body;
    const added = await Chatroom.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!added) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(added);
    }
  },
  removeFromGroup: async (req, res) => {
    const { chatId, userId } = req.body;
    const removed = await Chatroom.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(removed);
    }
  },
};
