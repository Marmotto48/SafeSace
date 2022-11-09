// const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinaryConfig");
const User = require("../models/userSchema");
const { registerValidation, loginValidation } = require("../middleware/Joi");
const cache = require("../config/redisConfig");
module.exports = {
  //register new user
  register: async (req, res) => {
    try {
      const errors = [];
      //Validation
      const { error } = registerValidation(req.body);
      if (error) {
        const { details } = error;
        details.forEach((item) => errors.push(item.message));
        return res.json({ status: 406, msg: errors });
      }

      const {
        role,
        fullname,
        email,
        password,
        dateOfBirth,
        gender,
        avatar,
        clinic,
        phone,
        bio,
        address,
      } = req.body;
      //unique email
      const searchEmail = await User.findOne({ email });
      if (searchEmail) {
        return res.status(400).send({ msg: "Email already exists." });
      }
      const roleVald = await User.findOne({ role });
      if (!roleVald) {
        return res
          .status(400)
          .send({ msg: "Are you a regular user or a Doctor?" });
      }
      //hash password
      const salt = 10;
      const genSalt = bcrypt.genSaltSync(salt);
      const hashedPW = await bcrypt.hash(password, genSalt);
      //save new user //token
      const newUser = await User.create({
        role,
        fullname,
        email,
        password: hashedPW,
        dateOfBirth,
        gender,
        avatar,
        clinic,
        phone,
        bio,
        address,
      });
      //Token
      const token = jwt.sign(
        {
          role: newUser.role,
          fullname: newUser.name,
          clinic: newUser.clinic,
          phone: newUser.phone,
          email: newUser.email,
          id: newUser._id,
        },
        process.env.SecretKey
      );
      res.status(201).json({ user: newUser, token });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        msg: "Cannot save new user please check your information again.",
        error,
      });
    }
  },

  //login user
  login: async (req, res) => {
    try {
      // const errors = [];
      // //Validation
      // const { error } = loginValidation(req.body);
      // if (error) {
      //   const { details } = error;
      //   details.forEach((item) => errors.push(item.message));
      //   return res.json({ status: 406, msg: errors });
      // }

      const { email, password } = req.body;
      //   find if the user exist
      const searchedUser = await User.findOne({ email });
      //if the email does not exist
      if (!searchedUser) {
        return res.status(400).send({
          msg: "Not a member ? Join our community !",
        });
      }

      // password are equals
      const match = await bcrypt.compare(password, searchedUser.password);
      if (!match) {
        return res.status(400).send({ msg: "Incorrect email or password." });
      }

      // generate token
      const token = jwt.sign(
        { id: searchedUser._id, fullname: searchedUser.fullname },
        process.env.SecretKey
      );
      res.status(201).json({
        user: searchedUser,
        msg: "Success",
        token,
      });
    } catch (error) {
      res.status(500).send({ msg: "Can not login user.", error });
    }
  },
  // get one user by id
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      res.json(user);
    } catch (error) {
      res.status(500).json({ msg: "Can not get user.", error });
    }
  },
  //Update profile by id
  updateProfile: async (req, res) => {
    try {
      const {
        fullname,
        email,
        gender,
        clinic,
        phone,
        dateOfBirth,
        bio,
        clinicAddress,
      } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          fullname,
          email,
          gender,
          clinic,
          phone,
          dateOfBirth,
          bio,
          clinicAddress,
        },
        { new: true }
      );
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Can not update profile.", error });
    }
  },
  //update avatar
  // updateImg: async (req, res) => {
  //   try {
  //     const docImgInfo = await cloudinary.uploader.upload(req.file.path);
  //     const existPost = await Doc.findById(req.params.id);
  //     cloudinary.uploader.destroy(existPost.image.public_id);
  //     const updatedPost = await Doc.findByIdAndUpdate(req.params.id, {
  //       image: { imageURL: docImgInfo.url, public_id: docImgInfo.public_id },
  //     });

  //     res.json(updatedPost);
  //   } catch (error) {
  //     res.status(500).send({ msg: "can not upload profile avatar", error });
  //     console.log(error);
  //   }
  // },
  //get all doctors
  deleteUser: async (req, res) => {
    try {
      const deleteUser = await User.findByIdAndDelete(req.params.id);
      res.json({ msg: "User deleted.", deleteUser });
    } catch (error) {
      res.status(500).json({ msg: "Can not delete user.", error });
    }
  },
  //get users
  getUsers: async (req, res) => {
    try {
      const users = await User.find({
        $and: [{ role: { $ne: "Admin" } }, { id: { $ne: req.userID } }],
      }).select("-password");
      res.json(users);
    } catch (error) {
      res.status(500).send({ msg: "can not get users", error });
    }
  },

  getDoc: async (req, res) => {
    try {
      const doc = await User.find({ role: "Doctor" })
        .cache(120)
        .select("-password");
      res.json(doc);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Can not get doctor user.", error });
    }
  },
  //ipdate avatar
  updateAvatar: async (req, res) => {
    try {
      const imageInfo = await cloudinary.uploader.upload(req.file.path);
      const existUser = await User.findById(req.params.id);
      // cloudinary.uploader.destroy(existUser.image.public_id);
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        image: { imageURL: imageInfo.url, public_id: imageInfo.public_id },
      });
      res.json(updatedUser);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  },
  //get users
  searchUser: async (req, res) => {
    try {
      const keyword = req.query.search
        ? {
            $or: [
              { fullname: { $regex: req.query.search, $options: "i" } },
              { email: { $regex: req.query.search, $options: "i" } },
            ],
          }
        : {};

      const users = await User.find(keyword).find({
        $and: [{ role: { $ne: "Admin" } }, { _id: { $ne: req.userID } }],
      });
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Can not get user.", error });
    }
  },
};
