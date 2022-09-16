import e from "express";
import { createError } from "../error.js"
import CommentModel from "../models/CommentModel.js"

export const addComment = async (req , res , next) => {
    try {
       const newComment = new CommentModel({...req.body , userId : req.user.id})
       const savedComment = await newComment.save();

       if(savedComment){
        return res.status(200).json({
            msg : "Comment added succesfully",
            savedComment
        });
       }else{
        return next(createError(500 , "Cannot add comment"));
       }
    } catch (error) {return next(error)}
}
export const deleteComment = async (req , res , next) => {
    try {
        const comment = await CommentModel.findById(req.params.id);
        if(comment.userId === req.user.id ){
            const deletedComment = await CommentModel.findByIdAndDelete(req.params.id);
            if(deletedComment){
                return res.status(200).json({
                    msg : "Msg deleted succesfully"
                })
            }else{return next(createError(500 , "Cannot delete comment try later"))}
        }else{return next(createError(401 , "You can only delete your comment"))}
    } catch (error) {return next(error)}
}

export const getComments = async (req , res , next) => {
    try {
        const comments = await CommentModel.find({videoId : req.params.videoId});
        if(comments){
            return res.status(200).json({
                msg : "Comments fetched succesfullt",
                comments
            });
        }else{return next(createError(500 , "Cnnot fetch comments"));}
    } catch (error) {return next(error)}
}