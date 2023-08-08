import express, {Request, Response, NextFunction} from 'express';
import {v4} from 'uuid';
import path from 'path';
import fs from 'fs';


let databaseFolder = path.join(__dirname,"../../src/bookDatabase")
let databaseFile = path.join(databaseFolder, "bookDatabase.json")

export const createBook = async(req:Request, res:Response, next:NextFunction)=>{
    try{
       if(!fs.existsSync(databaseFolder)){
        fs.mkdirSync(databaseFolder)
       }
       if(!fs.existsSync(databaseFile)){
        fs.writeFileSync(databaseFile, JSON.stringify([]))
       }

       //read from database

       let allBooks = [];
       try{
          const data = fs.readFileSync(databaseFile, 'utf-8')
            if(!data){
                return res.status(400).json({
                    message: 'Cannot read data'
                })
            }else{
                allBooks = JSON.parse(data)
            }

       }catch(parseErr){
           allBooks = [];
      }

      const{
        title,
        author,
        datePublished,
        description,
        pageCount,
        genre,
        bookId,
        publisher,
      } = req.body

      console.log({allBooks, type:typeof allBooks});
      

      let availableBooks = allBooks.find((book: { title: any; })=> book.title === title);
       if(availableBooks){
          return res.status(400).json({
            message: `Book already available`
          })
       }

       let newBook ={
        bookId: v4(),
        title: title,
        author: author,
        datePublished: datePublished,
        description: description,
        pageCount: pageCount,
        genre: genre,
        publisher: publisher,
        createdAt: new Date(),
        updatedAt: new Date()
       }

       allBooks.push(newBook)

       fs.writeFile(databaseFile, JSON.stringify(allBooks, null, 2), 'utf-8', (err) =>{
          if(err){
             return res.status(500).json({
                message: `Unable to add book`
             })
          }else{
            return res.status(200).json({
                message: `Book successfully added`,
                newBook
            })
          }
       })
    }catch(err){
        console.log(err);
        
    }
} 

// View a book
export const viewAllBooks = async(req:Request, res:Response, next:NextFunction)=> {
  try{
    const data = fs.readFileSync(databaseFile, 'utf-8')
    if(!data){
      return res.status(400).json({
          message: 'Cannot view data'
      })
    }
    if(data){
      let allBooks = JSON.parse(data);
      return res.status(200).json({
        message: 'Books successfully viewed',
        "allBooks": allBooks
      })
    }
    }catch(err){
      return res.status(500).json({err})
    }
}



export const viewOneBook = async(req:Request, res:Response, next:NextFunction)=> {
  try{
    const data = fs.readFileSync(databaseFile, 'utf-8')
    if(!data){
      return res.status(400).json({
          message: 'Cannot view data'
      })
    }else if(data){
      let allBooks = JSON.parse(data);
      // let id = req.params.id
      let book = allBooks.filter((x: { bookId: any; })=> x.bookId === req.params.id);

      return res.status(200).json({
        message: 'Book successfully viewed',
        "book": book
      })
    }
    }catch(err){
      return res.status(500).json({err})
    }
}




// //To update book

export const updatedBook = async(req:Request, res:Response, next:NextFunction)=>{

  let allBooks = [];
  try{
    const bookId = req.params.id
    const fieldToUpdate = req.body
  const data = fs.readFileSync(databaseFile, 'utf-8')
  const allBooks = JSON.parse(data)
  let existingBook = allBooks.find((book:any) => book.bookId === bookId);
  
  
  if (!existingBook) {
    return res.status(404).json({
      message: "Book does not exist"
    })
  }
  existingBook = {...existingBook, ...fieldToUpdate}

  fs.writeFile(databaseFile, JSON.stringify(allBooks, null, 2), 'utf-8', (err) =>{
    if(err){
       return res.status(500).json({
          message: `Unable to update book`
       })
    }else{
      return res.status(200).json({
          message: `Book successfully updated`,
          existingBook
      })
    }
 })
  
  }catch(err){
    return res.status(500).json({err})
  }

}



export const deleteOneBook = async(req:Request, res:Response, next:NextFunction)=> {
  try{
    const data = fs.readFileSync(databaseFile, 'utf-8')
    if(!data){
      return res.status(400).json({
          message: 'Cannot view data'
      })
    }else if(data){
      let allBooks = JSON.parse(data);
      // let id = req.params.id
      let book = allBooks.filter((x: {bookId:any}) => x.bookId === req.params.id);
      let books = allBooks.filter((x: { bookId: any; })=> x.bookId !== req.params.id);

      fs.writeFileSync(databaseFile, JSON.stringify(books, null, 2));

      return res.status(200).json({
        message: `Book successfully deleted`,

        "book": book
      })
    }
    }catch(err){
      return res.status(500).json({err})
    }
}
 