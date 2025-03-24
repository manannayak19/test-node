const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//register controller
const registerUser = async (req, res) => {
  try {
    //extract user information from req body
    //need to keep in mind the case of our schema items
    const { username, email, password, role } = req.body;

    //check if the user is already existing in the database
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Username already exists. Try again with unique username or email",
      });
    }
    //hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a new user and save
    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newlyCreatedUser.save();

    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "User registeration not successful. Try again.",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred! Try Again.",
    });
  }
};
//login controller
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    //find if current exists in database or not
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user doesn't exist",
      });
    }

    //if the password is correct  or not
    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      return res.status(400).json({
        success: false,
        message: "invalid credentials",
      });
    }

    //create user token to save the session, we will use json webtoken, jwt
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );

    res.status(200).json({
      success: true,
      message: "logged in",
      accessToken,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred! Try Again.",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    //extract old and new password
    const { oldPassword, newPassword } = req.body;

    //find the current logged in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    //check if old password is correct
    const isPasswordMatching = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatching) {
      return res.status(400).json({
        success: false,
        message: "old password is not correct",
      });
    }

    //hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    //update user password 
    user.password = newHashedPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    })

  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred! Try Again.",
    });
  }
};

module.exports = { registerUser, loginUser, changePassword };
