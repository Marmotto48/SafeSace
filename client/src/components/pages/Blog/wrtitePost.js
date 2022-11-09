import React, { useState, useEffect } from "react";
//import { newPost } from "../../../JS/postSlice";
import "./writePost.css";
import { useDispatch, useSelector } from "react-redux";
import { addpost, loading } from "../../../redux/postSlice";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { AiFillQuestionCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Addapost = () => {
  const dispatch = useDispatch();
  const [postInfo, setPostInfo] = useState({});
  const { loading, error, post } = useSelector((state) => state.posts);
  // const [desc, setDesc] = useState({});
  const handleChange = (e) => {
    setPostInfo({ ...postInfo, [e.target.name]: e.target.value });
  };
  const ondescription = (value) => {
    setPostInfo({ ...postInfo, description: value });
  };

  useEffect(() => {
    if (post) {
      console.log(post);
    }
  }, [post]);
  //modal

  return (
    <>
      {error ? (
        <>Oh no, there was an error</>
      ) : (
        // ) : loading ? (
        // <>Loading...</>
        <div className="write-post">
          <form>
            <h3>Add a new post</h3>
            <div className="addPost-card">
              <p>Title</p>
              <input
                type="text"
                name="title"
                onChange={handleChange}
                placeholder="Title"
              />
              <p>Category</p>
              <div className="select-categ">
                <select
                  name="category"
                  onChange={handleChange}
                  // onChange={handleUpdate}
                >
                  <option value="" name="category">
                    Choose...
                  </option>
                  <option value="Anxiety">Anxiety disorders</option>
                  <option value="children">
                    Behavioural and emotional disorders in children
                  </option>
                  <option value="Bipolar">Bipolar affective disorder</option>
                  <option value="Depression">Depression</option>
                  <option value="DDD">
                    Dissociation and dissociative disorders
                  </option>
                  <option value="Eating">Eating disorders</option>
                  <option value="Paranoia">Paranoia</option>
                  <option value="OCD">Obsessive compulsive disorder</option>
                  <option value="Psychosis">Psychosis</option>
                  <option value="Schizophrenia">Schizophrenia</option>
                  <option value="PTSD">Post-traumatic stress disorder</option>
                  <option value="AD">Adjustment disorders</option>
                  <option value="PD">Personality disorders</option>
                  <option value="FD">Factitious disorders</option>
                  <option value="SGD">Sexual and gender disorders</option>
                  <option value="SSD">Somatic symptom disorders</option>
                  <option value="Tic">Tic disorders</option>
                </select>
                <Link to={{ pathname: "/faq" }}>
                  <AiFillQuestionCircle className="question-icon" />
                </Link>
              </div>
              <p>Description</p>
              {/* <input
              className="desc-input"
              type="text"
              name="description"
              onChange={handleChange}
              placeholder="Description"
            /> */}
              <ReactQuill
                theme="snow"
                onChange={ondescription}
                defaultReadOnly={true}
                // value={postInfo}
                placeholder={"Write something ..."}
                modules={Addapost.modules}
                formats={Addapost.formats}
              />
            </div>
            <div className="addPost-footer">
              <select name="private_2" onChange={handleChange}>
                <option value="" name="private_2">
                  Choose...
                </option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(addpost({ postInfo }));
                  // <Stack sx={{ width: "100%" }} spacing={2}>
                  //   <Alert severity="success">
                  //     This is a success alert — check it out!
                  //   </Alert>
                  // </Stack>;
                  setPostInfo({});
                }}
                className="addPost-btn"
              >
                add post
              </button>
            </div>
          </form>
          <div className="circle-3"></div>
          <div className="circle-4"></div>
          <div className="circle-5"></div>
          <div className="circle-6"></div>
        </div>
      )}
    </>
  );
};

export default Addapost;

Addapost.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Addapost.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];
