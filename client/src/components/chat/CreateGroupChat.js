import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import {
  AiOutlineUserAdd,
  AiOutlineUsergroupAdd,
  AiOutlineSearch,
} from "react-icons/ai";
import { useDispatch } from "react-redux";
import { getUsers } from "../../redux/userSlice";
import { addGroupChatroom } from "../../redux/chatSlice";

import SelectedUsers from "./selectedUsers";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

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

export default function CreateGroup({ user }) {
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");

  const createGroup = (e) => {
    e.preventDefault();
    dispatch(
      addGroupChatroom({
        name: name,
        users: JSON.stringify(users.map((u) => u._id)),
      })
    );
    setName("");
    setUsers([]);
  };
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  return (
    <div>
      <AiOutlineUsergroupAdd
        style={{
          fontSize: "25px",
          cursor: "pointer",
          marginLeft: "20px",
        }}
        onClick={handleOpen}
      />
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Create new group chat !
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <TextField
            id="standard-basic"
            label="Group Name"
            variant="standard"
            style={{ marginBottom: "10px" }}
            onChange={(e) => setName(e.target.value)}
          />

          <SelectedUsers users={users} setUsers={setUsers} user={user} />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={createGroup}>
            Create
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
