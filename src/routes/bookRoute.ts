import express, {Request, Response, NextFunction }  from 'express';
import { createBook, updatedBook, viewAllBooks, viewOneBook, deleteOneBook  } from '../engine/bookEngine';
import {auth} from '../utilities/auth'
// import { updatedBook } from '../engine/bookEngine';

const router = express.Router();

//create a user
router.post('/create', auth, createBook)
router.put('/update/:id', auth, updatedBook)
router.get('/viewbooks', auth, viewAllBooks)
router.get('/viewbook/:id', auth, viewOneBook)
router.delete('/deletebook/:id', auth, deleteOneBook)
export default router;

// router.post('/access', login)

/* GET home page. */
// router.get('/', function(req:Request, res:Response, next:NextFunction) {
//   res.render('index', { title: 'Express' });
// });

