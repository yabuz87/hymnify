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

const allowedOrigins = [
  'https://hymnify.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
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
// Start server only after connecting to MongoDB
connect().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error("Failed to start server due to MongoDB connection error:", err);
});