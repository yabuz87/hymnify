import express from 'express'
import Owner from '../model/owner.model.js'
import {loginAdmin,loginClient,logoutAdmin,signUp} from "../controller/ownership.controller.js"
export const ownerRouter=express.Router()

ownerRouter.post("/signup",signUp);



