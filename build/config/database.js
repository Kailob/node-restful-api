"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_js_1 = require("./env.js");
const connectDB = async () => {
    await mongoose_1.default
        .connect(env_js_1.db.URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    })
        .then(() => {
        console.log("Successfully connected to database");
    })
        .catch((error) => {
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
    });
};
exports.default = connectDB;
//# sourceMappingURL=database.js.map