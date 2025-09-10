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
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let MONGO_URI = '';
    if (process.env.NODE_ENV === 'production') {
        MONGO_URI = (_a = process.env.MONGO_URI_PROD) !== null && _a !== void 0 ? _a : '';
    }
    else {
        MONGO_URI = (_b = process.env.MONGO_URI) !== null && _b !== void 0 ? _b : '';
    }
    console.log('Connecting to MongoDB with URI:', MONGO_URI);
    if (!MONGO_URI) {
        throw new Error('MONGO_URI environment variable is not defined');
    }
    try {
        yield mongoose_1.default.connect(MONGO_URI);
        console.log('MongoDB connected');
    }
    catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
