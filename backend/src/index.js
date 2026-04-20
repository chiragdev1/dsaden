import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import executeCodeRoutes from "./routes/executeCode.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";

dotenv.config();
const app = express();

const port = process.env.PORT || 3001;

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
   cors({
      origin: [
         "http://localhost:5173",
         "http://72.60.204.142:5173",
         "https://dsaden.com",
      ],
      credentials: true,
   })
);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executeCodeRoutes);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);

// Home page/ Landing page
app.get("/", (req, res) => {
   res.send("<h1>Welcome to LeetLab🔥</h1>");
});

// Assigning PORT
app.listen(port, () => {
   console.log("Server is running on port", port);
});
