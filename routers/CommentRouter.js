import express from 'express';
import { addComment, deleteComment, getComments } from '../controllers/CommentController.js';
const CommentRouter = express.Router();
import {verifyToken} from '../VerifyToken.js';

// ADD COMMENT
CommentRouter.route('/')
.post(verifyToken , addComment)

CommentRouter.route('/:id')
.delete(verifyToken , deleteComment)

CommentRouter.route('/find/:videoId')
.get(getComments)


export default CommentRouter;