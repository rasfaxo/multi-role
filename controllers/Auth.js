import { request, response } from "express";
import User from "../models/userModel.js";
import argon2 from "argon2";

export const Login = async (req = request, res = response) => {
  if (!req.body.email) {
    return res.status(400).json({ msg: "Email is required!" });
  }

  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found!" });

  //matching password
  const match = await argon2.verify(user.password, req.body.password);
  if (!match) return res.status(400).json({ msg: "Wrong Password" });
  req.session.userId = user.uuid;
  const uuid = user.uuid;
  const name = user.name;
  const email = user.email;
  const role = user.role;
  res.status(200).json({ uuid, name, email, role });
};

export const Me = async (req = request, res = response) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "please log in to your account" });
  }
  const user = await User.findOne({
    attributes: ["uuid", "name", "email", "role"],
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found!" });
  res.status(200).json({ user });
};

export const logOut = async (req = request, res = response) => {
  req.session.destroy((err) => {
    if (err)
      return res
        .status(400)
        .json({ msg: "Sign out is not available due to restrictions" });
    res.status(200).json({ msg: "you have successfully signed out" });
  });
};
