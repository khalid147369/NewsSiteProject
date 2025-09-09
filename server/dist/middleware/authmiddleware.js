"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Bearer <token>
    if (!token)
        return res.status(401).json({ message: 'Token no proporcionado' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        next(error);
        return res.status(401).json({ message: 'Token inválido' });
    }
};
exports.verifyToken = verifyToken;
// Middleware para verificar si el usuario es admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Acceso denegado: solo administradores' });
};
exports.isAdmin = isAdmin;
