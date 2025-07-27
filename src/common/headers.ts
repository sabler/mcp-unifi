import dotenv from 'dotenv'
import { Agent } from 'https';
import axios from 'axios';

dotenv.config({quiet: true})

export const BASE_URL = process.env.BASE_URL;
export const UNIFI_SITE_ID = process.env.UNIFI_SITE_ID;
export const UDM_API_KEY = process.env.UDM_API_KEY;

if (!BASE_URL || !UNIFI_SITE_ID || !UDM_API_KEY) {
    throw new Error('Missing required environment variables');
}

// Create axios instance with proper HTTPS agent for self-signed certificates
export const unifiLocalClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "X-API-Key": UDM_API_KEY,
        Accept: "application/json",
    },
    httpsAgent: new Agent({
        rejectUnauthorized: false,
        keepAlive: true,
        timeout: 10000
    })
});