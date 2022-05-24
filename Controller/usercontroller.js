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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.homepage = exports.loginUser = exports.resetPassword = exports.getUserByUsername = exports.getUsers = exports.createUser = void 0;
const uuid_1 = require("uuid");
const mssql_1 = __importDefault(require("mssql"));
const config_1 = __importDefault(require("../Config/config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const registervalidator_1 = require("../helpers/registervalidator");
const loginvalidator_1 = require("../helpers/loginvalidator");
const resetpasswordvalidator_1 = require("../helpers/resetpasswordvalidator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, uuid_1.v1)();
        const { fullname, email, password } = req.body;
        let pool = yield mssql_1.default.connect(config_1.default);
        const { error } = registervalidator_1.Registerschema.validate(req.body);
        if (error) {
            return res.json({ error: error.details[0].message });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .input('fullname', mssql_1.default.VarChar, fullname)
            .input('email', mssql_1.default.VarChar, email)
            .input('password', mssql_1.default.VarChar, hashedPassword)
            .execute('insertUser');
        res.status(200).json({ message: 'USer Created Successfully' });
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
exports.createUser = createUser;
// get all registeres users
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pool = yield mssql_1.default.connect(config_1.default);
        const users = yield pool.request().execute('getUsers');
        res.json(users.recordset);
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
exports.getUsers = getUsers;
// get by registered username
const getUserByUsername = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.params.email;
        let pool = yield mssql_1.default.connect(config_1.default);
        const user = yield pool.request()
            .input('email', mssql_1.default.VarChar, email)
            .execute('getUsersByUserName');
        if (!user.recordset[0]) {
            return res.json({ message: `User -test with username : ${email} does not exist` });
        }
        return res.json(user.recordset);
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
exports.getUserByUsername = getUserByUsername;
// reset pwd?/
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { password } = req.body;
        let pool = yield mssql_1.default.connect(config_1.default);
        const user = yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .execute('getUserById');
        // check if userId exists
        if (!user.recordset[0]) {
            return res.json({ message: `User with id: ${id} does not exist` });
        }
        // validation
        const { error } = resetpasswordvalidator_1.resetPasswordSchema.validate(req.body);
        if (error) {
            return res.json({ error: error.details[0].message });
        }
        // hashin
        const hashedPassword = yield bcrypt_1.default.hash(password, 15);
        yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .input('password', mssql_1.default.VarChar, hashedPassword)
            .execute('resetNewPassword');
        res.status(200).json({ "message": "Password reset successfully" });
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
exports.resetPassword = resetPassword;
// delete registered user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pool = yield mssql_1.default.connect(config_1.default);
        const { email, password } = req.body;
        const { error } = loginvalidator_1.LoginSchema.validate(req.body);
        if (error) {
            return res.json({ error: error.details[0].message });
        }
        const user = yield pool.request().query(` SELECT fullname,email,password FROM Users
            WHERE email='${email}'
            `);
        if (!user.recordset[0]) {
            return res.json({ message: `Invalid Credentials` });
        }
        const validpassword = yield bcrypt_1.default.compare(password, user.recordset[0].password);
        if (!validpassword) {
            return res.json({ message: `Invalid Credentials` });
        }
        const data = user.recordset.map(record => {
            const { password } = record, rest = __rest(record, ["password"]);
            return rest;
        });
        let payload = yield pool.request().query(` SELECT fullname,email FROM Users
            WHERE email='${email}'
            `);
        payload = payload.recordset[0];
        const token = jsonwebtoken_1.default.sign(payload, process.env.SECRET_KEY, { expiresIn: '30m' });
        res.json({ message: "Login Success",
            data, token });
    }
    catch (error) {
        res.json(error.message);
    }
});
exports.loginUser = loginUser;
const homepage = (req, res) => {
    res.json({ message: 'Hello! Eddy Welcome' });
};
exports.homepage = homepage;
// Update Registry
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        let pool = yield mssql_1.default.connect(config_1.default);
        const { fullname, email } = req.body;
        const user = yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .execute('getUser');
        if (!user.recordset[0]) {
            return res.json({ message: `User with id : ${id} Does Not exist` });
        }
        yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .input('fullname', mssql_1.default.VarChar, fullname)
            .input('email', mssql_1.default.VarChar, email)
            .execute('updateUser');
        res.json({ message: "User Successfully Updated" });
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
exports.updateUser = updateUser;
