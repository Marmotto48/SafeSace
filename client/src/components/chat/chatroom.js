import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupChatrooms, getTwoChats } from "../../redux/chatSlice";
import Box from "@mui/material/Box";
import { BsFillChatDotsFill } from "react-icons/bs";
import { purple } from "@mui/material/colors";
import {
  AiOutlineUserAdd,
  AiOutlineUsergroupAdd,
  AiOutlineSearch,
} from "react-icons/ai";
import SimpleDialogDemo from "./groupMembers";
import TwoChatList from "./twoChats";
import BasicModal from "./userList";
import CreateGroup from "./CreateGroupChat";
import ChatBox from "./chatBox";
import socketIOClient from "socket.io-client";
import { Card, Grid } from "@mui/material";

export default function Chatroom({ match }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const chat = useSelector((state) => state.chat);

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  //eslint-disable-next-line
  const [show, setShow] = useState(false);
  //-----------------------------------------------SOCKET IO----------------------------------------------------------------
  const [socket, setSocket] = useState("");
  const ENDPOINT = "http://127.0.0.1:5000";
  const socketSetup = () => {
    const token = localStorage.getItem("token");
    if (token) {
      if (token.length > 0 && !socket) {
        const newSocket = socketIOClient(ENDPOINT, {
          query: {
            token: localStorage.getItem("token"),
          },
        });
        newSocket.on("disconnect", () => {
          setSocket(null);
          setTimeout(socketSetup, 3000);
        });
        newSocket.on("connect", () => {});
        setSocket(newSocket);
      }
    }
  };
  useEffect(() => {
    socketSetup();
    //eslint-disable-next-line
  }, []);

  //------------------------Modal--------------------
  useEffect(() => {
    dispatch(getGroupChatrooms());
    dispatch(getTwoChats());
    //eslint-disable-next-line
  }, [dispatch]);
  //***************************************** */

  console.log("first", chat);

  return (
    <div className="chat-test">
      <Grid container spacing={2}>
        <Grid item xs={8} sx={{ margin: "auto" }}>
          <Card sx={{ p: 2, display: "flex", flexDirection: "row", rowGap: 4 }}>
            <Box sx={{ position: "relative" }}>
              <input placeholder="search doc" name="search" />
              <AiOutlineSearch
                style={{
                  fontSize: "22px",
                  marginLeft: "10px",
                  cursor: "pointer",
                  position: "absolute",
                  right: "20px",
                  top: "5px",
                }}
              />
            </Box>

            <CreateGroup user={user} />
            <BasicModal user={user} />
          </Card>
        </Grid>
        <Grid item xs={12}>
          <div id="scene">
            {" "}
            <div id="left-zone">
              <ul className="list">
                {/* {chat.twoChats &&
                  chat.twoChats.map((chat) => {
                    return (
                      <TwoChatList
                        chat={chat}
                        key={chat._id}
                        user={user}
                        socket={socket}
                      />
                    );
                  })} */}

                {chat.chats &&
                  chat.chats.map((chat) => {
                    return (
                      <SimpleDialogDemo
                        chat={chat}
                        key={chat._id}
                        user={user}
                        socket={socket}
                        typing={typing}
                        setTyping={setTyping}
                        setIstyping={setIsTyping}
                        isTyping={isTyping}
                      />
                    );
                  })}
              </ul>
            </div>
            <div id="middle-border"></div>
            <div id="right-zone"></div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
