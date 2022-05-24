"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const VerifyToken = (req, res, next) => {
    try {
        const token = req.headers['token'];
        if (!token) {
            return res.json({ error: 'Not authorized to access ! token not found!' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        req.users = decoded;
        req.body.users = decoded;
    }
    catch (error) {
        return res.json({ error: 'Invalid Token' });
    }
    next();
};
exports.VerifyToken = VerifyToken;
