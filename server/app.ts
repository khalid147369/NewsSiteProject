import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/PostRoutes";
import adminRoutes from "./routes/adminRoutes";
import { connectDB } from "./db/connect";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();

const corsOptions = {
  origin: "https://newssiteprojectclient.onrender.com", // tu frontend en Render
  credentials: true, // permite enviar cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);
// app.use('/api/admin', auth);

app.get("/", (req: Request, res: Response) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
