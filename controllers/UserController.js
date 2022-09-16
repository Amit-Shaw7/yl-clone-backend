import { createError } from "../error.js"
import UserModel from "../models/UserModel.js";

export const updateUser = async (req, res, next) => {
    if (!req.body) { return next(createError(200, "Empty field recieved")) }
    // Check params id and req.userId is same same client else error
    if (req.params.id === req.user.id) {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true });
            return res.status(200).json({
                msg: "Update Succesfully",
                data: updatedUser
            })
        } catch (error) {
            return next(createError(500, "Internal server error " + error.message))
        }
    } else { return next(createError(401, "You can only update your account")); }
}//done
export const deleteUser = async (req, res, next) => {
    if (!req.body) { return next(createError(200, "Empty field recieved")) }
    // Check params id and req.userId is same same client else error
    if (req.params.id === req.user.id) {
        try {
            const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
            return res.status(200).json({
                msg: "Deleted Succesfully",
                data: deletedUser
            })
        } catch (error) {
            return next(createError(500, "Internal server error " + error.message))
        }
    } else { return next(createError(401, "You can only update your account")); }
}//done
export const getUser = async (req, res, next) => {
    if (!req.body) { return next(createError(200, "Empty field recieved")) }
    try {
        const user = await UserModel.findById(req.params.id);
        return res.status(200).json({
            msg: "User fetched Succesfully",
            user
        })
    } catch (error) {
        return next(createError(500, "Internal server error " + error.message))
    }
}//done

export const subscribeChannel = async (req, res, next) => {
    // Check params id and get channel
    // req.params -> channelId , req.user -> userId
    try {
        const user = await UserModel.findByIdAndUpdate(req.user.id, {
            $push: { subscribedUsers: req.params.channelId }
        });
        const channel = await UserModel.findByIdAndUpdate(req.params.channelId, {
            $inc: { subscribers: 1 }
        });
        return res.status(200).json({
            msg: "Subscribed Succesfullyy",
        })
    } catch (error) {
        return next(createError(500, "Internal server error " + error.message))
    }
}//done
export const unsubscribeChannel = async (req, res, next) => {
    // Check params id and get channel
    // req.params -> channelId , req.user -> userId
    try {
        const user = await UserModel.findByIdAndUpdate(req.user.id, {
            $pull: { subscribedUsers: req.params.channelId }
        });
        const channel = await UserModel.findByIdAndUpdate(req.params.channelId, {
            $inc: { subscribers: -1 }
        });
        return res.status(200).json({
            msg: "UnSubscribed Succesfullyy",
        })
    } catch (error) {
        return next(createError(500, "Internal server error " + error.message))
    }
}//done


