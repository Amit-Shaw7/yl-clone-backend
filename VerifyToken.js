import { createError } from "./error.js";
import jwt from 'jsonwebtoken';
import UserModel from "./models/UserModel.js";


export const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token)
    if (!token) { return next(createError(401, "Please login")) }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) { return next(createError(401, "Invalid Token")) }
        req.user = user;
        next()
    });
}
export const checkToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        // console.log(token);
        if (!token) { return next(createError(401, "Please login")) }

        jwt.verify(token, process.env.JWT_SECRET, async (error, user) => {
            if (error) { return next(createError(401, "Invalid Token")) }
            req.user = user;
            const userInfo = await UserModel.findById(user.id);
            const { password, ...others } = userInfo._doc;
            return res.status(200).json({ login: true, user: others })
        });
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
}
