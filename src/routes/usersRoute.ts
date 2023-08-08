import express, {Request, Response, NextFunction }  from 'express';
import { createUser, login } from '../engine/usersEngine';
const router = express.Router();

//create a user
router.post('/signup', createUser);
router.post('/access', login);

export default router;

/* GET users listing. */
// router.get('/', function(req:Request, res:Response, next:NextFunction) {
//   res.send('respond with a resource');
// });




