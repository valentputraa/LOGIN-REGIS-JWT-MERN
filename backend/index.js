import express from "express";
import dotenv from "dotenv";
import UserRoute from "./routes/UserRoute.js"
import cors from "cors"
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(cookieParser())
app.use(cors({credentials:true, origin:"http://localhost:3000"}))
app.use(express.json())
app.use(UserRoute)

app.listen(5000, console.log('Server running on port 5000'));