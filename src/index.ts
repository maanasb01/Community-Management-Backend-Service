import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDB } from "./db";
import authRouter from "./routes/auth"
import roleRouter from "./routes/role"
import communityRouter from "./routes/community"
import memberRouter from "./routes/member"

connectToDB();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/v1/auth", authRouter);
app.use("/v1/role", roleRouter);
app.use("/v1/community", communityRouter);
app.use("/v1/member", memberRouter);

app.listen(port, () => console.log("Server is Running..."));
