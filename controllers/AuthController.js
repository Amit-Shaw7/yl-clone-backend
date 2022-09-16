import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserModel from '../models/UserModel.js';
import { createError } from '../error.js';


// SIGN UP
export const signup = async (req, res, next) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return next(createError(500, "Empty feild recieved"))
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        const newUser = await UserModel({ ...req.body, password: hash });
        const saved = await newUser.save();
        if (saved) {
            return res.status(200).json({
                msg: "User created succesfully",
                data: saved
            })
        }
    } catch (error) {
        next(error);
    }
}

// SIGN IN
export const signin = async (req, res, next) => {
    if (!req.body.password || !req.body.email) { return next(createError(200, "Empty Field recieved")) }

    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) { return next(createError(404, "User not found")); }

        const verified = bcrypt.compare(req.body.password, user.password);
        if (!verified) { return next(createError(400, "Invalid Credentials")); }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const { password, ...others } = user._doc;
        res.cookie("access_token", token, {
            httpOnly: true,
            origin: 'http://localhost:3000'
        }).status(200).json({ user: others , token });
    } catch (error) {
        next(error);
    }
}

// GOOGLE
export const signWithGoogle = async (req, res, next) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.cookie("access_token", token, {
                httpOnly: true,
                origin: 'http://localhost:3000'
            }).status(200).json({ user: user._doc , token: token});
        } else {
            const newUser = new UserModel({ ...req.body, fromGoogle: true });
            const savedUser = await newUser.save();
            if (savedUser) {
                const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
                res.cookie("access_token", token, {
                    httpOnly: true,
                    origin: 'http://localhost:3000'
                }).status(200).json({ user: savedUser._doc , token: token });
            }
        }
    } catch (error) { return next(error) }
}

export const logout = async (req, res, next) => {
    try {
        res.cookie("access_token", "", {
            httpOnly: true,
            origin: 'http://localhost:3000',
            expire: Date.now()
        }).status(200).json("Logout succesfull");
    } catch (error) { return next(error) }
}