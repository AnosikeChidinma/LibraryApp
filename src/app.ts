import createError, { HttpError } from 'http-errors';
import express, {Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
// import userRoutes from './routes/usersRoute';

import bookRoute from './routes/bookRoute';
import usersRoute from './routes/usersRoute';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', usersRoute);
app.use('/book', bookRoute);



// catch 404 and forward to error handler
app.use(function(_req, _res, next) {
  next(createError(404));
});

// error handler
app.use((err:HttpError, req:Request, res:Response, next:NextFunction):any => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  
  // const port = process.env.port || 3050;
  // app.listen(port, () => console.log(`App is listening on port ${port}`));
});

export default app 
