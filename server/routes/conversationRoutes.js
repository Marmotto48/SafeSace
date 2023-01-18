const express = require("express");
const {
  createChatroom,
  getTwoChatroom,
  getGroupChatroom,
  getSingleChatroom,
  cerateGroup,
  updateGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatController");
const router = express.Router();
const postAuth = require("../middleware/postAuth");


// --------------------------Create Chatroom------------------------------
router.post("/addchatroom", postAuth, createChatroom);
// --------------------------get two users Chatroom------------------------------
router.get("/", postAuth, getTwoChatroom);
// --------------------------get group Chatroom------------------------------
router.get("/groupchat", postAuth, getGroupChatroom);
// -------------------------Get a single chatroom------------------------------
router.get("/singlechat/:id", postAuth, getSingleChatroom);
// --------------------------create group Chatroom------------------------------
router.post("/groupchat", postAuth, cerateGroup);
// --------------------------Update group Chatroom name------------------------------
router.put("/groupchat", postAuth, updateGroup);
// --------------------------Add member to group Chatroom------------------------------
router.put("/addmember", postAuth, addToGroup);
// --------------------------Remove member to group Chatroom------------------------------
router.put("/removemember", postAuth, removeFromGroup);
module.exports = router;
