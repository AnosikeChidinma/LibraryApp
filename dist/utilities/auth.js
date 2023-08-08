"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (authorization === undefined) {
            return res.status(401).send({
                status: "ERROR",
                message: "Not authorized"
            });
        }
        const pin = authorization.split(" ")[1];
        if (!pin || pin === "") {
            return res.status(401).send({
                status: "ERROR",
                message: "Not well designed"
            });
        }
        const decoded = jsonwebtoken_1.default.verify(pin, "chidinmasophia");
        if ("user" in req) {
            req.user = decoded;
        }
        return next();
    }
    catch (err) {
        console.log(err);
    }
};
exports.auth = auth;
