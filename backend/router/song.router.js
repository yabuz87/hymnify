import express from 'express'
import {protectRoute } from "../middleware/auth.middleware.js"
import {uploadSong,getallpublic,deleteSong,editsong,getSongsByOwner,deleteAlbum,getPrivateSongsWithAccess} from '../controller/song.controller.js'
export const songRouter=express.Router()



songRouter.get('/song/all',getallpublic)
songRouter.post('/song/private/access', getPrivateSongsWithAccess)
songRouter.get('/song/owner/:ownerId',protectRoute,getSongsByOwner)
songRouter.post('/song/upload/:ownerId',protectRoute,uploadSong)
songRouter.post('/song/delete/:ownerId',protectRoute,deleteSong)
songRouter.post('/song/edit/:ownerId',protectRoute,editsong)
songRouter.post('/album/delete/:ownerId',protectRoute,deleteAlbum)
