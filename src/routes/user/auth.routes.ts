import express from "express";
import { loginUser, logout, myAccount, refresh, registerUser } from "../../controller/user/auth.controller";
import verifyJWT from "../../middlewares/verifyJwt";
//router initailzed

const router = express.Router();

//different routes
router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route('/refresh').get(refresh)
router.route('/logout').post(logout);
router.route('/my-account').get(verifyJWT,myAccount);
//export
export default router