import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;


  if (!username || !email || !password || username === "" || password === "" || email === "") {
    next(errorHandler(400, "all fields are required"));
  }



  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return next(errorHandler(409, "Username or email already exists"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username, email, password: hashedPassword
    });

    await newUser.save();
    res.json({ message: "Signup successful" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { password, email } = req.body;
  if (!email || !password || password === "" || email === "") {
    next(errorHandler(400, "all fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser?.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid Password"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const { password: passwd, ...rest } = validUser._doc;

    res.status(200).cookie("access_token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 }).json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "6h" });
      const { password, ...rest } = user._doc;
      res.status(200).cookie("access_token", token, {
        httpOnly: true,
      }).json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: name.toLowerCase().split("").join("") + Math.random().toString(10).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "6h" });

      const { password, ...rest } = newUser._doc;

      res.status(200).cookie("access_token", token,
        { httpOnly: true, maxAge: 60 * 60 * 1000 }).json(rest);
    }

  } catch (error) {
    next(errorHandler(500, error.message));
  };
};