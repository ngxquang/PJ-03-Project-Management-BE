import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";

import projectRoutes from "./routes/projectRoute";
import taskRoutes from "./routes/taskRoute";
import searchRoutes from "./routes/searchRoute";
import userRoutes from "./routes/userRoute";
import teamRoutes from "./routes/teamRoute";

// Configuration middleware
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


// routes
app.get("/", (req, res) => {
    res.send("This is home route");
});

app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/search", searchRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);

const prisma = new PrismaClient;

app.post("/create-user", async(req: Request, res: Response) => {
    try { 

        const { 
            username,
            cognitoId,
            profilePictureUrl = "i1.jpg",
            teamId = 1,
        } = req.body;

        const newUser = await prisma.user.create({
            data: {
                username,
                cognitoId,
                profilePictureUrl,
                teamId,
            },
        });
        res.json({ message: "User Create Successfully", newUser });
    } catch (error: any) {
        res.status(500).json({ message: `Err finding users: ${error.message}` });
    }
})

// Server
const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port: ${port}`);
})
