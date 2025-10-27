import express from 'express'
import Owner from '../model/owner.model.js'
import {loginAdmin,loginClient,logoutAdmin,signUp,logoutClient} from "../controller/ownership.controller.js"
export const ownerRouter=express.Router()

ownerRouter.post("/signup",signUp);
ownerRouter.post("/login",loginAdmin);
ownerRouter.post("/logout",logoutClient);
ownerRouter.post("/client/login",loginClient);
ownerRouter.post("/client/logout",logoutAdmin);



