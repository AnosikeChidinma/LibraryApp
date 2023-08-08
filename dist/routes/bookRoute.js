"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookEngine_1 = require("../engine/bookEngine");
const auth_1 = require("../utilities/auth");
// import { updatedBook } from '../engine/bookEngine';
const router = express_1.default.Router();
//create a user
router.post('/create', auth_1.auth, bookEngine_1.createBook);
router.put('/update/:id', auth_1.auth, bookEngine_1.updatedBook);
router.get('/viewbooks/', auth_1.auth, bookEngine_1.viewAllBooks);
router.get('/viewbook/:id', auth_1.auth, bookEngine_1.viewOneBook);
router.delete('/deletebook/:id', auth_1.auth, bookEngine_1.deleteOneBook);
exports.default = router;
// router.post('/access', login)
/* GET home page. */
// router.get('/', function(req:Request, res:Response, next:NextFunction) {
//   res.render('index', { title: 'Express' });
// });
