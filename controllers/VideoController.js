import { createError } from "../error.js";
import UserModel from "../models/UserModel.js";
import VideoModel from "../models/VideoModel.js"


// VIDEO CRUD-------------------------------------------------------------------
export const addVideo = async (req, res, next) => {
    if (!req.body) { return next(createError(500, "Empty feild recieved")); }
    try {
        const newVideo = await VideoModel({ userId: req.user.id, ...req.body })
        const savedVideo = await newVideo.save();
        if (savedVideo) {
            return res.status(200).json({
                msg: "Video added succesfully",
                data: savedVideo
            });
        }
    } catch (error) { return next(error); }
}//done
export const getVideo = async (req, res, next) => {
    try {
        const video = await VideoModel.findById(req.params.videoId);
        if (!video) { return next(createError(404, "Video not found")); }

        return res.status(200).json({
            msg: "Video fetched succesfully",
            video
        });
    } catch (error) { return next(error); }
}//done
export const updateVideo = async (req, res, next) => {
    try {
        const video = await VideoModel.findById(req.params.videoId);
        if (!video) { return next(createError(404, "Video not find")); }
        if (video.userId === req.user.id) {

            const updatedVideo = await VideoModel.findByIdAndUpdate(req.params.videoId, {
                $set: req.body,
            }, { new: true });
            if (updatedVideo) {
                return res.status(200).json({ msg: "Video updated succesfully", updatedVideo });
            } else {
                return res.json({
                    msg: "Cannot update video"
                })
            }
        } else { return createError(401, "You can only update your video"); }

    } catch (error) { return next(error); }
}//done
export const deleteVideo = async (req, res, next) => {
    try {
        const video = await VideoModel.findById(req.params.videoId);
        if (!video) { return next(createError(404, "Video not find")); }

        if (video.userId === req.user.id) {
            await VideoModel.findByIdAndDelete(req.params.videoId);
            return res.status(500).json({
                msg: "video deleted succesfully"
            });
        } else { return createError(401, "You can only delete your video"); }
    } catch (error) { return next(error); }
}//done

export const addView = async (req, res, next) => {
    try {
        const video = await VideoModel.findByIdAndUpdate(req.params.videoId, {
            $inc: { views: 1 }
        });

        return res.status(200).json({
            msg: "Viewed succesfully",
        });
    } catch (error) { return next(error); }
}//done

export const getRandomVideo = async (req, res, next) => {
    // console.log("Running");
    try {
        const videos = await VideoModel.aggregate([{ $sample: { size: 20 } }]);
        return res.status(200).json({
            msg: "Random Videos fetched succesfully",
            videos
        });
    } catch (error) { return next(error); }
}//done

export const getTrendingVideo = async (req, res, next) => {
    try {
        const videos = await VideoModel.find().sort({ views: -1 });

        return res.status(200).json({
            msg: "Trending Video fetched succesfully",
            videos
        });
    } catch (error) { return next(error); }
}//done

export const getSubscribedVideo = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user.id);
        const subscribedChannels = user.subscribedUsers;

        const videoList = await Promise.all(
            subscribedChannels.map((channelId) => {
                return VideoModel.find({ userId: channelId });
            })
        );
        if (videoList) {
            return res.status(200).json({
                msg: "SUbscribed Video fetched succesfully",
                videos: videoList.flat().sort((a, b) => b.createdAt - a.createdAt)
            });
        } else { return next(createError(500, "!! Some internal error occured !!")); }
    } catch (error) { return next(error); }
}

export const likeVid = async (req, res, next) => {
    try {
        const video = await VideoModel.findByIdAndUpdate(req.params.videoId, {
            $addToSet: { likes: req.user.id },
            $pull: { disLikes: req.user.id }
        });
        // For Liked Videos feature

        if (video) { return res.status(200).json({ msg: "Video liked succesfully" }) }
        else { return next(createError(500, "Some internal problem occured")) }
    } catch (error) { return next(error) }
}//done
export const dislikeVid = async (req, res, next) => {
    try {
        const video = await VideoModel.findByIdAndUpdate(req.params.videoId, {
            $addToSet: { disLikes: req.user.id },
            $pull: { likes: req.user.id }
        });
        // For liked video feature

        if (video) { return res.status(200).json({ msg: "Video disliked succesfully" }) }
        else { return next(createError(500, "Some internal problem occured")) }
    } catch (error) { return next(error) }
}//done

export const getVideoByTag = async (req, res, next) => {
    const tags = req.query.tags.split(",");
    try {
        const videos = await VideoModel.find({ tags: { $in: tags } }).limit(20);
        if (videos) {
            return res.status(200).json({
                msg: "Tags search succesfully",
                videos
            });
        }
    } catch (error) { return next(error); }
}
export const getVideoByTitle = async (req, res, next) => {
    const title = req.query.title;
    try {
        const videos = await VideoModel.find({ title: { $regex: title, $options: "i" } });

        return res.status(200).json({
            msg: "Trending Video fetched succesfully",
            videos
        });
    } catch (error) { return next(error); }
}