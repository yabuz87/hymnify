import express from 'express'
import {protectRoute } from "../middleware/auth.middleware.js"
import {uploadSong,getallpublic,deletesong,editsong} from '../controller/song.controller.js'
export const songRouter=express.Router()



songRouter.get('/all',getallpublic)
songRouter.post('/uploadsong',uploadSong)
songRouter.post('/delete',protectRoute,deletesong)
songRouter.post('/edit',protectRoute,editsong)
