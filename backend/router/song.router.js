import express from 'express'
import {} from '../controller/song.controller'
export const songRouter=express.Router()


songRouter.get('/all',middleware,getallpublic)
songRouter.post('/savesong',middleware,uploadsong)
songRouter.post('/delete',middleware,deletesong)
songRouter.post('/edit',middleware,editsong)