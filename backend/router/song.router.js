import express from 'express'
import {protectRoute } from "../middleware/auth.middleware.js"
import {uploadSong,getallpublic,deletesong,editsong} from '../controller/song.controller.js'
export const songRouter=express.Router()



songRouter.get('/song/all',getallpublic)
songRouter.post('/song/upload/:ownerId', uploadSong)
songRouter.post('/song/delete',protectRoute,deletesong)
songRouter.post('/song/edit',protectRoute,editsong)
