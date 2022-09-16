import express from 'express';
import { addVideo, addView, deleteVideo, dislikeVid, getRandomVideo, getSubscribedVideo, getTrendingVideo, getVideo, getVideoByTag, getVideoByTitle, likeVid, updateVideo } from '../controllers/VideoController.js';
import { verifyToken } from '../VerifyToken.js';
const VideoRouter = express.Router();

// GET VIDEO
VideoRouter.route('/find/:videoId')
.get(getVideo)

// CREATE VIDEO
VideoRouter.route('/')
.post(verifyToken , addVideo)


// UPDATE , DELETE VIDEO
VideoRouter.route('/:videoId')
.put(verifyToken , updateVideo)
.delete(verifyToken , deleteVideo)

// LIKE , DSILIKE
VideoRouter.route('/like/:videoId')
.put(verifyToken , likeVid)

VideoRouter.route('/dislike/:videoId')
.put(verifyToken , dislikeVid)

// VIEW++
VideoRouter.route('/view/:videoId')
.put(addView) 

// GET TRENDING VIDEOS
VideoRouter.route('/trend') 
.get(getTrendingVideo) 

// GET RANDOM VIDEOS
VideoRouter.route('/random')
.get(getRandomVideo)

// GET SUBSCRIBED VIDEO
VideoRouter.route('/subscribed')
.get(verifyToken , getSubscribedVideo)

// GET VIDEO BY TAG AND TITLE
VideoRouter.route('/search/tags')
.get(getVideoByTag)
VideoRouter.route('/search/title')
.get(getVideoByTitle)

export default VideoRouter;