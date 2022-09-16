import express from 'express';
import { signup, signin, signWithGoogle, logout } from '../controllers/AuthController.js';
import { checkToken } from '../VerifyToken.js';
const AuthRouter = express.Router();

// CREATE A USER
AuthRouter.route('/signup')
    .post(signup);

// SIGN IN
AuthRouter.route('/login')
    .post(signin);

// LOGOUT
AuthRouter.route('/logout')
    .put(logout);

// IS LOGGED IN
AuthRouter.route('/isLoggedIn')
    .get(checkToken);


// GOOGLE AUTH
AuthRouter.route('/google')
    .post(signWithGoogle);

export default AuthRouter;