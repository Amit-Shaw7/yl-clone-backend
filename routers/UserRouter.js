import express from 'express';
import { deleteUser, getUser, subscribeChannel, unsubscribeChannel, updateUser } from '../controllers/UserController.js';
import { verifyToken } from '../VerifyToken.js';
const UserRouter = express.Router();

// update user , delete user
UserRouter.route('/:id')
.put(verifyToken , updateUser)
.delete(verifyToken , deleteUser)

// get user  
UserRouter.route('/find/:id')
.get(getUser)

// subscribe a channel
UserRouter.route('/sub/:channelId')
.put(verifyToken , subscribeChannel);

// unscbscribe a channel
UserRouter.route('/unsub/:channelId')
.put(verifyToken , unsubscribeChannel);

// // like a video
// UserRouter.route('/like/:vidId')
// .put(verifyToken , likeVid);

// // dislike a video
// UserRouter.route('/dislike/:vidId')
// .put(verifyToken , dislikeVid);



export default UserRouter;