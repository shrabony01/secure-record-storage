import express from "express";
import {User} from "../../models/index.js";
import { signToken } from "../../utils/auth.js";

const router = express.Router();

//POST: create new user
router.post("/register",async(req, res)=>{
    try{
        const user = await User.create(req.body);
        const token = signToken(user);
        res.status(201).json({token,user});
    }catch(err){
        res.status(400).json(err);
    }
});
//Authenticate user and issue token
router.post("/login",async(req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email});

        if(!user){
            return res.status(400).json({ message: "Can't find this user" });
        }
        const correctPw = await user.isCorrectPassword(req.body.password);

        if(!correctPw){
            return res.status(400).json({message: "Wrong password!"});
        }
        const token = signToken(user);
        res.json({ token, user });
    }catch(err){
        res.status(500).json(err);
    }
});
export default router;