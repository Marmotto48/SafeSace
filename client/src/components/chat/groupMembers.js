import React, { useState, useEffect, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import AvatarGroup from "@mui/material/AvatarGroup";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import { BsCheckCircle } from "react-icons/bs";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import {
  addMember,
  removeMember,
  updateGroupName,
} from "../../redux/chatSlice";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import SelectedUsers from "./selectedUsers";
import EditIcon from "@mui/icons-material/Edit";
import { getMessages } from "../../redux/messageSlice";
import "./chatroom.css";
// var socket, selectedChatCompare;

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function SimpleDialogDemo({ chat, user, socket }) {

  // ** States
  const [open, setOpen] = useState(false);
  //eslint-disable-next-line
  const [dense, setDense] = useState(false);
  const [chatName, setChatName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [userId, setUserId] = useState("");

  // ** Hooks
  const msg = useSelector((state) => state.msg);
  const c = useSelector((state) => state.chat);
  const messageRef = useRef();
  const [notification, setNotification] = useState([]);

  // ** Functions
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  //--------------------------------------update group name----------------------------//
  const dispatch = useDispatch();
  const handleUpdateSubmit = (e, chatId) => {
    e.preventDefault();
    dispatch(updateGroupName({ chatId, chatName }));
  };
  //--------------------------------------remove Member----------------------------//
  const HandleRemoveMember = (e, chat, user1) => {
    if (chat.groupAdmin?._id !== user?._id && user1?._id !== user?._id) {
      alert("You are not the admin of this group!");
      return;
    }
    e.preventDefault();
    dispatch(removeMember({ chatId: chat?._id, userId: user1?._id }));
  };
  //--------------------------------------add Member----------------------------//
  const handleAddMember = (e, chatId) => {
    dispatch(
      addMember({
        chatId,
        userId: JSON.stringify(users.map((u) => u?._id)),
      })
    );
  };
  //----------------------------------------------------------------------------/
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  /*****************************************************************************/
  //eslint-disable-next-line
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  //--------------------------------------Send Msg----------------------------//
  const sendMessage = (e, chat) => {
    if (socket) {
      socket.emit("chatroomMessage", {
        chat,
        message: messageRef.current.value,
      });

      messageRef.current.value = "";
    }
  };

  useEffect(() => {
    if (selectedChat) {
      dispatch(getMessages({ chatId: selectedChat }));
      socket.emit("joinRoom", { chatId: selectedChat });
    }
    setSelectedChat();
  }, [selectedChat, dispatch, socket]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }
    if (socket) {
      socket.on("newMessage", (message) => {
        const newMessages = [...messages, message];
        if (!selectedChat || selectedChat !== message.chatID) {
          console.log(selectedChat);
          setNotification([message, ...notification]);
          console.log(notification);
        } else {
          setMessages(newMessages);
        }
      });
    }
  }, [messages, selectedChat, socket, notification]);

  return (
    <div>
      {/*************************Group chat List ***************************************/}
      <>
        <li className="item" style={{ marginBottom: "40px" }}>
          <input
            type="radio"
            id={chat?._id}
            name="basic_carousel"
            value={chat?._id}
            defaultChecked
          />
          <label htmlFor={chat?._id}>
            <ListItem
              onClick={(e) => {
                setSelectedChat(chat?._id);
              }}
              alignItems="flex-start"
              s
              autoFocus
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={handleClickOpen}
                >
                  <EditIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <AvatarGroup
                  style={{ marginRight: "10px" }}
                  max={3}
                  spacing="small"
                >
                  {chat.users &&
                    chat.users.map((user) => {
                      return (
                        <Avatar
                          alt="Remy Sharp"
                          src={user.avatar.imageURL}
                          style={{ border: 0 }}
                          key={user?._id}
                        />
                      );
                    })}
                </AvatarGroup>
              </ListItemAvatar>
              <ListItemText
                onClick={handleClick}
                style={{
                  cursor: "pointer",
                  "&:hover": {
                    background: "red",
                  },
                }}
                primary={chat.chatName}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      last sender
                    </Typography>
                    {" — I'll be in your neighborh…"}
                  </React.Fragment>
                }
              />
            </ListItem>
          </label>

          <div className="content content_strawberry">
            <div className="box-header with-border">
              <h3 className="box-title">{chat.chatName}</h3>
              <br />
              <h3 className="box-title">
                {chat?._id} = {c.chat?._id}
              </h3>
              <div className="box-tools pull-right">
                <button
                  type="button"
                  className="btn btn-box-tool"
                  data-toggle="tooltip"
                  title="Contacts"
                  data-widget="chat-pane-toggle"
                ></button>
              </div>
            </div>
            <div className="box-body">
              <div className="direct-chat-messages">
                {messages.map((message, i) => (
                  <div key={message?._id}>
                    {message.chatID === chat?._id && (
                      <>
                        {userId === message.userID ? (
                          <div
                            className="direct-chat-msg right"
                            style={{ textAlign: "right" }}
                          >
                            <img
                              className="direct-chat-img"
                              src={message.avatar.imageURL}
                              alt="Message User "
                            />
                            <div className="direct-chat-text">
                              {message.content}
                            </div>
                          </div>
                        ) : (
                          <div className="direct-chat-msg">
                            <div className="direct-chat-info clearfix">
                              <span className="direct-chat-name pull-left">
                                {message.name}
                              </span>
                              <span className="direct-chat-timestamp pull-right">
                                23 Jan 2:00 pm
                              </span>
                            </div>
                            <img
                              className="direct-chat-img"
                              src={message.avatar.imageURL}
                              alt="Message User "
                            />
                            <div className="direct-chat-text">
                              {message.content}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
                {msg.messages &&
                  msg.messages.map((message) => (
                    <div key={message?._id}>
                      {userId === message.sender?._id ? (
                        <div
                          className="direct-chat-msg right"
                          style={{ textAlign: "right" }}
                        >
                          <img
                            className="direct-chat-img"
                            src={message.sender.avatar.imageURL}
                            alt="Message User "
                          />
                          <div className="direct-chat-text">
                            {message.content}
                          </div>
                        </div>
                      ) : (
                        <div className="direct-chat-msg">
                          <div className="direct-chat-info clearfix">
                            <span className="direct-chat-name pull-left">
                              {message.sender.fullname}
                            </span>
                            <span className="direct-chat-timestamp pull-right">
                              23 Jan 2:00 pm
                            </span>
                          </div>
                          <img
                            className="direct-chat-img"
                            src={message.sender.avatar.imageURL}
                            alt="Message User "
                          />
                          <div className="direct-chat-text">
                            {message.content}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
            <div className="input-group">
              <input
                type="text"
                value={newMessage}
                name="message"
                placeholder="Type Message ..."
                className="form-control"
                onChange={(e) => setNewMessage(e.target.value)}
                ref={messageRef}
              />
              <span className="input-group-btn">
                <button
                  type="submit"
                  className="btn btn-primary btn-flat"
                  onClick={(e) => {
                    // sendMsg(e, chat);
                    sendMessage(e, chat);
                    setNewMessage("");
                  }}
                >
                  Send
                </button>
              </span>
            </div>
          </div>
        </li>

        {/*************************Group Member List Modal***************************************/}
        <>
          <Dialog
            onClose={handleClose}
            open={open}
            scroll="paper"
            justify="center"
          >
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
              Members List
            </BootstrapDialogTitle>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <TextField
                label="Change group name"
                id="standard-size-small"
                defaultValue={chat.chatName}
                onChange={(e) => setChatName(e.target.value)}
                size="small"
                variant="standard"
                style={{ marginLeft: "20px", marginRight: "20px" }}
              />
              <IconButton
                onClick={(e) => {
                  handleUpdateSubmit(e, chat?._id);
                }}
              >
                <BsCheckCircle
                  style={{ fontSize: "22px", cursor: "pointer" }}
                />
              </IconButton>
            </Box>
            <Grid item xs={12} md={6}>
              <Demo
                style={{
                  paddingLeft: "50px",
                  paddingRight: "50px",
                }}
              >
                <List
                  dense={dense}
                  style={{
                    width: "350px",
                  }}
                >
                  {chat.users.map((user) => (
                    <div key={user?._id}>
                      <ListItem
                        // {chat.groupAdmin.id === user.id ? (<></>):(<></>)}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={(e) => HandleRemoveMember(e, chat, user)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar alt="" src={user.avatar.imageURL} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.fullname}
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{ display: "inline" }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {user.role}
                              </Typography>
                              {user?._id === chat.groupAdmin?._id
                                ? " — Admin"
                                : " — Member"}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    </div>
                  ))}
                </List>
              </Demo>
            </Grid>
            <ListItem autoFocus button>
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Add account" onClick={handleOpenModal} />
            </ListItem>
            {/*************************Users List Modal***************************************/}

            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={openModal}
              onClose={handleCloseModal}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={openModal}>
                <Box sx={styleModal}>
                  <Typography
                    id="transition-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Text in a modal
                    <IconButton onClick={(e) => handleAddMember(e, chat?._id)}>
                      <BsCheckCircle
                        style={{
                          fontSize: "22px",
                          cursor: "pointer",
                          marginLeft: "20px",
                        }}
                      />
                    </IconButton>
                  </Typography>

                  <SelectedUsers
                    users={users}
                    setUsers={setUsers}
                    user={user}
                  />
                </Box>
              </Fade>
            </Modal>
          </Dialog>
        </>
      </>
    </div>
  );
}
