import User from "../models/user.model.js";

export const test = async (req, res) => {
  res.json({ message: "API Working" });

  const { username, email, password } = req.body;
  if (!username || !email || !password || username === "" || password === "" || email === "") {
    return res.status(400).json({ Message: "All fields are required" });
  }

  const newUser = new User({
    username, email, password
  });

  await newUser.save();
  res.json({ message: "Signup successful" });


};