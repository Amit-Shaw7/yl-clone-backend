import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {connectToMongo} from './db.js';
import UserRouter from './routers/UserRouter.js';
import VideoRouter from './routers/VideoRouter.js';
import CommentRouter from './routers/CommentRouter.js';
import AuthRouter from './routers/AuthRouter.js';
const PORT = 5000;

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true , origin : process.env.FRONTEND_URL}))
// app.use(cors({credentials: true , origin : "http://localhost:3000"}))


app.listen(process.env.PORT || 5000 , async() => {
    console.log("Listening at port : " , process.env.PORT || 5000);
    await connectToMongo();
});

app.use('/api/auths', AuthRouter);
app.use('/api/users', UserRouter);
app.use('/api/videos', VideoRouter);
app.use('/api/comments', CommentRouter);

app.use((err , req , res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong!!";
    return res.status(status).json({
        success : false,
        status,
        message
    })
})