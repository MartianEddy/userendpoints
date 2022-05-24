"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usercontroller_1 = require("../Controller/usercontroller");
const verify_1 = require("../middleware/verify");
const router = express_1.default.Router();
router.post('/create', usercontroller_1.createUser);
router.post('/login', usercontroller_1.loginUser);
router.get('/', usercontroller_1.getUsers);
router.get('/home', verify_1.VerifyToken, usercontroller_1.homepage);
router.get('/:email', usercontroller_1.getUserByUsername);
router.patch('/:id', usercontroller_1.updateUser);
router.patch('/:id', usercontroller_1.resetPassword);
router.delete('/:id', verify_1.VerifyToken, usercontroller_1.deleteUser);
exports.default = router;
