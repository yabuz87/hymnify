import express from 'express'
import {protectRoute } from "../middleware/auth.middleware.js"
import {uploadSong,getallpublic,deleteSong,editsong} from '../controller/song.controller.js'
export const songRouter=express.Router()



songRouter.get('/song/all',getallpublic)
songRouter.post('/song/upload/:ownerId',protectRoute,uploadSong)
songRouter.post('/song/delete/:ownerId',protectRoute,deleteSong)
songRouter.post('/song/edit/:ownerId',protectRoute,editsong)
