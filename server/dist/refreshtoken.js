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
exports.refreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("./models/user"));
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
        if (!token) {
            res.status(401).json({ message: "Refresh token not provided" });
            return;
        }
        // Verify refresh token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET || "default_refresh_secret");
        const user = yield user_1.default.findOne({
            _id: decoded.userId,
            refreshtoken: token,
        });
        if (!user) {
            res.status(403).json({ message: "Invalid refresh token" });
            return;
        }
        // Issue new access token
        const accessToken = jsonwebtoken_1.default.sign({ userId: user._id, username: user.username, email: user.email, role: user.roles }, process.env.JWT_SECRET || "default_secret", { expiresIn: "15m" });
        res.json({
            message: "refreshtoken successful",
            user: { username: user.username, email: user.email, role: user.roles },
            accessToken,
        });
    }
    catch (err) {
        res.status(403).json({ message: "Invalid or expired refresh token" });
    }
});
exports.refreshToken = refreshToken;
