import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connect from './libs/mongodb.js'
import {songRouter} from "./router/song.router.js"
import {ownerRouter} from './router/owner.router.js';
import {statsRouter} from './router/stats.router.js';

dotenv.config();
const port=process.env.PORT || 5000;
const app=express();

app.use(cors({
  origin: true, // This allow all origins and handles requests without origin (like mobile apps)
  credentials: true
}));
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb', extended:false}));
app.use(cookieParser());
app.use(songRouter);
app.use(ownerRouter);
app.use(statsRouter);


app.get('/', (req,res)=>{
    res.send('API is running....');
});
app.listen(port, ()=>{
    connect()
    console.log(`Server is running on port ${port}`);
})