import { RequestHandler } from "express";
import User from "../models/User.js";
import { compareSync, hashSync } from "bcryptjs";

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

type SignupBody = LoginBody & {
  name?: unknown;
};

export const getAllUsers: RequestHandler = async (_req, res, next) => {
  let users;

  try {
    users = await User.find().select("-password");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }

  return res.status(200).json({ users });
};

export const signup: RequestHandler<{}, unknown, SignupBody> = async (
  req,
  res,
  next,
) => {
  const { name, email, password } = req.body ?? {};

  if (
    typeof name !== "string" ||
    name.trim() === "" ||
    typeof email !== "string" ||
    email.trim() === "" ||
    typeof password !== "string" ||
    password.length < 6
  ) {
    res.status(422).json({ message: "Invalid data" });
    return;
  }

  const hashedPassword = hashSync(password);

  let user;

  try {
    user = await User.create({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
    });
    await user.save();
  } catch (err) {
    console.log(err);
  }

  if (!user) {
    return res.status(500).json({ message: "Unexpected error occur" });
  }

  return res.status(201).json({ user });
};

export const login: RequestHandler<{}, unknown, LoginBody> = async (
  req,
  res,
  next,
) => {
  const { email, password } = req.body ?? {};

  if (
    typeof email !== "string" ||
    email.trim() === "" ||
    typeof password !== "string" ||
    password.length < 6
  ) {
    res.status(422).json({ message: "Invalid data" });
    return;
  }

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email.trim() });
  } catch (err) {
    console.log(err);
  }

  if (!existingUser) {
    return res.status(404).json({ message: "No user found" });
  }

  const isPasswordCorrect = compareSync(password, existingUser.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  return res
    .status(200)
    .json({ id: existingUser._id, message: "Login successful" });
};
