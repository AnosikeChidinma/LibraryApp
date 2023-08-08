"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.createUser = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//create database dynamically
let databaseFolder = path_1.default.join(__dirname, "../../src/userDatabase");
let databaseFile = path_1.default.join(databaseFolder, "userDatabase.json");
const createUser = async (req, res, next) => {
    try {
        if (!fs_1.default.existsSync(databaseFolder)) {
            fs_1.default.mkdirSync(databaseFolder);
        }
        if (!fs_1.default.existsSync(databaseFile)) {
            fs_1.default.writeFileSync(databaseFile, " ");
        }
        //read from data
        let databaseRead = [];
        try {
            const data = fs_1.default.readFileSync(databaseFile, 'utf-8');
            if (!data) {
                return res.status(404).json({
                    message: `Error reading from database`
                });
            }
            else {
                databaseRead = JSON.parse(data);
            }
        }
        catch (parseError) {
            databaseRead = [];
        }
        //read from frontend
        const { userName, email, password } = req.body;
        //check if user's email exists
        const existingUserEmail = databaseRead.find((user) => user.email === email);
        if (existingUserEmail) {
            return res.status(404).json({
                message: `The email already exists`
            });
        }
        //bcrypt
        const saltLength = 9;
        const salt = await bcrypt_1.default.genSalt(saltLength);
        const hash = await bcrypt_1.default.hash(password, salt);
        //create user
        const newUser = {
            "id": (0, uuid_1.v4)(),
            "email": email,
            "password": hash,
            "createdAt": new Date(),
            "updatedAt": new Date(),
        };
        databaseRead.push(newUser);
        fs_1.default.writeFileSync(databaseFile, JSON.stringify(databaseRead, null, 2), 'utf-8');
        res.status(200).send({
            message: 'newUser has successfully been created',
            newUser
        });
        return;
    }
    catch (err) {
        console.log(err);
    }
};
exports.createUser = createUser;
const login = async (req, res, next) => {
    try {
        let databaseRead = [];
        const data = fs_1.default.readFileSync(databaseFile, 'utf-8');
        if (!data) {
            return res.status(404).json({
                message: `Error reading from database`
            });
        }
        else {
            databaseRead = JSON.parse(data);
        }
        const { email, password } = req.body;
        const thisUser = databaseRead.find((user) => user.email === email);
        if (!thisUser) {
            return res.status(404).json({
                message: `This user does not exist`
            });
        }
        if (thisUser) {
            const validate = await bcrypt_1.default.compare(password, thisUser.password);
            if (validate) {
                const generatedToken = jsonwebtoken_1.default.sign(thisUser, `${process.env.APP_SECRETE}`);
                return res.status(200).json({
                    message: 'successfully logged in',
                    email: thisUser.email,
                    generatedToken
                });
            }
            else {
                return res.send({
                    message: "you are not a validated user"
                });
            }
        }
    }
    catch (err) {
        console.log(err);
    }
};
exports.login = login;
