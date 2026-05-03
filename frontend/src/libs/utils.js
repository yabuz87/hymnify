import React from 'react'
import axios from "axios";

export const axiosInstance=axios.create({
    baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5000' : 'https://hymnify.onrender.com',
    withCredentials:true,
});
