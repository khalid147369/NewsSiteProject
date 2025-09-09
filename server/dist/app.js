"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const PostRoutes_1 = __importDefault(require("./routes/PostRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const connect_1 = require("./db/connect");
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const corsOptions = {
    origin: "https://newssiteprojectclient.onrender.com", // tu frontend en Render
    credentials: true, // permite enviar cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((0, cors_1.default)(corsOptions));
app.options("*", (0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/users", userRoutes_1.default);
app.use("/api/posts", PostRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
// app.use('/api/admin', auth);
app.get("/", (req, res) => {
    res.send("API is running");
});
const PORT = process.env.PORT || 5000;
(0, connect_1.connectDB)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
});
