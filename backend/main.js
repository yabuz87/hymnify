import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const port=process.env.PORT || 5000;
const app=express();


app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb', extended:false}));
app.use(cookieParser());
app.use(cors(
    {
        origin:['http://localhost:5173','https://hymnify.vercel.app'],
    }
));


app.get('/', (req,res)=>{
    res.send('API is running....');
});
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})