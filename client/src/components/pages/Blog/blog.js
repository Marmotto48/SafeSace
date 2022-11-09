import React, { useEffect } from "react";
import "./blog.css";
import { BsFillChatDotsFill, BsStarFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { getPublicPosts } from "../../../redux/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { CircularIndeterminate } from "../../MUI/Spinner";

import Sidebar from "./sidebar";
const Blog = () => {
  const linkStyle = {
    color: "inherit",
    textDecoration: "inherit",
  };

  const dispatch = useDispatch();
  const post = useSelector((state) => state.posts);
  const { error, loading } = useSelector((state) => state.posts);

  //get all posts
  useEffect(() => {
    dispatch(getPublicPosts());
  }, [dispatch]);

  return (
    <div className="blog">
      <div className="banner">
        <span className="banner-title">
          <span>Discover our </span>
          <h1>Articles</h1>
        </span>
      </div>
      <div style={{ padding: "50px" }}>
        <div className="blog-content">
          {error ? (
            <>Oh no, there was an error</>
          ) : loading ? (
            <CircularIndeterminate />
          ) : (
            <></>
          )}
          <div className="blog-posts">
            {post.posts &&
              post.posts.map((post) => {
                // date and time format
                const postNewDate = new Date(
                  post.createdAt
                ).toLocaleDateString();
                const postTime = new Date(post.createdAt).toLocaleTimeString();
                return (
                  <div key={post._id}>
                    <div className="blog-container">
                      <div className="blog-author">
                        <img
                          id="blog-docImg"
                          src={post.author.avatar.imageURL}
                          alt=""
                        />
                        <span>
                          <h4 id="bar">{post.author.fullname}</h4>
                          <Link to={{ pathname: "/doctors" }} style={linkStyle}>
                            {post.author.role}
                          </Link>
                        </span>
                      </div>
                      {/* <div className="blog-devide"></div> */}
                      <div className="second-part">
                        <Link to={`/blog/post/${post._id}`} style={linkStyle}>
                          <h4>{post.title}</h4>
                        </Link>
                        <p
                          dangerouslySetInnerHTML={{ __html: post.description }}
                          className="blog-descrip"
                          id="editor"
                        >
                          {/* {post.description} */}
                        </p>
                        <div className="blog-tags">
                          <button>anxiety</button>
                          <button> OCD </button>
                          <button>stress</button>
                        </div>
                      </div>
                      {/* <div className="blog-devide"></div> */}
                      <div className="blog-footer">
                        <p>{`${postNewDate} ${postTime}`}</p>
                        <span className="blog-icons">
                          <BsFillChatDotsFill style={{ margin: "7px" }} />
                          {post.comments.length}
                          <BsStarFill
                            style={{ color: "goldenrod", margin: "7px" }}
                          />
                          {post.likes.length}
                        </span>
                      </div>
                      <div className="blog-devide"></div>
                    </div>
                  </div>
                );
              })}
          </div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default Blog;
