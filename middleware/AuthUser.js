import { request, response } from "express";
import User from "../models/userModel.js";


export const verifyUser = async (req = request, res = response, next) => {
    if(!req.session.userId){
        return res.status(401).json({msg: "please log in to your account"})
    }
    const user = await User.findOne({
        where:{
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "User not found"});
    req.userId = user.id;
    req.role = user.role;
    next();

}
export const adminOnly = async (req = request, res = response, next) => {
    const user = await User.findOne({
        where:{
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "User not found"});
    if(user.role !== "admin") return res.status(404).json({msg: "you don't have access"});
    next();
}


