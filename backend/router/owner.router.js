import express from 'express'
import Owner from '../model/owner.model.js'
import {loginAdmin,loginClient,logoutAdmin,signUp,logoutClient,verifyEmail,checkAuth} from "../controller/ownership.controller.js"
import { protectRoute } from '../middleware/auth.middleware.js';
export const ownerRouter=express.Router()

ownerRouter.post("/signup",signUp);
ownerRouter.post("/login",loginAdmin);
ownerRouter.post("/verify",verifyEmail);
ownerRouter.post("/logout",logoutAdmin);
ownerRouter.post("/client/login",loginClient);
ownerRouter.post("/client/logout",logoutClient);
ownerRouter.get("/check", protectRoute, checkAuth);