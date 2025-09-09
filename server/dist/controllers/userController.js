"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editProfile = exports.editProfilePassword = exports.logout = exports.getUsers = exports.login = exports.register = void 0;
const user_1 = __importDefault(require("../models/user")); // Import the Mongoose User model
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        console.log("Registering user:", { username, email, password });
        const userExists = yield user_1.default.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: "User already exists" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new user_1.default({
            username,
            email,
            password: hashedPassword,
        });
        yield newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
        next(err);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid pasword or username" });
        }
        // Generate JWT access token
        console.log('roles from login: ', user.roles);
        const accessToken = jsonwebtoken_1.default.sign({
            userId: user._id,
            username: user.username,
            role: user.roles,
            email: user.email
        }, 
        // complita anadir authinticacion de deletePosts y rutas que lo necesitan  <>||===============================|
        process.env.JWT_SECRET || "default_secret", { expiresIn: "15m" });
        // Generate JWT refresh token
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET || "default_refresh_secret", { expiresIn: "7d" });
        // Store refresh token in DB for this user
        yield user_1.default.updateOne({ _id: user._id }, { $set: { refreshtoken: refreshToken } });
        // Send refresh token as HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.json({
            message: "Login successful",
            user: { username: user.username, email: user.email, role: user.roles },
            accessToken,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.login = login;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find({}, { password: 0, refreshtoken: 0 }); // Exclude password
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.getUsers = getUsers;
// Add logout endpoint
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
        if (!refreshToken) {
            return res.status(204).json({ message: "No refresh token provided" });
        }
        // Find user by refresh token
        const user = yield user_1.default.findOne({ refreshtoken: refreshToken });
        if (user) {
            // Remove refresh token from user document
            user.refreshtoken = "";
            yield user.save();
        }
        // Clear refresh token cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.logout = logout;
const editProfilePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { previousPassword, newPassword } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // Assuming user ID is stored in req.user by auth middleware
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!previousPassword || !newPassword) {
        return res.status(400).json({ message: "Password not provided" });
    }
    const user = yield user_1.default.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    try {
        const isPasswordValid = yield bcryptjs_1.default.compare(previousPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid previous password" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        yield user.save();
        res.json({
            message: "Password updated successfully",
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.editProfilePassword = editProfilePassword;
const editProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const newUserData = Object.assign({}, req.body);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // Assuming user ID is stored in req.user by auth middleware
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const updatedUser = yield user_1.default.findByIdAndUpdate(userId, newUserData, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            message: "Profile updated successfully",
            user: { username: updatedUser.username, email: updatedUser.email },
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});
exports.editProfile = editProfile;
