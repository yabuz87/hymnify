import React from 'react'
import axios from "axios";

export const axiosInstance=axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true,
});
