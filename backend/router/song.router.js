import express from 'express'
import {protectRoute } from "../middleware/auth.middleware.js"
import {uploadsong,getallpublic,deletesong,editsong} from '../controller/song.controller.js'
export const songRouter=express.Router()



songRouter.get('/all',getallpublic)
songRouter.post('/uploadsong',uploadsong)
songRouter.post('/delete',protectRoute,deletesong)
songRouter.post('/edit',protectRoute,editsong)