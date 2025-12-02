// src/app/lib/apiServer.ts
import axios from 'axios';

const apiServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export default apiServer;
