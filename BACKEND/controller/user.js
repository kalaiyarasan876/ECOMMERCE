import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../middleware/sendMail.js";
import { User } from "../models/User.js";

// ----------New User
export const registerUser = async (req, res) => {
  try {
    // Check email
    const { name, email, password, contact } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User Email Already Exists" });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(Math.random() * 1000000);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      contact
    });
    await newUser.save();

    // Create an activation token
    const activationToken = jwt.sign({ userId: newUser._id, otp },process.env.ACTIVATION_SECRET,
      { expiresIn: "5m" }
    );

    // Send email to user
    const message = `Please verify your account using the following OTP: ${otp}`;
    await sendMail(email, "Welcome to Kalai", message);
    return res.status(200).json({
      message: "OTP sent to your email",
      activationToken
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ----------Verify User
export const verifyUser = async (req, res) => {
  try {
    const { otp, activationToken } = req.body;

    const verify = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);
    if (!verify) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    if (verify.otp !== otp) {
      return res.status(400).json({ message: "Wrong OTP" });
    }

    const user = await User.findById(verify.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // user.verified = true;
    // await user.save();

    // await User.create({
    //   name: verify.user.name,
    //   email: verify.user.email,
    //   password: verify.user.Password,
    //   contact: verify.user.contact
    // });

    return res
      .status(200)
      .json({ message: "User Registration Successfully Verified" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ----------LoginUser
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    //Email Verified
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    //Password Verified
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({
        message: "Invalid Credentials"
      });
    }
    //Generated Signed Token
    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {expiresIn: "15d"});

    //Excluding the password fields before the sending the response...
    const { password: userPassword, ...userDetails } = user.toObject();

    return res.status(200).json({
      message: "Welcome to " + user.name,
      token,
      user: userDetails
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ----------myProfile
export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json({
    user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
