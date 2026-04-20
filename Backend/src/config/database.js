import mongoose from "mongoose";
import config from "./config.js";
import dns from 'dns';

dns.setServers(['1.1.1.1', '8.8.8.8']);

async function connectToDb() {
    try {
        await mongoose.connect(config.mongodbUri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectToDb;