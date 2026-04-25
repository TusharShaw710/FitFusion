import {config} from 'dotenv';

config();


if(!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}

if(!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not defined in environment variables")
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is not defined in environment variables")
}

if(!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
}

if(!process.env.IMAGE_KIT_SECRET){
    throw new Error("IMAGE_KIT_SECRET is not defined in environment variables")
}

if(!process.env.GOOGLE_REDIRECT_URI){
    throw new Error("GOOGLE_REDIRECT_URI is not defined in environment variables")
}




export default {
    port: process.env.PORT || 3000,
    mongodbUri: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    IMAGE_KIT_SECRET: process.env.IMAGE_KIT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI
};