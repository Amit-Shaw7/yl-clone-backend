import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const DB_URI = process.env.MONGO_URI;

export const connectToMongo = async () => {
    try {
        const connection = await mongoose.connect(DB_URI);
        if (connection) {
            console.log("Succesfully Connetced to DataBase");
        }
    } catch (error) {
        console.log("Error : " + error.message)
    }
};