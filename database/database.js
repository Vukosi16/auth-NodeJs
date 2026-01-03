import mongoose from "mongoose";

const dbconnection = async () => {
    try {
        await mongoose.connect(process.env.db_uri);
        console.log("Database connected successfully!");
    } catch (error) {
        console.error("connection failed");
        process.exit(1);
    }
}

export default dbconnection;