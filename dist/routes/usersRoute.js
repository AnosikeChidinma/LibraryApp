"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersEngine_1 = require("../engine/usersEngine");
const router = express_1.default.Router();
//create a user
router.post('/signup', usersEngine_1.createUser);
router.post('/access', usersEngine_1.login);
exports.default = router;
/* GET users listing. */
// router.get('/', function(req:Request, res:Response, next:NextFunction) {
//   res.send('respond with a resource');
// });
