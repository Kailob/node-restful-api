import mongoose from 'mongoose';
import { db } from "./env.js";

const connectDB = async () => {
    await mongoose
        .connect(
            db.URI,
            {
                // useNewUrlParser: true,
                // useUnifiedTopology: true,
                // useCreateIndex: true,
                // useFindAndModify: false,
            }
        )
        .then(() => {
            console.log("Successfully connected to database");
        })
        .catch((error) => {
            console.log("database connection failed. exiting now...");
            console.error(error);
            process.exit(1);
        });
};

export default connectDB;