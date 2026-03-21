import express from 'express'
import Owner from '../model/owner.model.js'
import {loginAdmin,loginClient,logoutAdmin,signUp,logoutClient,verifyEmail} from "../controller/ownership.controller.js"
export const ownerRouter=express.Router()

ownerRouter.post("/signup",signUp);
ownerRouter.post("/login",loginAdmin);
ownerRouter.post("/verify",verifyEmail);
ownerRouter.post("/logout",logoutAdmin);
ownerRouter.post("/client/login",loginClient);
ownerRouter.post("/client/logout",logoutClient);